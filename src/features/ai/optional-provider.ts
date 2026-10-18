import { AnalysisEvidence, AnalyzerSettings } from '../../types';
import { AiProvider, AiAnalysisEnhancements } from './provider-interface';
import { getDeterministicAnalysisEnhancements } from './deterministic-fallback';

export class OptionalAiProvider implements AiProvider {
  name = 'PixelSpec Semantic Engine (Deterministic + Optional AI)';

  async isAvailable(): Promise<boolean> {
    // Check if worker AI or approved free endpoint is configured
    const customEndpoint = (window as any)?.__PIXELSPEC_AI_ENDPOINT__;
    if (!customEndpoint) return false;
    try {
      const res = await fetch(`${customEndpoint}/health`, { method: 'GET', signal: AbortSignal.timeout(2000) });
      return res.ok;
    } catch {
      return false;
    }
  }

  async analyzeDesign(evidence: AnalysisEvidence, settings: AnalyzerSettings): Promise<AiAnalysisEnhancements> {
    const customEndpoint = (window as any)?.__PIXELSPEC_AI_ENDPOINT__;

    if (settings.enableAiEnhancement && customEndpoint) {
      try {
        const response = await fetch(`${customEndpoint}/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: evidence.url,
            tokens: evidence.tokens,
            components: evidence.components.map((c) => ({ name: c.name, type: c.type })),
            sections: evidence.sections.map((s) => ({ name: s.name, layout: s.layoutPattern })),
          }),
          signal: AbortSignal.timeout(6000), // Strict 6s timeout
        });

        if (response.ok) {
          const json = await response.json();
          if (json && json.visualHierarchySummary) {
            return json as AiAnalysisEnhancements;
          }
        }
      } catch (err) {
        console.warn('Optional AI enhancement unavailable or timed out. Falling back to deterministic engine.', err);
      }
    }

    // Default rock-solid deterministic fallback
    return getDeterministicAnalysisEnhancements(evidence, settings);
  }
}

export const defaultAiProvider = new OptionalAiProvider();
