import { AnalysisEvidence, AnalyzerSettings } from '../../types';

export function generateValidationMarkdown(
  evidence: AnalysisEvidence,
  _settings: AnalyzerSettings
): string {
  const { url, tokens, sections } = evidence;

  return `# PixelSpec Reconstruction Validation & QA Protocol
> This document provides quality assurance criteria and a rigorous manual verification checklist to validate your reconstructed website against the original reference.

---

## 1. Reference Viewport Dimensions
| Viewport Profile | Width | Height | Priority | Inspection Goal |
|:-----------------|:------|:-------|:---------|:----------------|
| **Desktop High-Res** | 1440px | 900px | High | Verify max-container constraint (\`${tokens.containers.xl}\`), multi-column cards, full navbar |
| **Tablet Portrait** | 768px | 1024px | Medium | Verify 2-column wrapping, padding containment (24px) |
| **Mobile Standard** | 390px | 844px | Critical | Verify hamburger menu, 100% button widths, zero horizontal overflow |
| **Compact Mobile** | 320px | 568px | High | Verify no text truncation, minimum 44px tap targets |

---

## 2. Available Reference Evidence
- **Primary Source URL**: \`${url}\`
- **Screenshot Available**: ${evidence.screenshotBase64 ? 'Yes (Archived in `reference/screenshot.png`)' : 'Visual sampling profile extracted'}
- **Extracted Palette Tokens**: ${tokens.colors.all.length} distinct color values identified
- **Structural Sections**: ${sections.length} core page zones identified

---

## 3. Recommended Visual Comparison Procedure
1. **Side-by-Side Review**: Open your local development build on the left display half and the reference snapshot on the right.
2. **Container Boundary Test**: Use DevTools inspector to verify that the outer wrapper margin and padding match the 8pt grid tokens.
3. **Typography Overlay**: Compare line lengths and visual baseline rhythms on the hero headline and first paragraph.
4. **Color Contrast Audit**: Validate that body text achieves at least **4.5:1** contrast against its containing section background.

---

## 4. Manual QA Checklist

### A. Layout & Geometry
- [ ] Section ordering matches \`DESIGN.md\` exactly (${sections.map((s) => s.name).join(' → ')}).
- [ ] Content containers stay centered with equal left/right margins on wide screens (> 1440px).
- [ ] Section vertical gaps respect spacing tokens (48px - 80px).
- [ ] Zero accidental horizontal scrollbars exist at 320px, 390px, 768px, or 1440px widths.

### B. Visual Identity & Styling
- [ ] Primary brand color (\`${tokens.colors.primary[0]?.hex || '#4F46E5'}\`) is applied to major CTA buttons.
- [ ] Card surfaces use subtle borders (\`${tokens.colors.border[0]?.hex || '#E2E8F0'}\`) and soft shadows.
- [ ] Card corners match radius token (\`${tokens.radii.xl}\`).

### C. Responsiveness & Interaction
- [ ] Mobile navigation opens and closes smoothly without page jumping.
- [ ] Interactive buttons demonstrate visual hover feedback within 200ms.
- [ ] All clickable and focusable elements reveal a sharp focus outline on keyboard TAB navigation.
- [ ] Tap targets on touch screens meet or exceed 44px × 44px minimum bounding box.

### D. Production Readiness
- [ ] \`npm run build\` compiles cleanly with zero TypeScript errors.
- [ ] Automated tests pass without failures.
- [ ] No personal credentials, API keys, or private backend URLs are hardcoded in frontend source.
`;
}
