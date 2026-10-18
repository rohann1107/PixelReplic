import { ColorToken } from '../../types';

export interface ImageAnalysisData {
  dimensions: { width: number; height: number };
  colors: ColorToken[];
  dominantBackground: string;
  dominantText: string;
  horizontalBands: { yPercent: number; heightPercent: number; avgBrightness: number }[];
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function getLuminance(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function getSaturation(r: number, g: number, b: number): number {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

export async function analyzeImageElement(img: HTMLImageElement): Promise<ImageAnalysisData> {
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  // Use a canvas scaled down for fast deterministic sampling (e.g., max 400x400)
  const sampleWidth = Math.min(width, 320);
  const sampleHeight = Math.min(height, Math.round((height / width) * 320));

  const canvas = document.createElement('canvas');
  canvas.width = sampleWidth;
  canvas.height = sampleHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  ctx.drawImage(img, 0, 0, sampleWidth, sampleHeight);
  const imgData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
  const data = imgData.data;

  // Color quantization & clustering with map
  const colorBuckets = new Map<string, { r: number; g: number; b: number; count: number }>();
  const bandBrightness: number[] = new Array(8).fill(0);
  const bandCounts: number[] = new Array(8).fill(0);

  const step = 4; // Sample every 4th pixel for speed and high accuracy
  for (let i = 0; i < data.length; i += step * 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 128) continue; // Skip transparent pixels

    // Quantize to step of 16 to cluster close shades
    const qr = Math.round(r / 16) * 16;
    const qg = Math.round(g / 16) * 16;
    const qb = Math.round(b / 16) * 16;
    const key = `${qr},${qg},${qb}`;

    const existing = colorBuckets.get(key);
    if (existing) {
      existing.count += 1;
      existing.r = (existing.r + r) / 2;
      existing.g = (existing.g + g) / 2;
      existing.b = (existing.b + b) / 2;
    } else {
      colorBuckets.set(key, { r, g, b, count: 1 });
    }

    // Measure vertical band distribution
    const pixelIndex = i / 4;
    const y = Math.floor(pixelIndex / sampleWidth);
    const bandIdx = Math.min(7, Math.floor((y / sampleHeight) * 8));
    bandBrightness[bandIdx] += getLuminance(r, g, b);
    bandCounts[bandIdx] += 1;
  }

  // Sort clusters by count
  const sortedClusters = Array.from(colorBuckets.values()).sort((a, b) => b.count - a.count);
  const totalPixelsSampled = sortedClusters.reduce((acc, c) => acc + c.count, 0) || 1;

  const colorTokens: ColorToken[] = [];
  let foundBackground = false;
  let dominantBgHex = '#FFFFFF';
  let dominantTextHex = '#0F172A';

  for (const c of sortedClusters.slice(0, 16)) {
    const hex = rgbToHex(c.r, c.g, c.b);
    const freq = parseFloat(((c.count / totalPixelsSampled) * 100).toFixed(1));
    const lum = getLuminance(c.r, c.g, c.b);
    const sat = getSaturation(c.r, c.g, c.b);

    let role: ColorToken['role'] = 'neutral';

    if (!foundBackground && freq > 15) {
      role = 'background';
      foundBackground = true;
      dominantBgHex = hex;
    } else if (sat > 0.45 && freq > 1) {
      role = colorTokens.some((t) => t.role === 'primary') ? 'accent' : 'primary';
    } else if (lum < 0.25) {
      role = 'text';
      if (!dominantTextHex || dominantTextHex === '#0F172A') dominantTextHex = hex;
    } else if (lum > 0.85) {
      role = 'surface';
    } else if (sat > 0.2) {
      role = 'secondary';
    } else {
      role = 'border';
    }

    colorTokens.push({
      hex,
      rgb: `rgb(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)})`,
      role,
      frequency: freq,
      isExact: true,
    });
  }

  // Band analysis
  const horizontalBands = bandBrightness.map((totalBright, idx) => ({
    yPercent: Math.round((idx / 8) * 100),
    heightPercent: 12.5,
    avgBrightness: bandCounts[idx] ? totalBright / bandCounts[idx] : 0.5,
  }));

  return {
    dimensions: { width, height },
    colors: colorTokens,
    dominantBackground: dominantBgHex,
    dominantText: dominantTextHex,
    horizontalBands,
  };
}
