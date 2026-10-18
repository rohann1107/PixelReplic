import { describe, it, expect } from 'vitest';
import { buildNormalizedTokens } from '../features/extraction/token-extractor';
import { detectComponentsFromLayout, detectSectionsFromLayout } from '../features/extraction/component-detector';
import { generateResponsiveObservations } from '../features/extraction/responsive-analyzer';
import { getDeterministicAnalysisEnhancements } from '../features/ai/deterministic-fallback';
import { generateDesignMarkdown } from '../features/generation/markdown-generator';
import { generateComponentsMarkdown } from '../features/generation/component-generator';
import { generateAgentPromptMarkdown } from '../features/generation/agent-prompt-generator';
import { generateValidationMarkdown } from '../features/generation/validation-generator';
import { convertMarkdownToPlainText } from '../features/generation/text-generator';
import { AnalysisEvidence, AnalyzerSettings } from '../types';

describe('Markdown & Specification Blueprint Generation', () => {
  const tokens = buildNormalizedTokens([]);
  const sections = detectSectionsFromLayout(tokens);
  const components = detectComponentsFromLayout(sections, tokens);
  const responsiveObservations = generateResponsiveObservations(false);

  const mockEvidence: AnalysisEvidence = {
    url: 'https://linear.app',
    pageTitle: 'Linear — A better way to build products',
    viewport: { width: 1440, height: 900 },
    headings: [{ level: 1, text: 'Linear' }],
    tokens,
    components,
    sections,
    assets: [],
    interactions: [],
    responsiveObservations,
    knownLimitations: ['Cross-origin restrictions applied.'],
    timestamp: 'Sun, 18 Oct 2026 12:00:00 GMT',
    analysisMode: 'deterministic_page',
    isAiEnhanced: false,
  };

  const settings: AnalyzerSettings = {
    targetViewport: 'desktop',
    outputDetail: 'detailed',
    includeInferredInteractions: true,
    includeResponsiveRecommendations: true,
    includeAccessibleAssetReferences: true,
    enableAiEnhancement: false,
  };

  const enhancements = getDeterministicAnalysisEnhancements(mockEvidence, settings);

  it('generates DESIGN.md with all 13 mandatory sections', () => {
    const md = generateDesignMarkdown(mockEvidence, settings, enhancements);

    expect(md).toContain('# PixelSpec Design & Reconstruction Blueprint');
    expect(md).toContain('## 1. Project Overview & Evidence Scope');
    expect(md).toContain('## 2. Design Summary & Visual Hierarchy');
    expect(md).toContain('## 3. Design Tokens');
    expect(md).toContain('## 4. Page Structure & Section Architecture');
    expect(md).toContain('## 5. Typography Hierarchy & Rules');
    expect(md).toContain('## 6. Component Specifications & Inventory');
    expect(md).toContain('## 7. Asset Inventory & Media');
    expect(md).toContain('## 8. Responsive Behavior & Viewport Transitions');
    expect(md).toContain('## 9. Observable Interactions & UI States');
    expect(md).toContain('## 10. Implementation Recommendations');
    expect(md).toContain('## 11. Visual Fidelity Requirements');
    expect(md).toContain('## 12. Validation & QA Checklist');
    expect(md).toContain('## 13. Unknowns & Technical Limitations');
  });

  it('generates COMPONENTS.md with computed CSS rules', () => {
    const compMd = generateComponentsMarkdown(components, tokens);
    expect(compMd).toContain('# PixelSpec Component Inventory & Specification');
    expect(compMd).toContain('### Key Style Attributes');
    expect(compMd).toContain('### Observable Interaction States');
  });

  it('generates AGENT-PROMPT.md with actionable AI directives', () => {
    const promptMd = generateAgentPromptMarkdown(mockEvidence, settings);
    expect(promptMd).toContain('# Coding Agent Implementation Directive');
    expect(promptMd).toContain('Step-by-Step Agent Workflow');
    expect(promptMd).toContain('DESIGN.md');
    expect(promptMd).toContain('COMPONENTS.md');
  });

  it('generates VALIDATION.md with QA checklists and viewport tables', () => {
    const valMd = generateValidationMarkdown(mockEvidence, settings);
    expect(valMd).toContain('Manual QA Checklist');
    expect(valMd).toContain('Desktop High-Res');
    expect(valMd).toContain('Mobile Standard');
  });

  it('converts markdown to plain text for DESIGN.txt', () => {
    const md = '# Header\n\nSome **bold** text and `code`.';
    const txt = convertMarkdownToPlainText(md);
    expect(txt).not.toContain('**');
    expect(txt).not.toContain('`');
    expect(txt).toContain('Some bold text and code.');
  });
});
