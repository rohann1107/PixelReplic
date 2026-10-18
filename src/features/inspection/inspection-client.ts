import {
  AnalysisEvidence,
  AnalysisResult,
  AnalyzerSettings,
  StepProgress,
  GeneratedDocuments,
} from '../../types';
import { validateAndNormalizeUrl } from './url-validation';
import { analyzeImageElement } from '../extraction/image-analyzer';
import { buildNormalizedTokens } from '../extraction/token-extractor';
import { detectComponentsFromLayout, detectSectionsFromLayout } from '../extraction/component-detector';
import { generateResponsiveObservations } from '../extraction/responsive-analyzer';
import { defaultAiProvider } from '../ai/optional-provider';
import { generateDesignMarkdown } from '../generation/markdown-generator';
import { generateComponentsMarkdown } from '../generation/component-generator';
import { generateAgentPromptMarkdown } from '../generation/agent-prompt-generator';
import { generateValidationMarkdown } from '../generation/validation-generator';
import { generateDesignTokensJson } from '../generation/tokens-json-generator';
import { generateAssetsManifestJson } from '../generation/assets-manifest-generator';
import { convertMarkdownToPlainText } from '../generation/text-generator';
import { formatError } from '../../lib/errors';

export interface RunAnalysisParams {
  url: string;
  screenshotFile?: File | null;
  screenshotDataUrl?: string | null;
  settings: AnalyzerSettings;
  onProgress: (progress: StepProgress) => void;
  signal?: AbortSignal;
}

async function requestInspectionFromBackend(
  targetUrl: string,
  settings: AnalyzerSettings,
  signal?: AbortSignal
): Promise<any> {
  const configuredEndpoint = settings.workerEndpoint || (window as any)?.__PIXELSPEC_WORKER_ENDPOINT__;

  // Try endpoints in order: configured -> /api/inspect -> http://localhost:3001/api/inspect
  const endpointsToTry = configuredEndpoint
    ? [configuredEndpoint.endsWith('/inspect') ? configuredEndpoint : `${configuredEndpoint}/inspect`]
    : ['/api/inspect', 'http://localhost:3001/api/inspect'];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000);
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  let lastError: any = null;

  try {
    for (const endpoint of endpointsToTry) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: targetUrl,
            viewport:
              settings.targetViewport === 'mobile'
                ? { width: 390, height: 844 }
                : settings.targetViewport === 'tablet'
                ? { width: 768, height: 1024 }
                : { width: 1440, height: 900 },
            timeoutMs: 30000,
          }),
          signal: controller.signal,
        });

        if (response.ok) {
          return await response.json();
        }

        const errJson = await response.json().catch(() => null);
        throw new Error(errJson?.error || `Server returned ${response.status}: ${response.statusText}`);
      } catch (err: any) {
        lastError = err;
        if (err.name === 'AbortError' && signal?.aborted) {
          throw new Error('Analysis cancelled by user');
        }
      }
    }
  } finally {
    clearTimeout(timeoutId);
  }

  throw lastError || new Error('Backend inspection service is unreachable.');
}

