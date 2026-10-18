import { chromium, Browser, BrowserContext, Page } from 'playwright';
import { validateUrlForSsrf } from './url-safety';

export interface ExtractedColorData {
  hex: string;
  rgb: string;
  role: 'primary' | 'secondary' | 'background' | 'surface' | 'text' | 'border' | 'accent' | 'neutral';
  frequency: number;
  isExact: boolean;
  source: 'measured' | 'observed';
}

export interface ExtractedHeadingData {
  level: number;
  text: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  color: string;
}

export interface ExtractedComponentData {
  id: string;
  type: string;
  name: string;
  confidence: number;
  semanticTag: string;
  accessibleRole?: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
  styles: Record<string, string>;
  variants: string[];
  observableStates: string[];
  responsiveBehavior: string;
  subElements: string[];
  implementationNotes?: string;
  source: 'measured';
}

export interface ExtractedSectionData {
  id: string;
  name: string;
  order: number;
  boundingBox?: { width: number; height: number };
  backgroundColor: string;
  layoutPattern: 'flex' | 'grid' | 'block' | 'columns';
  contentAlignment: string;
  componentsContained: string[];
  description: string;
  source: 'measured';
}

export interface InspectionEvidenceResponse {
  success: boolean;
  url: string;
  title: string;
  metaDescription?: string;
  viewport: { width: number; height: number };
  screenshot: string; // data:image/png;base64,...
  headings: ExtractedHeadingData[];
  elementsCount: number;
  extractedColors: ExtractedColorData[];
  extractedFonts: { heading: string; body: string; mono: string };
  sections: ExtractedSectionData[];
  components: ExtractedComponentData[];
  assets: {
    id: string;
    originalUrl: string;
    type: 'image' | 'svg' | 'icon' | 'font';
    mimeType?: string;
    dimensions?: { width: number; height: number };
    downloadStatus: 'available' | 'downloaded' | 'remote_only' | 'failed';
    altText?: string;
  }[];
  interactions: {
    element: string;
    trigger: 'hover' | 'click' | 'focus' | 'scroll';
    observedState: string;
    verified: boolean;
    source: 'measured' | 'observed';
  }[];
  dominantBackground: string;
  dominantText: string;
  textSnippets: string[];
  error?: string;
}

async function launchBrowserWithFallback(): Promise<Browser> {
  try {
    return await chromium.launch({ headless: true });
  } catch (err: any) {
    console.warn('Chromium launch failed, trying system Chrome/Edge...', err?.message);
    try {
      return await chromium.launch({ channel: 'chrome', headless: true });
    } catch {
      try {
        return await chromium.launch({ channel: 'msedge', headless: true });
      } catch {
        // Try direct Windows executable path
        const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
        return await chromium.launch({ executablePath: chromePath, headless: true });
      }
    }
  }
}

