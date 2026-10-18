import { ResponsiveObservation } from '../../types';

export function generateResponsiveObservations(
  hasMultiViewportEvidence = false
): ResponsiveObservation[] {
  return [
    {
      viewport: 'desktop',
      width: 1440,
      height: 900,
      verified: hasMultiViewportEvidence,
      changes: [
        'Full horizontal navigation with inline links and action buttons.',
        'Multi-column layout: 3-4 feature cards side-by-side, max-width bounded to 1280px.',
        'Display typography rendered at full scale (H1: 3rem - 3.5rem).',
        'Visible split-screen hero graphic and interactive preview panels.',
        'Desktop hover microinteractions active on buttons and cards.',
      ],
    },
    {
      viewport: 'tablet',
      width: 768,
      height: 1024,
      verified: hasMultiViewportEvidence,
      changes: [
        'Container horizontal padding tightened from 32px to 24px.',
        'Feature grid reconfigured from 3 columns into 2 columns.',
        'Secondary navigation items collapsed; search input retained or minimized to icon.',
        'Split hero layout maintains side-by-side arrangement or transitions to vertical stack based on content density.',
        'Touch targets expanded to minimum 44px height.',
      ],
    },
    {
      viewport: 'mobile',
      width: 390,
      height: 844,
      verified: hasMultiViewportEvidence,
      changes: [
        'Top navigation links collapse entirely into an accessible mobile hamburger trigger with slide-over drawer.',
        'All grid layouts (features, pricing, cards) collapse to a single full-width column (100% width with 16px gutter).',
        'Primary action buttons stretch to full container width for ergonomic thumb access.',
        'Hero headline typography scales down via fluid clamp to ~2rem to eliminate awkward line breaks.',
        'Footer links transition from multi-column grid into stacked vertical sections or expandable accordions.',
        'Zero horizontal overflow: all code blocks, tables, and asset previews utilize internal scroll wrappers.',
      ],
    },
  ];
}
