import { AnalysisEvidence, AnalyzerSettings } from '../../types';
import { AiAnalysisEnhancements } from './provider-interface';

function isColorDark(hex: string): boolean {
  if (!hex || !hex.startsWith('#') || hex.length < 7) return false;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum < 0.4;
}

export function getDeterministicAnalysisEnhancements(
  evidence: AnalysisEvidence,
  _settings: AnalyzerSettings
): AiAnalysisEnhancements {
  const primaryColor = evidence.tokens.colors.primary[0]?.hex || '#D97706';
  const bg = evidence.tokens.colors.background[0]?.hex || '#0F172A';
  const textColor = evidence.tokens.colors.text[0]?.hex || '#F8FAFC';
  const surfaceColor = evidence.tokens.colors.surface[0]?.hex || '#1E293B';
  const borderColor = evidence.tokens.colors.border[0]?.hex || '#334155';
  const sectionCount = evidence.sections.length;
  const compCount = evidence.components.length;
  const isDark = isColorDark(bg);
  const headingFont = evidence.tokens.typography.fontFamilies.heading;
  const isSerif = /serif/i.test(headingFont) && !/sans-serif/i.test(headingFont);

  const themeDescription = isDark
    ? `an immersive dark-mode aesthetic anchored by deep background tones (${bg})`
    : `a bright, crisp light-mode layout anchored by clean background tones (${bg})`;

  const typeDescription = isSerif
    ? `distinguished editorial serif display typography (${headingFont}) paired with functional UI body fonts`
    : `clean geometric typography (${headingFont}) with strict mathematical hierarchy`;

  const keyElements = evidence.components.map((c) => c.name).slice(0, 5).join(', ');

  const headingsList = evidence.headings.map((h) => `"${h.text}"`).slice(0, 3).join(', ');

  return {
    visualHierarchySummary: `The website exhibits ${themeDescription}, complemented by ${typeDescription}. The page is structured into ${sectionCount} observed content zones with ${compCount} detected UI components (${keyElements || 'Action Triggers, Navigation, Containers'}). Primary visual focal points are accentuated by ${primaryColor} tones against high-contrast text (${textColor})${headingsList ? `, led by key headline content: ${headingsList}` : ''}. The layout enforces a container architecture bounded to ${evidence.tokens.containers.xl} for optimal visual ergonomics.`,
    designSystemConventions: [
      `Color Architecture: ${isDark ? 'Dark theme' : 'Light theme'} with strict separation between foundational canvas (${bg}), elevated card surfaces (${surfaceColor}), and structural borders (${borderColor}).`,
      `Accent Palette: Focal interactions and action controls leverage high-saturation ${primaryColor} and ${evidence.tokens.colors.accent[0]?.hex || '#EA580C'} highlights.`,
      `Typography Stacking: Headings rendered with ${headingFont} (${evidence.tokens.typography.scale[0]?.fontSize || '3rem'} display leading), with body text set in ${evidence.tokens.typography.fontFamilies.body} and technical/code elements set in ${evidence.tokens.typography.fontFamilies.mono}.`,
      `Spacing Grid: 8-point base grid system (4px, 8px, 16px, 24px, 32px, 48px, 64px) governing layout padding, flexbox gaps, and element margins.`,
      `Radius & Elevation: Tailored corner radii (${evidence.tokens.radii.lg} on interactive controls, ${evidence.tokens.radii.xl} on containment surfaces) with subtle diffused shadows.`,
    ],
    reusableComponentRelationships: [
      `Header & Utility Controls: Anchors brand identity, status indicators, and global mode/navigation triggers.`,
      `Interactive Core: Houses the primary interactive workflow (${evidence.components.find((c) => c.type === 'lever' || c.type === 'button')?.name || 'Interactive Controls'}), driving dynamic page responses.`,
      `Containment Surfaces: Cards and panels share unified ${surfaceColor} backgrounds with ${borderColor} dividers to maintain consistent spatial hierarchy.`,
      `Footer & Metadata: Anchors secondary utility links and legal disclaimers.`,
    ],
    layoutReconstructionTips: [
      `Structure root layout with semantic HTML landmarks: <header>, <main>, <section>, and <footer>.`,
      `Ensure background color matches measured canvas token (${bg}) on the root <body> to avoid flash of mismatched background during initial render.`,
      `Apply exact font families: Heading font stack ("${headingFont}") for all titles and body stack for descriptive labels.`,
      `For interactive toggles, buttons, or levers, implement tactile hover states and active compression matching the measured dimensions.`,
      `Constrain main content width with container rules (max-w-${evidence.tokens.containers.xl}) to prevent distortion on ultra-wide viewports.`,
    ],
    responsiveNuances: [
      `Mobile Viewport (< 640px): Interactive buttons and controls stretch to ergonomic tap widths (minimum 44px height).`,
      `Tablet Viewport (640px - 1024px): Padding scales to 24px, preserving horizontal visual balance.`,
      `Desktop Viewport (> 1024px): Full layout width with centered alignment and generous negative space.`,
    ],
    visualFidelityPriorities: [
      `1. Exact Background & Surface Contrast: Faithfully reproduce the ${isDark ? 'dark' : 'light'} canvas (${bg}) and surface tone (${surfaceColor}).`,
      `2. Accurate Typography Identity: Preserve the ${isSerif ? 'editorial serif' : 'sans-serif'} heading character (${headingFont}) and body hierarchy.`,
      `3. Interactive Element Fidelity: Accurately reconstruct button colors (${primaryColor}), borders, and specialized controls.`,
      `4. Spacing and Alignment: Maintain proportional vertical rhythms and horizontal container margins.`,
      `5. Microinteractions: Implement smooth transitions on hover, focus-visible rings, and active press states.`,
    ],
    codingAgentGuidelines: [
      'Read DESIGN.md and COMPONENTS.md completely before generating code.',
      `Inspect design-tokens.json to populate theme variables (Canvas: ${bg}, Accent: ${primaryColor}, Text: ${textColor}).`,
      `Honor the detected font family (${headingFont}) instead of substituting generic default fonts.`,
      'Recreate actual detected page elements and workflows before adding any speculative features.',
      'Ensure all interactive controls have accessible ARIA labels and visible keyboard focus indicators.',
      'Do not invent fabricated testimonials, pricing matrices, or marketing filler not present in the specification.',
    ],
  };
}