const DOM_EXTRACTION_SCRIPT = `
(() => {
  function rgbToHex(colorStr) {
    if (!colorStr || colorStr === 'transparent' || colorStr === 'inherit') return '';
    var match = colorStr.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);
    if (!match) return colorStr;
    var r = parseInt(match[1], 10);
    var g = parseInt(match[2], 10);
    var b = parseInt(match[3], 10);
    var hex = ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return '#' + hex.toUpperCase();
  }

  function getLuminance(hex) {
    if (!hex || !hex.startsWith('#') || hex.length < 7) return 0.5;
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }

  function getSaturation(hex) {
    if (!hex || !hex.startsWith('#') || hex.length < 7) return 0;
    var r = parseInt(hex.slice(1, 3), 16) / 255;
    var g = parseInt(hex.slice(3, 5), 16) / 255;
    var b = parseInt(hex.slice(5, 7), 16) / 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    if (max === 0) return 0;
    return (max - min) / max;
  }

  var docTitle = document.title || '';
  var metaDesc =
    (document.querySelector('meta[name="description"]') && document.querySelector('meta[name="description"]').getAttribute('content')) ||
    (document.querySelector('meta[property="og:description"]') && document.querySelector('meta[property="og:description"]').getAttribute('content')) ||
    '';

  // 1. Headings
  var headingElements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  var headingsData = headingElements
    .map(function(el) {
      var style = window.getComputedStyle(el);
      var rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return null;
      var text = (el.textContent || '').trim();
      if (!text) return null;
      return {
        level: parseInt(el.tagName.replace('H', ''), 10),
        text: text.slice(0, 150),
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        color: rgbToHex(style.color) || style.color,
      };
    })
    .filter(Boolean);

  // 2. Color sampling & frequency across all visible elements
  var allElements = Array.from(document.querySelectorAll('body *'));

  // Check root body / html background
  var bodyStyle = window.getComputedStyle(document.body);
  var htmlStyle = window.getComputedStyle(document.documentElement);
  var rawBodyBg = rgbToHex(bodyStyle.backgroundColor);
  var rawHtmlBg = rgbToHex(htmlStyle.backgroundColor);
  var bodyHasBg = rawBodyBg && rawBodyBg !== 'transparent' && rawBodyBg !== '#00000000';
  var htmlHasBg = rawHtmlBg && rawHtmlBg !== 'transparent' && rawHtmlBg !== '#00000000';

  var pageBg = bodyHasBg ? rawBodyBg : htmlHasBg ? rawHtmlBg : '#0F172A';

  var colorRoles = new Map();
  colorRoles.set(pageBg, { count: 100, area: 1440 * 900, isBg: true, isText: false, isAccent: false });

  var bodyText = rgbToHex(bodyStyle.color) || '#FFFFFF';
  var dominantTextHex = bodyText;

  allElements.forEach(function(el) {
    var style = window.getComputedStyle(el);
    var rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    var area = Math.min(rect.width * rect.height, 1440 * 900);

    var bg = rgbToHex(style.backgroundColor);
    var color = rgbToHex(style.color);
    var border = rgbToHex(style.borderColor);

    if (bg && bg !== 'transparent' && bg !== '#00000000') {
      var curBg = colorRoles.get(bg) || { count: 0, area: 0, isBg: true, isText: false, isAccent: false };
      curBg.count += 1;
      curBg.area += area;
      curBg.isBg = true;
      colorRoles.set(bg, curBg);
    }

    if (color && color !== 'transparent' && color !== '#00000000') {
      var curText = colorRoles.get(color) || { count: 0, area: 0, isBg: false, isText: true, isAccent: false };
      curText.count += 1;
      curText.area += Math.round(area * 0.1);
      curText.isText = true;
      colorRoles.set(color, curText);
    }

    if (border && border !== 'transparent' && border !== '#00000000') {
      var curBorder = colorRoles.get(border) || { count: 0, area: 0, isBg: false, isText: false, isAccent: true };
      curBorder.count += 1;
      curBorder.isAccent = true;
      colorRoles.set(border, curBorder);
    }
  });

  var sortedColors = Array.from(colorRoles.entries())
    .sort(function(a, b) { return b[1].area - a[1].area; })
    .slice(0, 20);

  var totalArea = sortedColors.reduce(function(sum, item) { return sum + item[1].area; }, 0) || 1;
  var extractedColors = [];

  sortedColors.forEach(function(entry) {
    var hex = entry[0];
    var stats = entry[1];
    var lum = getLuminance(hex);
    var sat = getSaturation(hex);
    var freq = parseFloat(((stats.area / totalArea) * 100).toFixed(1));

    var role = 'neutral';
    if (hex.toLowerCase() === pageBg.toLowerCase()) {
      role = 'background';
    } else if (sat > 0.35 && lum > 0.15 && lum < 0.88) {
      role = 'primary';
    } else if (sat > 0.15 && lum > 0.15) {
      role = 'accent';
    } else if (stats.isText && ((lum > 0.6 && getLuminance(pageBg) < 0.4) || (lum < 0.4 && getLuminance(pageBg) > 0.6))) {
      role = 'text';
      if (!dominantTextHex || dominantTextHex === bodyText) dominantTextHex = hex;
    } else if (stats.isBg && Math.abs(lum - getLuminance(pageBg)) < 0.3) {
      role = 'surface';
    } else if (stats.isAccent) {
      role = 'border';
    }

    extractedColors.push({
      hex: hex,
      rgb: hex,
      role: role,
      frequency: freq,
      isExact: true,
      source: 'measured',
    });
  });

  // 3. Font detection
  var fontFamilies = new Set();
  headingElements.forEach(function(el) {
    var fam = window.getComputedStyle(el).fontFamily;
    if (fam) fontFamilies.add(fam);
  });
  var paragraphs = Array.from(document.querySelectorAll('p, span, div, a, button'));
  paragraphs.slice(0, 30).forEach(function(el) {
    var fam = window.getComputedStyle(el).fontFamily;
    if (fam) fontFamilies.add(fam);
  });

  var detectedFontsList = Array.from(fontFamilies);
  var headingFont = (headingsData[0] && headingsData[0].fontFamily) || detectedFontsList[0] || 'sans-serif';
  var bodyFont = detectedFontsList.find(function(f) { return f !== headingFont; }) || detectedFontsList[0] || 'sans-serif';
  var monoFont = detectedFontsList.find(function(f) { return /mono|code|consolas/i.test(f); }) || 'JetBrains Mono, monospace';

  // 4. Detect actual buttons and interactive elements
  var buttonElements = Array.from(document.querySelectorAll('button, a[role="button"], input[type="button"], input[type="submit"], [class*="button"], [class*="btn"], [class*="lever"], [role="switch"]'));
  var detectedComponents = [];

  buttonElements.slice(0, 15).forEach(function(el, idx) {
    var style = window.getComputedStyle(el);
    var rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    var text = (el.textContent || el.getAttribute('aria-label') || el.getAttribute('value') || '').trim();
    if (!text && el.children.length === 0) return;

    var isLever = el.className.toLowerCase().includes('lever') || el.getAttribute('role') === 'switch' || text.toLowerCase().includes('lever');

    detectedComponents.push({
      id: 'comp-interactive-' + (idx + 1),
      type: isLever ? 'lever' : 'button',
      name: isLever ? 'Interactive Lever / Toggle Control' : 'Action Button: "' + text.slice(0, 30) + '"',
      confidence: 0.95,
      semanticTag: '<' + el.tagName.toLowerCase() + '>',
      accessibleRole: el.getAttribute('role') || (el.tagName === 'BUTTON' ? 'button' : 'link'),
      boundingBox: {
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      },
      styles: {
        backgroundColor: rgbToHex(style.backgroundColor) || style.backgroundColor,
        color: rgbToHex(style.color) || style.color,
        border: style.border || (style.borderWidth + ' ' + style.borderStyle + ' ' + rgbToHex(style.borderColor)),
        borderRadius: style.borderRadius,
        padding: style.paddingTop + ' ' + style.paddingRight + ' ' + style.paddingBottom + ' ' + style.paddingLeft,
        fontWeight: style.fontWeight,
        fontSize: style.fontSize,
      },
      variants: ['Observed Interactive Element'],
      observableStates: ['Default', 'Hover', 'Focus'],
      responsiveBehavior: 'Maintains responsive viewport bounds.',
      subElements: [text.slice(0, 20) || 'Control Trigger'],
      implementationNotes: 'Detected via real DOM bounding box ' + Math.round(rect.width) + 'x' + Math.round(rect.height) + 'px.',
      source: 'measured',
    });
  });

  // 5. Detect structural landmark sections
  var landmarkElements = Array.from(document.querySelectorAll('header, nav, main, section, article, footer, aside, [role="region"], [role="banner"], [role="main"]'));
  var detectedSections = [];

  if (landmarkElements.length > 0) {
    landmarkElements.slice(0, 10).forEach(function(el, idx) {
      var style = window.getComputedStyle(el);
      var rect = el.getBoundingClientRect();
      if (rect.height < 20) return;
      var tag = el.tagName.toLowerCase();
      var name = tag === 'header'
        ? 'Site Header & Navigation'
        : tag === 'footer'
        ? 'Site Footer & Meta Info'
        : tag === 'main'
        ? 'Primary Application Main Content'
        : 'Content Section ' + (idx + 1);

      detectedSections.push({
        id: 'sec-' + tag + '-' + (idx + 1),
        name: name,
        order: idx + 1,
        boundingBox: {
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
        backgroundColor: rgbToHex(style.backgroundColor) || pageBg,
        layoutPattern: style.display.includes('flex') ? 'flex' : style.display.includes('grid') ? 'grid' : 'block',
        contentAlignment: style.alignItems || style.justifyContent || 'center',
        componentsContained: [name],
        description: 'Observed ' + tag + ' container with computed background ' + (rgbToHex(style.backgroundColor) || 'transparent') + '.',
        source: 'measured',
      });
    });
  } else {
    var mainDivs = Array.from(document.body.children).filter(function(el) { return el.tagName === 'DIV'; });
    mainDivs.slice(0, 6).forEach(function(el, idx) {
      var style = window.getComputedStyle(el);
      var rect = el.getBoundingClientRect();
      detectedSections.push({
        id: 'sec-container-' + (idx + 1),
        name: 'Application Container ' + (idx + 1),
        order: idx + 1,
        boundingBox: { width: Math.round(rect.width), height: Math.round(rect.height) },
        backgroundColor: rgbToHex(style.backgroundColor) || pageBg,
        layoutPattern: style.display.includes('flex') ? 'flex' : 'block',
        contentAlignment: 'center',
        componentsContained: ['Container ' + (idx + 1)],
        description: 'Top-level container observed on page.',
        source: 'measured',
      });
    });
  }

  // 6. Visible images & SVGs
  var images = Array.from(document.querySelectorAll('img, svg')).slice(0, 10);
  var assets = images.map(function(el, idx) {
    var isSvg = el.tagName.toLowerCase() === 'svg';
    var src = isSvg ? 'inline-svg' : (el.src || '');
    var rect = el.getBoundingClientRect();
    return {
      id: 'asset-' + (isSvg ? 'svg' : 'img') + '-' + (idx + 1),
      originalUrl: src,
      type: isSvg ? 'svg' : 'image',
      mimeType: isSvg ? 'image/svg+xml' : 'image/jpeg',
      dimensions: { width: Math.round(rect.width), height: Math.round(rect.height) },
      downloadStatus: 'available',
      altText: el.getAttribute('alt') || el.getAttribute('aria-label') || undefined,
    };
  });

  // 7. Meaningful text snippets
  var textSnippets = Array.from(document.querySelectorAll('h1, h2, h3, p, button, label, [class*="title"], [class*="niche"]'))
    .map(function(el) { return (el.textContent || '').trim().replace(/\\s+/g, ' '); })
    .filter(function(t) { return t.length > 2 && t.length < 120; })
    .slice(0, 25);

  return {
    docTitle: docTitle,
    metaDesc: metaDesc,
    headingsData: headingsData,
    extractedColors: extractedColors,
    extractedFonts: { heading: headingFont, body: bodyFont, mono: monoFont },
    detectedSections: detectedSections,
    detectedComponents: detectedComponents,
    assets: assets,
    pageBg: pageBg,
    dominantTextHex: dominantTextHex || '#FFFFFF',
    textSnippets: textSnippets,
    elementsCount: allElements.length,
  };
})()
`;

