import { DetectedComponent, SectionStructure, ExtractedTokens } from '../../types';

export function detectComponentsFromLayout(
  _sections: SectionStructure[],
  tokens: ExtractedTokens,
  measuredComponents?: DetectedComponent[]
): DetectedComponent[] {
  // If real components were measured from the DOM by Playwright, return them!
  if (measuredComponents && measuredComponents.length > 0) {
    return measuredComponents;
  }

  const components: DetectedComponent[] = [];
  const primaryColor = tokens.colors.primary[0]?.hex || '#D97706';
  const textColor = tokens.colors.text[0]?.hex || '#F8FAFC';
  const surfaceColor = tokens.colors.surface[0]?.hex || '#1E293B';
  const borderColor = tokens.colors.border[0]?.hex || '#334155';

  // Minimal sensible fallback components
  components.push({
    id: 'comp-header-nav',
    type: 'header',
    name: 'Top Navigation Bar',
    confidence: 0.85,
    semanticTag: '<header>',
    accessibleRole: 'banner',
    boundingBox: { x: 0, y: 0, width: 1440, height: 64 },
    styles: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      padding: '0 24px',
      background: tokens.colors.background[0]?.hex || '#0F172A',
      borderBottom: `1px solid ${borderColor}`,
    },
    variants: ['Default'],
    observableStates: ['Default', 'Scrolled'],
    responsiveBehavior: 'Collapses horizontal navigation on mobile viewports.',
    subElements: ['Brand Mark', 'Navigation Links', 'Utility Actions'],
    implementationNotes: 'Main top-level landmark container.',
    source: 'inferred',
  });

  components.push({
    id: 'comp-main-action',
    type: 'button',
    name: 'Primary Action Trigger',
    confidence: 0.9,
    semanticTag: '<button type="button">',
    accessibleRole: 'button',
    boundingBox: { x: 520, y: 320, width: 160, height: 48 },
    styles: {
      backgroundColor: primaryColor,
      color: textColor,
      padding: '12px 24px',
      borderRadius: tokens.radii.lg,
      fontWeight: '600',
      fontSize: '15px',
      boxShadow: tokens.shadows.sm,
    },
    variants: ['Solid Primary', 'Secondary / Outline'],
    observableStates: ['Default', 'Hover', 'Active', 'Focus'],
    responsiveBehavior: 'Expands to full container width on narrow screens.',
    subElements: ['Button Label'],
    implementationNotes: 'Primary conversion / action element.',
    source: 'inferred',
  });

  components.push({
    id: 'comp-card-surface',
    type: 'card',
    name: 'Content Container Card',
    confidence: 0.8,
    semanticTag: '<article>',
    accessibleRole: 'region',
    styles: {
      backgroundColor: surfaceColor,
      border: `1px solid ${borderColor}`,
      borderRadius: tokens.radii.xl,
      padding: '24px',
    },
    variants: ['Bordered Surface'],
    observableStates: ['Default', 'Hover'],
    responsiveBehavior: 'Fluid width within container grid.',
    subElements: ['Card Content Zone'],
    implementationNotes: 'Elevated containment container.',
    source: 'inferred',
  });

  return components;
}

export function detectSectionsFromLayout(
  tokens: ExtractedTokens,
  measuredSections?: SectionStructure[]
): SectionStructure[] {
  // If real sections were measured from the DOM by Playwright, return them!
  if (measuredSections && measuredSections.length > 0) {
    return measuredSections;
  }

  const bg = tokens.colors.background[0]?.hex || '#0F172A';
  const surface = tokens.colors.surface[0]?.hex || '#1E293B';

  // Minimal, evidence-based structural outline without fabricating pricing or testimonials
  return [
    {
      id: 'sec-header',
      name: 'Site Header & Navigation',
      order: 1,
      boundingBox: { width: 1440, height: 64 },
      backgroundColor: bg,
      layoutPattern: 'flex',
      contentAlignment: 'space-between',
      componentsContained: ['Top Navigation Bar'],
      description: 'Top-level brand identification and utility navigation controls.',
      source: 'inferred',
    },
    {
      id: 'sec-main',
      name: 'Primary Application Interface',
      order: 2,
      boundingBox: { width: 1440, height: 650 },
      backgroundColor: bg,
      layoutPattern: 'flex',
      contentAlignment: 'center',
      componentsContained: ['Primary Action Trigger', 'Content Container Card'],
      description: 'Main interactive content zone containing the application core workflow.',
      source: 'inferred',
    },
    {
      id: 'sec-footer',
      name: 'Site Footer & Meta Info',
      order: 3,
      boundingBox: { width: 1440, height: 180 },
      backgroundColor: surface,
      layoutPattern: 'flex',
      contentAlignment: 'space-between',
      componentsContained: ['Footer Links', 'Copyright'],
      description: 'Tertiary links, metadata, and legal attribution.',
      source: 'inferred',
    },
  ];
}
