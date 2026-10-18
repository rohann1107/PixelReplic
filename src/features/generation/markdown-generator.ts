import { AnalysisEvidence, AnalyzerSettings } from '../../types';
import { AiAnalysisEnhancements } from '../ai/provider-interface';

export function generateDesignMarkdown(
  evidence: AnalysisEvidence,
  settings: AnalyzerSettings,
  enhancements: AiAnalysisEnhancements
): string {
  const { url, pageTitle, timestamp, analysisMode, isAiEnhanced, tokens, sections, components, assets, interactions, responsiveObservations, knownLimitations } = evidence;

  const primaryColorsTable = tokens.colors.all
    .slice(0, 10)
    .map((c) => `| \`${c.hex}\` | ${c.rgb || 'N/A'} | **${c.role.toUpperCase()}** | ${c.frequency}% | **${(c.source || (c.isExact ? 'measured' : 'inferred')).toUpperCase()}** |`)
    .join('\n');

  const typographyTable = tokens.typography.scale
    .map((t) => `| **${t.name}** | \`${t.fontSize}\` | ${t.fontWeight} | \`${t.lineHeight}\` | \`${(t.fontFamily || 'sans-serif').split(',')[0].replace(/['"]/g, '')}\` | **${(t.source || (t.isExact ? 'measured' : 'inferred')).toUpperCase()}** |`)
    .join('\n');

  const spacingTable = tokens.spacing.scale
    .map((s) => `| \`--space-${s.key}\` | \`${s.value}\` | ${s.px}px | Standard 8pt Grid Step |`)
    .join('\n');

  const sectionsList = sections
    .map(
      (s, idx) => `### ${idx + 1}. ${s.name}
- **Section ID**: \`${s.id}\`
- **Layout Pattern**: \`${s.layoutPattern.toUpperCase()}\` (Alignment: \`${s.contentAlignment}\`)
- **Background Tone**: \`${s.backgroundColor}\`
- **Estimated Bounds**: ${s.boundingBox ? `${s.boundingBox.width}px × ${s.boundingBox.height}px` : 'Fluid container'}
- **Contained Components**: ${s.componentsContained.join(', ')}
- **Evidence Source**: **${(s.source || 'measured').toUpperCase()}**
- **Description**: ${s.description}
`
    )
    .join('\n');

  const componentsSummary = components
    .map(
      (c) => `#### [Component] ${c.name} (\`${c.semanticTag}\`)
- **Classification**: \`${c.type}\` (Confidence: **${Math.round(c.confidence * 100)}%**)
- **Evidence Source**: **${(c.source || 'measured').toUpperCase()}**
- **Key Styles**: Background: \`${c.styles.backgroundColor || c.styles.background || 'transparent'}\`, Color: \`${c.styles.color || 'inherit'}\`, Border: \`${c.styles.border || 'none'}\`, Padding: \`${c.styles.padding || 'N/A'}\`
- **Variants Identified**: ${c.variants.join(', ')}
- **Observable States**: ${c.observableStates.join(', ')}
- **Responsive Behavior**: ${c.responsiveBehavior}
- **Implementation Guideline**: ${c.implementationNotes || 'Extract into reusable component in /components/'}
`
    )
    .join('\n');

  const assetsList = assets.length > 0
    ? assets.map((a) => `- **${a.id}** (\`${a.type.toUpperCase()}\`): \`${a.originalUrl}\` - Status: **${a.downloadStatus.toUpperCase()}** (${a.altText ? `Alt: "${a.altText}"` : 'No alt text provided'})`).join('\n')
    : `- No direct static image files were downloaded locally. Vector SVGs and external asset references are cataloged in \`assets-manifest.json\`.`;

  const responsiveList = responsiveObservations
    .map((r) => `### ${r.viewport.toUpperCase()} (${r.width}px × ${r.height}px) — ${r.verified ? 'Verified Evidence' : 'Heuristic Recommendation'}
${r.changes.map((ch) => `- ${ch}`).join('\n')}`)
    .join('\n\n');

  const interactionsList = interactions.length > 0
    ? interactions.map((i) => `- **${i.element}** [Trigger: \`${i.trigger}\`]: ${i.observedState} (${i.verified ? 'Verified' : 'Inferred'})`).join('\n')
    : `- Standard anchor hover transitions, button active compression, and mobile menu accordion toggles.`;

  const limitationsList = knownLimitations.length > 0
    ? knownLimitations.map((lim) => `- ⚠️ ${lim}`).join('\n')
    : `- Remote serverless CORS limitations apply to cross-origin subresources without open headers.`;

  return `# PixelSpec Design & Reconstruction Blueprint
> **Source Target**: [${url}](${url})  
> **Extracted Timestamp**: ${timestamp}  
> **Analysis Engine**: ${isAiEnhanced ? 'Deterministic Extraction + AI Enhancement' : 'Deterministic Rule-Based Engine'}  
> **Target Viewport**: ${settings.targetViewport.toUpperCase()} (Detail Level: ${settings.outputDetail.toUpperCase()})  
> **Extraction Mode**: \`${analysisMode}\`

---

## 1. Project Overview & Evidence Scope
- **Target URL**: \`${url}\`
- **Page Title**: ${pageTitle || 'Untitled Web Application'}
- **Available Evidence**:
  - Headings & Semantic Text: ${evidence.headings && evidence.headings.length > 0 ? `**${evidence.headings.length} Headings Extracted** (${evidence.headings.map((h) => `"${h.text}"`).slice(0, 4).join(', ')})` : 'Inferred'}
  - Text Snippets & Interactive Labels: ${evidence.textSnippets && evidence.textSnippets.length > 0 ? evidence.textSnippets.slice(0, 6).map((t) => `\`${t}\``).join(', ') : 'Standard landmarks'}
  - Full DOM computed CSS: ${analysisMode === 'headless_browser' || analysisMode === 'remote_worker' ? '**Measured via Headless Chromium**' : '**Inferred from visual canvas sampling**'}
  - High-resolution screenshot: ${evidence.screenshotBase64 ? '**Captured (Included in /reference)**' : '**External URL reference only**'}
