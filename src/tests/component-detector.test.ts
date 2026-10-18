import { describe, it, expect } from 'vitest';
import { buildNormalizedTokens } from '../features/extraction/token-extractor';
import { detectComponentsFromLayout, detectSectionsFromLayout } from '../features/extraction/component-detector';

describe('Component & Section Detection Heuristics', () => {
  const tokens = buildNormalizedTokens([]);

  it('detects primary structural page sections without injecting fake sections', () => {
    const sections = detectSectionsFromLayout(tokens);
    expect(sections.length).toBe(3);
    expect(sections[0].name).toContain('Header');
    expect(sections[1].name).toContain('Primary Application Interface');
    expect(sections[2].name).toContain('Footer');
    expect(sections.every((s) => s.source === 'inferred')).toBe(true);
  });

  it('preserves real measured sections when provided', () => {
    const measured = [
      {
        id: 'sec-hero',
        name: 'Editorial Serif Header Section',
        order: 1,
        boundingBox: { width: 1440, height: 400 },
        backgroundColor: '#0D0D11',
        layoutPattern: 'flex' as const,
        contentAlignment: 'center' as const,
        componentsContained: ['Main Lever Controller'],
        description: 'Dark hero container with copper lever',
        source: 'measured' as const,
      },
    ];
    const sections = detectSectionsFromLayout(tokens, measured);
    expect(sections.length).toBe(1);
    expect(sections[0].name).toBe('Editorial Serif Header Section');
    expect(sections[0].source).toBe('measured');
  });

  it('classifies essential UI components with high confidence scores', () => {
    const sections = detectSectionsFromLayout(tokens);
    const components = detectComponentsFromLayout(sections, tokens);

    const headerComp = components.find((c) => c.type === 'header');
    const buttonComp = components.find((c) => c.type === 'button');
    const cardComp = components.find((c) => c.type === 'card');

    expect(headerComp).toBeDefined();
    expect(headerComp?.confidence).toBeGreaterThan(0.8);
    expect(headerComp?.semanticTag).toContain('header');

    expect(buttonComp).toBeDefined();
    expect(buttonComp?.observableStates).toContain('Default');
    expect(buttonComp?.observableStates.some((s) => s.includes('Hover'))).toBe(true);

    expect(cardComp).toBeDefined();
  });

  it('preserves real measured components from Playwright extraction', () => {
    const measuredComps = [
      {
        id: 'comp-spin-btn',
        type: 'button' as const,
        name: 'SPIN SEED! Button',
        confidence: 0.98,
        semanticTag: '<button>',
        accessibleRole: 'button',
        boundingBox: { x: 400, y: 500, width: 200, height: 50 },
        styles: { backgroundColor: '#F97316', color: '#000000' },
        variants: ['Primary Action'],
        observableStates: ['Idle', 'Hover', 'Pressed'],
        responsiveBehavior: 'Fixed width button',
        subElements: ['SPIN SEED!'],
        implementationNotes: 'Main conversion button',
        source: 'measured' as const,
      },
    ];
    const sections = detectSectionsFromLayout(tokens);
    const components = detectComponentsFromLayout(sections, tokens, measuredComps);
    expect(components.length).toBe(1);
    expect(components[0].name).toBe('SPIN SEED! Button');
    expect(components[0].source).toBe('measured');
  });
});
