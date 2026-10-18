import { describe, it, expect } from 'vitest';
import { buildNormalizedTokens } from '../features/extraction/token-extractor';
import { generateDesignTokensJson } from '../features/generation/tokens-json-generator';
import { ExtractedTokensSchema } from '../lib/schemas';

describe('Design Token Extraction & Normalization', () => {
  it('builds valid normalized tokens with fallback values', () => {
    const tokens = buildNormalizedTokens([]);
    expect(tokens.colors.primary.length).toBeGreaterThan(0);
    expect(tokens.colors.background.length).toBeGreaterThan(0);
    expect(tokens.colors.text.length).toBeGreaterThan(0);
    expect(tokens.typography.scale.length).toBeGreaterThan(0);
    expect(tokens.spacing.scale.length).toBe(8);

    // Validate using Zod schema
    const parseResult = ExtractedTokensSchema.safeParse(tokens);
    expect(parseResult.success).toBe(true);
  });

  it('incorporates exact measured colors from raw input', () => {
    const raw = [
      { hex: '#1E293B', role: 'background' as const, frequency: 55, isExact: true },
      { hex: '#6366F1', role: 'primary' as const, frequency: 12, isExact: true },
    ];
    const tokens = buildNormalizedTokens(raw, { dominantBg: '#1E293B' });

    expect(tokens.colors.background[0].hex).toBe('#1E293B');
    expect(tokens.colors.primary[0].hex).toBe('#6366F1');
    expect(tokens.colors.background[0].isExact).toBe(true);
  });

  it('generates valid JSON with strict schema compliance', () => {
    const tokens = buildNormalizedTokens([]);
    const jsonStr = generateDesignTokensJson(tokens, {
      url: 'https://example.com',
      timestamp: '2026-10-18T12:00:00Z',
    });

    const parsed = JSON.parse(jsonStr);
    expect(parsed.$schema).toBeDefined();
    expect(parsed.colors.brand).toBeDefined();
    expect(parsed.typography.scale).toBeDefined();
    expect(parsed.spacing.xs).toEqual({ value: '4px', px: 4 });
  });
});
