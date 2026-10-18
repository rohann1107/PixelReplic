import { AnalysisEvidence, AnalyzerSettings } from '../../types';

export interface AiAnalysisEnhancements {
  visualHierarchySummary: string;
  designSystemConventions: string[];
  reusableComponentRelationships: string[];
  layoutReconstructionTips: string[];
  responsiveNuances: string[];
  visualFidelityPriorities: string[];
  codingAgentGuidelines: string[];
}

export interface AiProvider {
  name: string;
  isAvailable(): Promise<boolean>;
  analyzeDesign(evidence: AnalysisEvidence, settings: AnalyzerSettings): Promise<AiAnalysisEnhancements>;
}