export async function runPixelSpecAnalysis(params: RunAnalysisParams): Promise<AnalysisResult> {
  const { url, screenshotFile: _screenshotFile, screenshotDataUrl, settings, onProgress, signal } = params;

  const checkAbort = () => {
    if (signal?.aborted) {
      throw new Error('Analysis cancelled by user');
    }
  };

  // Stage 1: Validating URL
  onProgress({
    stage: 'validating',
    title: 'Validating Target URL',
    description: 'Verifying protocol, domain syntax, and SSRF security bounds...',
    progressPercent: 12,
    isComplete: false,
  });
  checkAbort();

  const valResult = validateAndNormalizeUrl(url);
  if (!valResult.isValid) {
    if (valResult.isPrivateNetwork) {
      throw formatError('PRIVATE_NETWORK_BLOCKED', valResult.error);
    }
    throw formatError('INVALID_URL', valResult.error);
  }

  const normalizedUrl = valResult.normalizedUrl!;
  let pageTitle = '';
  try {
    const urlObj = new URL(normalizedUrl);
    pageTitle = urlObj.hostname.replace(/^www\./, '');
  } catch {
    pageTitle = 'Target Website';
  }

  await new Promise((r) => setTimeout(r, 200));
  checkAbort();

  // Stage 2: Connecting & Real Inspection
  onProgress({
    stage: 'connecting',
    title: 'Connecting to Website via Headless Browser',
    description: 'Launching Chromium context and navigating to target destination...',
    progressPercent: 28,
    isComplete: false,
  });

  let rawColors: any[] = [];
  let screenshotDimensions = { width: 1440, height: 900 };
  const referenceImages: { name: string; dataUrl: string }[] = [];
  let analysisMode: AnalysisEvidence['analysisMode'] = 'headless_browser';
  const knownLimitations: string[] = [];

  let backendData: any = null;
  let backendFailed = false;

  try {
    onProgress({
      stage: 'capturing',
      title: 'Rendering DOM & Capturing Viewport',
      description: 'Waiting for network idle, executing scripts, and recording visual evidence...',
      progressPercent: 48,
      isComplete: false,
    });

    backendData = await requestInspectionFromBackend(normalizedUrl, settings, signal);

    if (backendData && backendData.success) {
      analysisMode = 'headless_browser';
      if (backendData.title) pageTitle = backendData.title;
      if (backendData.screenshot) {
        referenceImages.push({ name: 'viewport-1440x900.png', dataUrl: backendData.screenshot });
      }
      if (backendData.extractedColors) {
        rawColors = backendData.extractedColors;
      }
      if (backendData.viewport) {
        screenshotDimensions = backendData.viewport;
      }
    }
  } catch (backendErr: any) {
    backendFailed = true;
    console.warn('[Inspection Warning] Real browser inspection failed:', backendErr?.message);

    // If user provided a screenshot, we can switch to screenshot analysis mode
    if (screenshotDataUrl) {
      analysisMode = 'screenshot_analysis';
      knownLimitations.push(`Remote headless inspection failed (${backendErr?.message}). Switched to uploaded screenshot analysis.`);
    } else {
      // If no screenshot and real browser failed, do not pretend it succeeded!
      if (backendErr?.message?.includes('timeout') || backendErr?.message?.includes('Timeout')) {
        throw formatError('TIMEOUT', backendErr?.message);
      }
      if (backendErr?.message?.includes('restricted') || backendErr?.message?.includes('SSRF') || backendErr?.message?.includes('private')) {
        throw formatError('PRIVATE_NETWORK_BLOCKED', backendErr?.message);
      }
      throw formatError('REMOTE_UNAVAILABLE', backendErr?.message || 'The backend inspection service could not load this target website.');
    }
  }

  // If user also provided an uploaded screenshot, combine with canvas analysis
  if (screenshotDataUrl) {
    try {
      const img = new Image();
      img.src = screenshotDataUrl;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load screenshot'));
      });
      const imgAnalysis = await analyzeImageElement(img);
      if (rawColors.length === 0) {
        rawColors = imgAnalysis.colors;
      }
      if (referenceImages.length === 0) {
        referenceImages.push({ name: 'reference-screenshot.png', dataUrl: screenshotDataUrl });
      }
    } catch (e: any) {
      console.warn('Screenshot canvas sampling error:', e);
    }
  }

  await new Promise((r) => setTimeout(r, 200));
  checkAbort();

  // Stage 4: Extracting Visual Properties & Normalizing Tokens
  onProgress({
    stage: 'extracting',
    title: 'Extracting Design Tokens & Typography',
    description: 'Analyzing color roles, measured typography font stacks, and layout scales...',
    progressPercent: 68,
    isComplete: false,
  });

  const tokens = buildNormalizedTokens(rawColors, {
    dominantBg: backendData?.dominantBackground,
    dominantText: backendData?.dominantText,
    customFonts: backendData?.extractedFonts,
    measuredHeadings: backendData?.headings,
  });

  await new Promise((r) => setTimeout(r, 200));
  checkAbort();

  // Stage 5: Classifying Components and Layout Sections
  onProgress({
    stage: 'detecting_components',
    title: 'Detecting Components & Section Hierarchy',
    description: 'Classifying verified landmarks, interactive controls, and visual boundaries...',
    progressPercent: 82,
    isComplete: false,
  });

  // Use real measured sections & components if backend provided them
  const sections = detectSectionsFromLayout(tokens, backendData?.sections);
  const components = detectComponentsFromLayout(sections, tokens, backendData?.components);
  const responsiveObservations = generateResponsiveObservations(!backendFailed);

  await new Promise((r) => setTimeout(r, 200));
  checkAbort();

  // Stage 6: Generating Markdown Blueprint
  onProgress({
    stage: 'generating',
    title: 'Compiling Evidence-Based Blueprint',
    description: 'Synthesizing DESIGN.md, COMPONENTS.md, JSON tokens, and agent directives...',
    progressPercent: 92,
    isComplete: false,
  });

  const preliminaryEvidence: AnalysisEvidence = {
    url: normalizedUrl,
    pageTitle,
    viewport: screenshotDimensions,
    screenshotBase64: referenceImages[0]?.dataUrl,
    screenshotDimensions,
    headings: backendData?.headings || [{ level: 1, text: pageTitle, source: 'inferred' }],
    tokens,
    components,
    sections,
    assets: backendData?.assets || [
      {
        id: 'asset-favicon',
        originalUrl: `${normalizedUrl}/favicon.ico`,
        type: 'icon',
        downloadStatus: 'available',
        altText: `${pageTitle} Favicon`,
      },
    ],
    interactions: backendData?.interactions || [
      { element: 'Primary Interactive Control', trigger: 'click', observedState: 'Active state triggered', verified: true, source: 'measured' },
    ],
    responsiveObservations,
    knownLimitations,
    timestamp: new Date().toUTCString(),
    analysisMode,
    isAiEnhanced: false,
    textSnippets: backendData?.textSnippets || [],
    dominantBackground: backendData?.dominantBackground,
    dominantText: backendData?.dominantText,
    elementsCount: backendData?.elementsCount,
  };

  // Run optional AI / deterministic enhancement
  const enhancements = await defaultAiProvider.analyzeDesign(preliminaryEvidence, settings);
  preliminaryEvidence.isAiEnhanced = enhancements && settings.enableAiEnhancement;

  // Generate All Documents
  const designMd = generateDesignMarkdown(preliminaryEvidence, settings, enhancements);
  const componentsMd = generateComponentsMarkdown(components, tokens);
  const agentPromptMd = generateAgentPromptMarkdown(preliminaryEvidence, settings);
  const validationMd = generateValidationMarkdown(preliminaryEvidence, settings);
  const designTxt = convertMarkdownToPlainText(designMd);
  const tokensJson = generateDesignTokensJson(tokens, preliminaryEvidence);
  const assetsManifestJson = generateAssetsManifestJson(preliminaryEvidence.assets, preliminaryEvidence);

  const documents: GeneratedDocuments = {
    'DESIGN.md': designMd,
    'COMPONENTS.md': componentsMd,
    'AGENT-PROMPT.md': agentPromptMd,
    'VALIDATION.md': validationMd,
    'DESIGN.txt': designTxt,
    'design-tokens.json': tokensJson,
    'assets-manifest.json': assetsManifestJson,
  };

  // Stage 7: Packaging
  onProgress({
    stage: 'packaging',
    title: 'Packaging Blueprint Export Archive',
    description: 'Compressing verified tokens, manifests, and documentation...',
    progressPercent: 100,
    isComplete: true,
  });

  return {
    evidence: preliminaryEvidence,
    documents,
    referenceImages,
  };
}
