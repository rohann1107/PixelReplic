import { ExtractedTokens, AnalysisEvidence } from '../../types';

export function generateDesignTokensJson(
  tokens: ExtractedTokens,
  evidence?: Partial<AnalysisEvidence>
): string {
  const tokenStructure = {
    $schema: 'https://pixelspec.dev/schemas/design-tokens.v1.json',
    metadata: {
      generator: 'PixelSpec v1.0.0',
      timestamp: evidence?.timestamp || new Date().toISOString(),
      sourceUrl: evidence?.url || 'unknown',
      analysisMode: evidence?.analysisMode || 'deterministic',
    },
    colors: {
      brand: tokens.colors.primary.map((c) => ({ hex: c.hex, rgb: c.rgb, frequency: c.frequency, isExact: c.isExact, source: c.source || (c.isExact ? 'measured' : 'inferred') })),
      background: tokens.colors.background.map((c) => ({ hex: c.hex, rgb: c.rgb, frequency: c.frequency, isExact: c.isExact, source: c.source || (c.isExact ? 'measured' : 'inferred') })),
      surface: tokens.colors.surface.map((c) => ({ hex: c.hex, rgb: c.rgb, frequency: c.frequency, isExact: c.isExact, source: c.source || (c.isExact ? 'measured' : 'inferred') })),
      text: tokens.colors.text.map((c) => ({ hex: c.hex, rgb: c.rgb, frequency: c.frequency, isExact: c.isExact, source: c.source || (c.isExact ? 'measured' : 'inferred') })),
      border: tokens.colors.border.map((c) => ({ hex: c.hex, rgb: c.rgb, frequency: c.frequency, isExact: c.isExact, source: c.source || (c.isExact ? 'measured' : 'inferred') })),
      accent: tokens.colors.accent.map((c) => ({ hex: c.hex, rgb: c.rgb, frequency: c.frequency, isExact: c.isExact, source: c.source || (c.isExact ? 'measured' : 'inferred') })),
      palette: tokens.colors.all.map((c) => ({ hex: c.hex, role: c.role, frequency: c.frequency, isExact: c.isExact, source: c.source || (c.isExact ? 'measured' : 'inferred') })),
    },
    typography: {
      families: tokens.typography.fontFamilies,
      scale: tokens.typography.scale.map((s) => ({
        name: s.name,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        lineHeight: s.lineHeight,
        letterSpacing: s.letterSpacing || 'normal',
        isExact: s.isExact,
        source: s.source || (s.isExact ? 'measured' : 'inferred'),
      })),
    },
    spacing: tokens.spacing.scale.reduce<Record<string, { value: string; px: number }>>((acc, curr) => {
      acc[curr.key] = { value: curr.value, px: curr.px };
      return acc;
    }, {}),
    radii: tokens.radii,
    shadows: tokens.shadows,
    borders: {
      subtle: `1px solid ${tokens.colors.border[0]?.hex || '#E2E8F0'}`,
      card: `1px solid ${tokens.colors.border[0]?.hex || '#E2E8F0'}`,
      focusRing: `2px solid ${tokens.colors.primary[0]?.hex || '#4F46E5'}`,
    },
    containers: tokens.containers,
    breakpoints: tokens.breakpoints,
  };

  return JSON.stringify(tokenStructure, null, 2);
}