- **Known Limitations**:
${limitationsList}

---

## 2. Design Summary & Visual Hierarchy
${enhancements.visualHierarchySummary}

### Core Design Conventions
${enhancements.designSystemConventions.map((c) => `- ${c}`).join('\n')}

---

## 3. Design Tokens

### 3.1 Color Palette
| Hex Token | RGB Value | Assigned Role | Frequency | Extraction Status |
|:----------|:----------|:--------------|:----------|:------------------|
${primaryColorsTable}

### 3.2 Typography Tokens
- **Heading Font Family**: \`${tokens.typography.fontFamilies.heading}\`
- **Body Font Family**: \`${tokens.typography.fontFamilies.body}\`
- **Monospace Font Family**: \`${tokens.typography.fontFamilies.mono}\`

| Style Token | Font Size | Weight | Line Height | Active Family | Status |
|:------------|:----------|:-------|:------------|:--------------|:-------|
${typographyTable}

### 3.3 Spacing Scale (8pt Grid Foundation)
| Token Name | Computed Value | Pixels | Grid Role |
|:-----------|:---------------|:-------|:----------|
${spacingTable}

### 3.4 Corner Radii & Elevation Tokens
- **Border Radii**:
  - Small (\`--radius-sm\`): \`${tokens.radii.sm}\`
  - Medium (\`--radius-md\`): \`${tokens.radii.md}\`
  - Large (\`--radius-lg\`): \`${tokens.radii.lg}\`
  - Extra Large (\`--radius-xl\`): \`${tokens.radii.xl}\`
  - Full Pill (\`--radius-full\`): \`${tokens.radii.full}\`
- **Elevation Box Shadows**:
  - Small (\`--shadow-sm\`): \`${tokens.shadows.sm}\`
  - Medium (\`--shadow-md\`): \`${tokens.shadows.md}\`
  - Large (\`--shadow-lg\`): \`${tokens.shadows.lg}\`
  - Prominent (\`--shadow-xl\`): \`${tokens.shadows.xl}\`

### 3.5 Breakpoint & Container Tokens
- **Containers**: Small: \`${tokens.containers.sm}\`, Medium: \`${tokens.containers.md}\`, Large: \`${tokens.containers.lg}\`, Max Container: \`${tokens.containers.xl}\`
- **Breakpoints**: Mobile: \`${tokens.breakpoints.mobile}\`, Tablet: \`${tokens.breakpoints.tablet}\`, Desktop: \`${tokens.breakpoints.desktop}\`, Wide: \`${tokens.breakpoints.wide}\`

---

## 4. Page Structure & Section Architecture
The page is organized into the following vertical sections:

${sectionsList}

---

## 5. Typography Hierarchy & Rules
1. **Heading Hierarchy**: Maintain strict single \`<h1>\` tag within the Hero section. Subsequent section headings must use \`<h2>\`, with card subtitles and subheadings strictly using \`<h3>\` or \`<h4>\`.
2. **Line Length & Leading**: Constrain prose paragraphs to \`max-w-prose\` (65-75 characters per line) with relaxed line-height (\`1.6\`) to maximize readability.
3. **Contrast Compliance**: Ensure text color against canvas background maintains minimum WCAG 2.2 AA contrast ratio of 4.5:1 (or 3:1 for large text >= 24px).

---

## 6. Component Specifications & Inventory
${componentsSummary}

---

## 7. Asset Inventory & Media
${assetsList}

---

## 8. Responsive Behavior & Viewport Transitions
${responsiveList}

---

## 9. Observable Interactions & UI States
${interactionsList}

---

## 10. Implementation Recommendations

### Suggested Architecture (React + Tailwind CSS / Vanilla CSS)
\`\`\`
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Container.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesGrid.tsx
│   │   ├── PricingTable.tsx
│   │   └── CtaBanner.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── Badge.tsx
├── tokens/
│   └── tokens.css
└── App.tsx
\`\`\`

### Layout Reconstruction Directives
${enhancements.layoutReconstructionTips.map((tip) => `- ${tip}`).join('\n')}

---

## 11. Visual Fidelity Requirements
When recreating the interface, implement features in this strict order of visual priority:
${enhancements.visualFidelityPriorities.join('\n')}

---

## 12. Validation & QA Checklist
- [ ] Root container max-width matches specification (\`${tokens.containers.xl}\`).
- [ ] Primary canvas background color matches extracted token (\`${tokens.colors.background[0]?.hex}\`).
- [ ] H1 display font size scales smoothly across mobile (2rem) and desktop (3rem+).
- [ ] Button hover states smoothly transition background color with 150ms-200ms ease.
- [ ] Keyboard focus ring is visible and accessible on all interactive elements.
- [ ] All grid sections collapse cleanly to a single column on viewport width <= 640px.
- [ ] Zero horizontal page scrollbar on mobile devices (320px - 430px).

---

## 13. Unknowns & Technical Limitations
- Dynamic JavaScript-rendered state behind authentication or user-specific sessions was not captured.
- Media query breakpoints not directly declared in inline styles are derived from heuristic responsive standards.
- Proprietary commercial web fonts not publicly licensable should be substituted with the specified fallback font stack (\`${tokens.typography.fontFamilies.body}\`).
`;
}
