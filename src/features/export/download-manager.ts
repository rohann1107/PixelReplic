import { AnalysisResult } from '../../types';
import { generateSpecificationZip } from './zip-generator';
import { downloadFile, copyToClipboard } from '../../lib/formatting';

function sanitizeDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/[^a-zA-Z0-9.-]/g, '_');
  } catch {
    return 'website';
  }
}

export async function downloadCompleteZip(result: AnalysisResult): Promise<{ success: boolean; error?: string }> {
  try {
    const domain = sanitizeDomain(result.evidence.url);
    const filename = `${domain}-pixelspec-blueprint.zip`;

    const blob = await generateSpecificationZip({
      documents: result.documents,
      referenceImages: result.referenceImages,
    });

    downloadFile(filename, blob, 'application/zip');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to compile ZIP archive' };
  }
}

export function downloadDesignMarkdown(result: AnalysisResult): void {
  const domain = sanitizeDomain(result.evidence.url);
  downloadFile(`${domain}-DESIGN.md`, result.documents['DESIGN.md'], 'text/markdown;charset=utf-8');
}

export function downloadDesignText(result: AnalysisResult): void {
  const domain = sanitizeDomain(result.evidence.url);
  downloadFile(`${domain}-DESIGN.txt`, result.documents['DESIGN.txt'], 'text/plain;charset=utf-8');
}

export function downloadTokensJson(result: AnalysisResult): void {
  const domain = sanitizeDomain(result.evidence.url);
  downloadFile(`${domain}-design-tokens.json`, result.documents['design-tokens.json'], 'application/json;charset=utf-8');
}

export function downloadAssetsManifest(result: AnalysisResult): void {
  const domain = sanitizeDomain(result.evidence.url);
  downloadFile(`${domain}-assets-manifest.json`, result.documents['assets-manifest.json'], 'application/json;charset=utf-8');
}

export async function copyMarkdownToClipboard(result: AnalysisResult): Promise<boolean> {
  return await copyToClipboard(result.documents['DESIGN.md']);
}

export async function copyAgentPromptToClipboard(result: AnalysisResult): Promise<boolean> {
  return await copyToClipboard(result.documents['AGENT-PROMPT.md']);
}
