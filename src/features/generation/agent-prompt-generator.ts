import { AnalysisEvidence, AnalyzerSettings } from '../../types';

export function generateAgentPromptMarkdown(
  evidence: AnalysisEvidence,
  _settings: AnalyzerSettings
): string {
  const { url, tokens, sections, components } = evidence;
  const primaryColor = tokens.colors.primary[0]?.hex || '#4F46E5';
  const bgColor = tokens.colors.background[0]?.hex || '#FFFFFF';

  return `# Coding Agent Implementation Directive
> **Mission**: Faithfully reconstruct the web application interface for **${url}** based on the structured specifications provided in this blueprint package.

---

### Step-by-Step Agent Workflow

#### 1. Ingestion & Token Setup
1. **Read Specifications First**: Read \`DESIGN.md\` and \`COMPONENTS.md\` thoroughly to understand the section layout, component hierarchies, and visual constraints.
2. **Import Design Tokens**: Inspect \`design-tokens.json\`. Configure your CSS or Tailwind config using the extracted color palette, typography font stack, and spacing increments:
   - Primary Accent: \`${primaryColor}\`
   - Background Canvas: \`${bgColor}\`
   - Radius Scale: \`${tokens.radii.lg}\` (controls) / \`${tokens.radii.xl}\` (cards)
   - Max Container: \`${tokens.containers.xl}\`
3. **Inspect Media Assets**: Check \`assets-manifest.json\` and the \`assets/\` or \`reference/\` folder before creating mock images or icons. Use SVG vector equivalents or accessible placeholders only where raw images are marked unavailable.

#### 2. Layout & Typography Architecture First
1. **Page Landmarks**: Build the root document structure in the exact order documented in \`DESIGN.md\`:
${sections.map((s, idx) => `   ${idx + 1}. \`<${s.name.includes('Header') ? 'header' : s.name.includes('Footer') ? 'footer' : 'section'}>\` (${s.name}) - [${s.layoutPattern.toUpperCase()}]`).join('\n')}
2. **Prioritize Geometry & Containers**: Set section widths, vertical margins, and fluid padding before adding decorative box shadows or animations.
3. **Implement Typographic Hierarchy**: Establish heading font weights and line heights as defined in Section 3.2 of \`DESIGN.md\`. Ensure font scaling via fluid \`clamp()\` on major display headlines.

#### 3. Component & State Implementation
1. **Build Detected Components**:
${components.map((c) => `   - **${c.name}** (\`${c.semanticTag}\`): Implement observable states (${c.observableStates.join(', ')})`).join('\n')}
2. **Interactive States**: Wire hover, active, and keyboard-visible focus rings on all buttons, links, and form inputs.
3. **Avoid Unnecessary Dependencies**: Use native HTML/CSS and lightweight standard primitives. Do not install heavy external libraries unless strictly required.

#### 4. Responsive Verification
- Test viewport at **390px** (Mobile), **768px** (Tablet), and **1440px** (Desktop).
- Ensure mobile navigation collapses into a functioning accessible drawer/sheet dialog.
- Verify that horizontal scrollbars never appear at any screen width between 320px and 1920px.

#### 5. Validation & Quality Assurance
1. **Execute Project Verification**: Run \`npm run build\` and \`npm run test\` (or project-specific build commands) to ensure zero compilation or lint errors.
2. **Verify Against Checklist**: Cross-reference your implementation against \`VALIDATION.md\` before declaring completion.
3. **Fix Discrepancies by Impact**: Address high-impact visual mismatches (layout alignment, container bounds, primary colors) first, then refine micro-details.
4. **Honesty Over Hallucination**: If certain dynamic behaviors or assets were unavailable in the specification, document them clearly rather than fabricating unobserved features.
`;
}