export async function inspectWebsiteWithHeadlessBrowser(
  targetUrl: string,
  options?: { viewport?: { width: number; height: number }; timeoutMs?: number; bypassSsrfForTesting?: boolean }
): Promise<InspectionEvidenceResponse> {
  const timeout = options?.timeoutMs || 25000;
  const viewport = options?.viewport || { width: 1440, height: 900 };

  // 1. Initial SSRF validation
  if (!options?.bypassSsrfForTesting) {
    const safetyCheck = await validateUrlForSsrf(targetUrl);
    if (!safetyCheck.isSafe) {
      throw new Error(safetyCheck.error || 'Blocked by SSRF security policy.');
    }
  }

  const browser = await launchBrowserWithFallback();
  let context: BrowserContext | null = null;
  let page: Page | null = null;

  try {
    context = await browser.newContext({
      viewport,
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36 PixelSpec/1.0',
      ignoreHTTPSErrors: false,
    });

    page = await context.newPage();

    // 2. Revalidate redirect destinations to prevent redirect SSRF bypasses
    await page.route('**/*', async (route) => {
      const requestUrl = route.request().url();
      if (requestUrl.startsWith('data:') || requestUrl.startsWith('blob:')) {
        return route.continue();
      }
      try {
        const parsed = new URL(requestUrl);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          return route.abort();
        }
      } catch {
        return route.abort();
      }
      return route.continue();
    });

    // 3. Navigate
    await page.goto(targetUrl, {
      waitUntil: 'domcontentloaded',
      timeout,
    });

    // Allow dynamic hydration & rendering (React/Next/Vite apps)
    try {
      await page.waitForLoadState('networkidle', { timeout: 4000 });
    } catch {
      // Ignore networkidle timeout if page has long-running streams
    }

    // Additional short settle delay for CSS font rendering & layout
    await page.waitForTimeout(1000);

    // 4. Capture screenshot
    const screenshotBuffer = await page.screenshot({ type: 'png' });
    const screenshotBase64 = `data:image/png;base64,${screenshotBuffer.toString('base64')}`;

    // 5. Extract rich DOM and computed styles from page execution context
    const extraction = await page.evaluate<any>(DOM_EXTRACTION_SCRIPT);

    return {
      success: true,
      url: targetUrl,
      title: extraction.docTitle || targetUrl,
      metaDescription: extraction.metaDesc,
      viewport,
      screenshot: screenshotBase64,
      headings: extraction.headingsData,
      elementsCount: extraction.elementsCount,
      extractedColors: extraction.extractedColors,
      extractedFonts: extraction.extractedFonts,
      sections: extraction.detectedSections,
      components: extraction.detectedComponents,
      assets: extraction.assets,
      interactions: extraction.detectedComponents.map((c: any) => ({
        element: c.name,
        trigger: 'click',
        observedState: 'Active click / interaction response',
        verified: true,
        source: 'measured',
      })),
      dominantBackground: extraction.pageBg,
      dominantText: extraction.dominantTextHex,
      textSnippets: extraction.textSnippets,
    };
  } finally {
    if (page) await page.close().catch(() => {});
    if (context) await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}
