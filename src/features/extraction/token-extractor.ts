import { ExtractedTokens, ColorToken, TypographyToken } from '../../types';

export function buildNormalizedTokens(
  rawColors: ColorToken[],
  options?: {
    dominantBg?: string;
    dominantText?: string;
    customFonts?: { heading: string; body: string; mono: string };
    measuredHeadings?: {
      level: number;
      text: string;
      fontFamily?: string;
      fontSize?: string;
      fontWeight?: string;
      lineHeight?: string;
      color?: string;
      source?: import('../../types').EvidenceSource;
    }[];
  }
): ExtractedTokens {
  const isFallback = rawColors.length === 0;

  const allColors = rawColors.length > 0
    ? rawColors
    : [
        { hex: '#0F172A', role: 'text' as const, frequency: 32.5, isExact: false, source: 'inferred' as const },
        { hex: '#FFFFFF', role: 'background' as const, frequency: 45.2, isExact: false, source: 'inferred' as const },
        { hex: '#4F46E5', role: 'primary' as const, frequency: 8.4, isExact: false, source: 'inferred' as const },
        { hex: '#F1F5F9', role: 'surface' as const, frequency: 12.1, isExact: false, source: 'inferred' as const },
        { hex: '#E2E8F0', role: 'border' as const, frequency: 6.3, isExact: false, source: 'inferred' as const },
        { hex: '#8B5CF6', role: 'accent' as const, frequency: 4.1, isExact: false, source: 'inferred' as const },
      ];

  let primary = allColors.filter((c) => c.role === 'primary');
  let background = allColors.filter((c) => c.role === 'background');
  let surface = allColors.filter((c) => c.role === 'surface');
  let text = allColors.filter((c) => c.role === 'text');
  let border = allColors.filter((c) => c.role === 'border');
  let accent = allColors.filter((c) => c.role === 'accent');

  // If specific dominant background was passed
  if (options?.dominantBg) {
    const bgHex = options.dominantBg.toUpperCase();
    const existing = allColors.find((c) => c.hex.toUpperCase() === bgHex);
    if (existing) {
      existing.role = 'background';
      background = [existing, ...background.filter((c) => c !== existing)];
    } else {
      background.unshift({
        hex: bgHex,
        role: 'background',
        frequency: 40,
        isExact: true,
        source: 'measured',
        name: 'Page Canvas Background',
      });
    }
  }

  // If specific dominant text was passed
  if (options?.dominantText) {
    const textHex = options.dominantText.toUpperCase();
    const existing = allColors.find((c) => c.hex.toUpperCase() === textHex);
    if (existing) {
      existing.role = 'text';
      text = [existing, ...text.filter((c) => c !== existing)];
    } else {
      text.unshift({
        hex: textHex,
        role: 'text',
        frequency: 25,
        isExact: true,
        source: 'measured',
        name: 'Body Text Color',
      });
    }
  }

  // Ensure primary & accent are chosen from real colors if present
  if (primary.length === 0 && allColors.length > 0) {
    const candidate = allColors.find((c) => c.role !== 'background' && c.role !== 'text');
    if (candidate) {
      candidate.role = 'primary';
      primary.push(candidate);
    }
  }

  if (accent.length === 0 && allColors.length > 0) {
    const candidate = allColors.find((c) => c.role !== 'background' && c.role !== 'text' && c !== primary[0]);
    if (candidate) {
      candidate.role = 'accent';
      accent.push(candidate);
    }
  }

  // Fallbacks if some roles are still empty
  if (primary.length === 0) {
    primary.push({ hex: '#D97706', role: 'primary', frequency: 10, isExact: false, source: 'inferred', name: 'Inferred Accent' });
  }
  if (background.length === 0) {
    background.push({ hex: options?.dominantBg || '#0F172A', role: 'background', frequency: 50, isExact: false, source: 'inferred', name: 'Main Canvas' });
  }
  if (surface.length === 0) {
    surface.push({ hex: '#1E293B', role: 'surface', frequency: 15, isExact: false, source: 'inferred', name: 'Surface' });
  }
  if (text.length === 0) {
    text.push({ hex: options?.dominantText || '#F8FAFC', role: 'text', frequency: 25, isExact: false, source: 'inferred', name: 'Body Text' });
  }
  if (border.length === 0) {
    border.push({ hex: '#334155', role: 'border', frequency: 10, isExact: false, source: 'inferred', name: 'Divider Border' });
  }
  if (accent.length === 0) {
    accent.push({ hex: '#EA580C', role: 'accent', frequency: 5, isExact: false, source: 'inferred', name: 'Accent Highlight' });
  }

  const fonts = options?.customFonts || {
    heading: 'Inter, system-ui, -apple-system, sans-serif',
    body: 'Inter, system-ui, -apple-system, sans-serif',
    mono: 'JetBrains Mono, Menlo, monospace',
  };

  // Build typography scale from measured headings when available
  const measured = options?.measuredHeadings || [];
  const h1 = measured.find((m) => m.level === 1);
  const h2 = measured.find((m) => m.level === 2);
  const h3 = measured.find((m) => m.level === 3);

  const typographyScale: TypographyToken[] = [
    {
      name: 'Display / Hero',
      fontFamily: h1?.fontFamily || fonts.heading,
      fontSize: h1?.fontSize || '48px (3rem)',
      fontWeight: h1?.fontWeight || '700 / Bold',
      lineHeight: h1?.lineHeight || '1.15',
      letterSpacing: '-0.025em',
      color: h1?.color || text[0]?.hex || '#FFFFFF',
      isExact: !!h1,
      source: h1 ? 'measured' : isFallback ? 'inferred' : 'observed',
    },
    {
      name: 'Heading 1 (H1)',
      fontFamily: h1?.fontFamily || fonts.heading,
      fontSize: h1?.fontSize || '36px (2.25rem)',
      fontWeight: h1?.fontWeight || '700 / Bold',
      lineHeight: h1?.lineHeight || '1.2',
      letterSpacing: '-0.02em',
      color: h1?.color || text[0]?.hex || '#FFFFFF',
      isExact: !!h1,
      source: h1 ? 'measured' : isFallback ? 'inferred' : 'observed',
    },
    {
      name: 'Heading 2 (H2)',
      fontFamily: h2?.fontFamily || fonts.heading,
      fontSize: h2?.fontSize || '28px (1.75rem)',
      fontWeight: h2?.fontWeight || '600 / SemiBold',
      lineHeight: h2?.lineHeight || '1.25',
      letterSpacing: '-0.015em',
      color: h2?.color || text[0]?.hex || '#FFFFFF',
      isExact: !!h2,
      source: h2 ? 'measured' : isFallback ? 'inferred' : 'observed',
    },
    {
      name: 'Heading 3 (H3)',
      fontFamily: h3?.fontFamily || fonts.heading,
      fontSize: h3?.fontSize || '20px (1.25rem)',
      fontWeight: h3?.fontWeight || '600 / SemiBold',
      lineHeight: h3?.lineHeight || '1.3',
      color: h3?.color || text[0]?.hex || '#FFFFFF',
      isExact: !!h3,
      source: h3 ? 'measured' : isFallback ? 'inferred' : 'observed',
    },
    {
      name: 'Body / Paragraph',
      fontFamily: fonts.body,
      fontSize: '16px (1rem)',
      fontWeight: '400 / Regular',
      lineHeight: '1.6',
      letterSpacing: '0',
      color: text[0]?.hex || '#FFFFFF',
      isExact: !isFallback,
      source: !isFallback ? 'measured' : 'inferred',
    },
    {
      name: 'Caption / Muted',
      fontFamily: fonts.body,
      fontSize: '14px (0.875rem)',
      fontWeight: '500 / Medium',
      lineHeight: '1.45',
      color: text[1]?.hex || text[0]?.hex || '#94A3B8',
      isExact: !isFallback,
      source: !isFallback ? 'measured' : 'inferred',
    },
    {
      name: 'Code / Mono',
      fontFamily: fonts.mono,
      fontSize: '13px (0.8125rem)',
      fontWeight: '500 / Medium',
      lineHeight: '1.5',
      isExact: !isFallback,
      source: !isFallback ? 'measured' : 'inferred',
    },
  ];

  return {
    colors: {
      primary,
      background,
      surface,
      text,
      border,
      accent,
      all: allColors,
    },
    typography: {
      fontFamilies: fonts,
      scale: typographyScale,
    },
    spacing: {
      scale: [
        { key: 'xs', value: '4px', px: 4 },
        { key: 'sm', value: '8px', px: 8 },
        { key: 'md', value: '16px', px: 16 },
        { key: 'lg', value: '24px', px: 24 },
        { key: 'xl', value: '32px', px: 32 },
        { key: '2xl', value: '48px', px: 48 },
        { key: '3xl', value: '64px', px: 64 },
        { key: '4xl', value: '96px', px: 96 },
      ],
    },
    radii: {
      none: '0px',
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },
    containers: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
    },
    breakpoints: {
      mobile: '390px',
      tablet: '768px',
      desktop: '1280px',
      wide: '1440px',
    },
  };
}
