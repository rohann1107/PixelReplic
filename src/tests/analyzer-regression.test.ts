import { describe, it, expect } from 'vitest';
import { buildNormalizedTokens } from '../features/extraction/token-extractor';
import { detectComponentsFromLayout, detectSectionsFromLayout } from '../features/extraction/component-detector';
import { generateDesignMarkdown } from '../features/generation/markdown-generator';
import { getDeterministicAnalysisEnhancements } from '../features/ai/deterministic-fallback';
import { AnalysisEvidence, AnalyzerSettings, DetectedComponent } from '../types';

describe('Analyzer Regression Tests — 6 Evidence Fixtures', () => {
  const defaultSettings: AnalyzerSettings = {
    targetViewport: 'desktop',
    outputDetail: 'detailed',
    includeInferredInteractions: true,
    includeResponsiveRecommendations: true,
    includeAccessibleAssetReferences: true,
    enableAiEnhancement: false,
  };

  // Fixture 1: Dark website with orange accents and serif headings (e.g. Ripplier)
  it('Fixture 1: Dark website with orange accents and serif headings produces dark-themed serif blueprint', () => {
    const rawColors = [
      { hex: '#0D0D11', role: 'background' as const, frequency: 65, isExact: true, source: 'measured' as const },
      { hex: '#E0693B', role: 'primary' as const, frequency: 18, isExact: true, source: 'measured' as const },
      { hex: '#F5F2EB', role: 'text' as const, frequency: 12, isExact: true, source: 'measured' as const },
    ];
    const tokens = buildNormalizedTokens(rawColors, {
      dominantBg: '#0D0D11',
      dominantText: '#F5F2EB',
      customFonts: { heading: 'Playfair Display, serif', body: 'Inter, sans-serif', mono: 'JetBrains Mono, monospace' },
      measuredHeadings: [{ level: 1, text: 'Ripplier Editorial Experience', source: 'measured' }],
    });

    const measuredSections = [
      {
        id: 'sec-hero',
        name: 'Editorial Experience Hero',
        order: 1,
        boundingBox: { width: 1440, height: 420 },
        backgroundColor: '#0D0D11',
        layoutPattern: 'flex' as const,
        contentAlignment: 'center' as const,
        componentsContained: ['Interactive Lever Control', 'Action Button: "SPIN SEED!"'],
        description: 'Dark editorial presentation with copper interactive controls.',
        source: 'measured' as const,
      },
    ];

    const measuredComponents: DetectedComponent[] = [
      {
        id: 'comp-lever',
        type: 'lever' as const,
        name: 'Interactive Lever Control',
        confidence: 0.96,
        semanticTag: '<div role="switch">',
        accessibleRole: 'switch',
        boundingBox: { x: 500, y: 350, width: 320, height: 180 },
        styles: { backgroundColor: '#16161D', color: '#E0693B' },
        variants: ['Active State', 'Idle State'],
        observableStates: ['Default', 'Engaged'],
        responsiveBehavior: 'Centered responsive container',
        subElements: ['Lever Handle', 'State Indicator'],
        implementationNotes: 'Physical lever mechanism',
        source: 'measured' as const,
      },
      {
        id: 'comp-spin-btn',
        type: 'button' as const,
        name: 'Action Button: "SPIN SEED!"',
        confidence: 0.98,
        semanticTag: '<button>',
        accessibleRole: 'button',
        boundingBox: { x: 500, y: 550, width: 180, height: 50 },
        styles: { backgroundColor: '#E0693B', color: '#0D0D11', fontWeight: '700' },
        variants: ['Solid Accent'],
        observableStates: ['Default', 'Hover', 'Active'],
        responsiveBehavior: 'Fixed width',
        subElements: ['SPIN SEED!'],
        implementationNotes: 'Trigger generation',
        source: 'measured' as const,
      },
    ];

    const sections = detectSectionsFromLayout(tokens, measuredSections);
    const components = detectComponentsFromLayout(sections, tokens, measuredComponents);

    const evidence: AnalysisEvidence = {
      url: 'https://ripplier.vercel.app',
      pageTitle: 'Ripplier — Creative Idea Engine',
      viewport: { width: 1440, height: 900 },
      headings: [{ level: 1, text: 'Ripplier Editorial Experience', source: 'measured' }],
      tokens,
      components,
      sections,
      assets: [],
      interactions: [],
      responsiveObservations: [],
      knownLimitations: [],
      timestamp: new Date().toUTCString(),
      analysisMode: 'headless_browser',
      isAiEnhanced: false,
      textSnippets: ['Ripplier Editorial Experience', 'SPIN SEED!'],
      dominantBackground: '#0D0D11',
      dominantText: '#F5F2EB',
    };

    const enhancements = getDeterministicAnalysisEnhancements(evidence, defaultSettings);
    const md = generateDesignMarkdown(evidence, defaultSettings, enhancements);

    // Verify it reflects dark theme and copper accents
    expect(tokens.colors.background[0].hex).toBe('#0D0D11');
    expect(tokens.colors.primary[0].hex).toBe('#E0693B');
    expect(tokens.typography.fontFamilies.heading.toLowerCase()).toContain('serif');
    expect(md).toContain('#0D0D11');
    expect(md).toContain('#E0693B');
    expect(md).toContain('Playfair Display');
    expect(md).toContain('SPIN SEED!');
    expect(md).toContain('Interactive Lever Control');

    // Crucial: Must NOT contain generic fabricated SaaS sections
    expect(md).not.toContain('Pricing Tier Matrix');
    expect(md).not.toContain('Customer Testimonials');
    expect(md).not.toContain('Enterprise Plan');
  });

  // Fixture 2: Light website with indigo accents and sans-serif headings
  it('Fixture 2: Light website with indigo accents produces light-themed sans-serif blueprint', () => {
    const rawColors = [
      { hex: '#FFFFFF', role: 'background' as const, frequency: 70, isExact: true, source: 'measured' as const },
      { hex: '#4F46E5', role: 'primary' as const, frequency: 15, isExact: true, source: 'measured' as const },
      { hex: '#0F172A', role: 'text' as const, frequency: 12, isExact: true, source: 'measured' as const },
    ];
    const tokens = buildNormalizedTokens(rawColors, {
      dominantBg: '#FFFFFF',
      dominantText: '#0F172A',
      customFonts: { heading: 'Inter, sans-serif', body: 'Inter, sans-serif', mono: 'monospace' },
      measuredHeadings: [{ level: 1, text: 'Build software faster than ever', source: 'measured' }],
    });

    const sections = detectSectionsFromLayout(tokens);
    const components = detectComponentsFromLayout(sections, tokens);

    const evidence: AnalysisEvidence = {
      url: 'https://saasify.dev',
      pageTitle: 'SaaSify — Modern Cloud Platform',
      viewport: { width: 1440, height: 900 },
      headings: [{ level: 1, text: 'Build software faster than ever', source: 'measured' }],
      tokens,
      components,
      sections,
      assets: [],
      interactions: [],
      responsiveObservations: [],
      knownLimitations: [],
      timestamp: new Date().toUTCString(),
      analysisMode: 'headless_browser',
      isAiEnhanced: false,
      dominantBackground: '#FFFFFF',
      dominantText: '#0F172A',
    };

    const enhancements = getDeterministicAnalysisEnhancements(evidence, defaultSettings);
    const md = generateDesignMarkdown(evidence, defaultSettings, enhancements);

    expect(tokens.colors.background[0].hex).toBe('#FFFFFF');
    expect(tokens.colors.primary[0].hex).toBe('#4F46E5');
    expect(tokens.typography.fontFamilies.heading.toLowerCase()).toContain('sans-serif');
    expect(md).toContain('#FFFFFF');
    expect(md).toContain('#4F46E5');
    expect(enhancements.visualHierarchySummary).toContain('light-mode');
  });

  // Fixture 3: Website with several distinct sections and interactive controls
  it('Fixture 3: Website with multiple distinct measured sections and interactive controls preserves all sections', () => {
    const rawColors = [
      { hex: '#000000', role: 'background' as const, frequency: 50, isExact: true, source: 'measured' as const },
      { hex: '#22C55E', role: 'primary' as const, frequency: 20, isExact: true, source: 'measured' as const },
    ];
    const tokens = buildNormalizedTokens(rawColors);
    const measuredSections = [
      {
        id: 'sec-nav',
        name: 'Global Command Header',
        order: 1,
        boundingBox: { width: 1440, height: 60 },
        backgroundColor: '#000000',
        layoutPattern: 'flex' as const,
        contentAlignment: 'space-between' as const,
        componentsContained: ['Command Menu'],
        description: 'Navigation bar',
        source: 'measured' as const,
      },
      {
        id: 'sec-dashboard',
        name: 'Realtime Telemetry Grid',
        order: 2,
        boundingBox: { width: 1440, height: 800 },
        backgroundColor: '#09090B',
        layoutPattern: 'grid' as const,
        contentAlignment: 'center' as const,
        componentsContained: ['Telemetry Chart', 'Stream Feed'],
        description: 'Dashboard container',
        source: 'measured' as const,
      },
      {
        id: 'sec-controls',
        name: 'Action Trigger Panel',
        order: 3,
        boundingBox: { width: 1440, height: 200 },
        backgroundColor: '#18181B',
        layoutPattern: 'flex' as const,
        contentAlignment: 'center' as const,
        componentsContained: ['Execute Script Button'],
        description: 'Controls section',
        source: 'measured' as const,
      },
    ];

    const sections = detectSectionsFromLayout(tokens, measuredSections);
    expect(sections.length).toBe(3);
    expect(sections[0].name).toBe('Global Command Header');
    expect(sections[1].name).toBe('Realtime Telemetry Grid');
    expect(sections[2].name).toBe('Action Trigger Panel');
    expect(sections.every((s) => s.source === 'measured')).toBe(true);
  });

  // Fixture 4: Website with insufficient evidence
  it('Fixture 4: Insufficient evidence gracefully provides transparent baseline with known limitations', () => {
    const tokens = buildNormalizedTokens([]);
    const sections = detectSectionsFromLayout(tokens);
    const components = detectComponentsFromLayout(sections, tokens);

    const evidence: AnalysisEvidence = {
      url: 'https://empty-or-minimal.com',
      pageTitle: 'Minimal Blank Site',
      viewport: { width: 1440, height: 900 },
      headings: [{ level: 1, text: 'Minimal Blank Site', source: 'inferred' }],
      tokens,
      components,
      sections,
      assets: [],
      interactions: [],
      responsiveObservations: [],
      knownLimitations: ['Partial DOM evidence: Page contained fewer than 5 visual elements.'],
      timestamp: new Date().toUTCString(),
      analysisMode: 'deterministic_fallback',
      isAiEnhanced: false,
    };

    const enhancements = getDeterministicAnalysisEnhancements(evidence, defaultSettings);
    const md = generateDesignMarkdown(evidence, defaultSettings, enhancements);

    expect(md).toContain('Partial DOM evidence');
    expect(md).toContain('INFERRED');
    expect(tokens.colors.background[0].source).toBe('inferred');
  });

  // Fixture 5: Website that fails to load
  it('Fixture 5: Failed to load reports honest error and preserves deterministic bounds without pretending', () => {
    const tokens = buildNormalizedTokens([], { dominantBg: '#0F172A' });
    const evidence: AnalysisEvidence = {
      url: 'https://unreachable-host-example.org',
      pageTitle: 'Unreachable Host',
      viewport: { width: 1440, height: 900 },
      headings: [{ level: 1, text: 'Unreachable Host', source: 'inferred' }],
      tokens,
      components: detectComponentsFromLayout([], tokens),
      sections: detectSectionsFromLayout(tokens),
      assets: [],
      interactions: [],
      responsiveObservations: [],
      knownLimitations: ['Remote connection timed out after 30000ms. Fallback structural approximation.'],
      timestamp: new Date().toUTCString(),
      analysisMode: 'deterministic_fallback',
      isAiEnhanced: false,
    };

    const enhancements = getDeterministicAnalysisEnhancements(evidence, defaultSettings);
    const md = generateDesignMarkdown(evidence, defaultSettings, enhancements);

    expect(md).toContain('Remote connection timed out');
    expect(evidence.analysisMode).toBe('deterministic_fallback');
  });

  // Fixture 6: Website with JavaScript-rendered content
  it('Fixture 6: Client-side JS rendered content is preserved in blueprint with high fidelity', () => {
    const rawColors = [
      { hex: '#0A0A0A', role: 'background' as const, frequency: 80, isExact: true, source: 'measured' as const },
      { hex: '#00FF66', role: 'primary' as const, frequency: 15, isExact: true, source: 'measured' as const },
    ];
    const tokens = buildNormalizedTokens(rawColors, {
      dominantBg: '#0A0A0A',
      dominantText: '#00FF66',
      customFonts: { heading: 'monospace', body: 'monospace', mono: 'monospace' },
      measuredHeadings: [{ level: 1, text: 'CyberTerminal Console v2', source: 'measured' }],
    });

    const measuredComponents: DetectedComponent[] = [
      {
        id: 'comp-exec',
        type: 'button' as const,
        name: 'Action Button: "EXECUTE SCRIPT"',
        confidence: 0.95,
        semanticTag: '<button>',
        accessibleRole: 'button',
        boundingBox: { x: 40, y: 120, width: 150, height: 40 },
        styles: { backgroundColor: '#00FF66', color: '#000000' },
        variants: ['Primary'],
        observableStates: ['Default', 'Hover'],
        responsiveBehavior: 'Auto width',
        subElements: ['EXECUTE SCRIPT'],
        implementationNotes: 'Terminal action',
        source: 'measured' as const,
      },
    ];

    const sections = detectSectionsFromLayout(tokens);
    const components = detectComponentsFromLayout(sections, tokens, measuredComponents);

    const evidence: AnalysisEvidence = {
      url: 'https://cyberterminal.app',
      pageTitle: 'CyberTerminal — Client Hydrated',
      viewport: { width: 1440, height: 900 },
      headings: [{ level: 1, text: 'CyberTerminal Console v2', source: 'measured' }],
      tokens,
      components,
      sections,
      assets: [],
      interactions: [],
      responsiveObservations: [],
      knownLimitations: [],
      timestamp: new Date().toUTCString(),
      analysisMode: 'headless_browser',
      isAiEnhanced: false,
      textSnippets: ['Real-time metrics rendered via client-side DOM mutation.'],
      dominantBackground: '#0A0A0A',
      dominantText: '#00FF66',
    };

    const enhancements = getDeterministicAnalysisEnhancements(evidence, defaultSettings);
    const md = generateDesignMarkdown(evidence, defaultSettings, enhancements);

    expect(md).toContain('CyberTerminal Console v2');
    expect(md).toContain('#00FF66');
    expect(md).toContain('#0A0A0A');
    expect(md).toContain('EXECUTE SCRIPT');
    expect(tokens.colors.primary[0].hex).toBe('#00FF66');
  });
});
