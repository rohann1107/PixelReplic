import { DetectedComponent, ExtractedTokens } from '../../types';

export function generateComponentsMarkdown(
  components: DetectedComponent[],
  _tokens: ExtractedTokens
): string {
  const componentBlocks = components
    .map(
      (comp, i) => `## ${i + 1}. ${comp.name}
- **Component ID**: \`${comp.id}\`
- **Classification Type**: \`${comp.type}\`
- **Semantic Tag**: \`${comp.semanticTag}\`
- **Accessible ARIA Role**: \`${comp.accessibleRole || 'none'}\`
- **Confidence Metric**: **${Math.round(comp.confidence * 100)}%**
- **Bounding Box Geometry**: ${comp.boundingBox ? `${comp.boundingBox.width}px (W) × ${comp.boundingBox.height}px (H) [X: ${comp.boundingBox.x}, Y: ${comp.boundingBox.y}]` : 'Fluid / responsive dimensions'}

### Key Style Attributes
\`\`\`css
/* Measured computed styles */
${Object.entries(comp.styles)
  .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v};`)
  .join('\n')}
\`\`\`

### Structure & Sub-Elements
${comp.subElements.map((el) => `- \`${el}\``).join('\n')}

### Variants Identified
${comp.variants.map((v) => `- **${v}**`).join('\n')}

### Observable Interaction States
${comp.observableStates.map((s) => `- State: **${s}**`).join('\n')}

### Responsive Behavior Rules
${comp.responsiveBehavior}

### Implementation Recommendations
${comp.implementationNotes || 'Encapsulate into standalone TypeScript React component with strict prop interface.'}

---
`
    )
    .join('\n');

  return `# PixelSpec Component Inventory & Specification
> This document catalogs all detected visual components, their semantic markup, computed styles, observable interaction states, and responsive transformation behaviors.

${componentBlocks}
`;
}
