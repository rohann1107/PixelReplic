export type AnalysisStatus =
  | 'idle'
  | 'validating'
  | 'connecting'
  | 'capturing'
  | 'extracting'
  | 'detecting_components'
  | 'generating'
  | 'packaging'
  | 'completed'
  | 'failed'
  | 'cancelled';

export type TargetViewport = 'desktop' | 'tablet' | 'mobile';

export interface AnalyzerSettings {
  targetViewport: TargetViewport;
  outputDetail: 'standard' | 'detailed';
  includeInferredInteractions: boolean;
  includeResponsiveRecommendations: boolean;
  includeAccessibleAssetReferences: boolean;
  enableAiEnhancement: boolean;
  workerEndpoint?: string;
}

export type EvidenceSource = 'measured' | 'observed' | 'inferred' | 'unknown';

export interface ColorToken {
  hex: string;
  rgb?: string;
  name?: string;
  role: 'primary' | 'secondary' | 'background' | 'surface' | 'text' | 'border' | 'accent' | 'neutral';
  frequency: number;
  isExact: boolean;
  source?: EvidenceSource;
}

export interface TypographyToken {
  name: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing?: string;
  color?: string;
  isExact: boolean;
  source?: EvidenceSource;
}

export interface ExtractedTokens {
  colors: {
    primary: ColorToken[];
    background: ColorToken[];
    surface: ColorToken[];
    text: ColorToken[];
    border: ColorToken[];
    accent: ColorToken[];
    all: ColorToken[];
  };
  typography: {
    fontFamilies: { heading: string; body: string; mono: string };
    scale: TypographyToken[];
  };
  spacing: {
    scale: { key: string; value: string; px: number }[];
  };
  radii: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  containers: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
    wide: string;
  };
}

export type ComponentCategory =
  | 'header'
  | 'footer'
  | 'navigation'
  | 'hero'
  | 'card'
  | 'button'
  | 'form'
  | 'input'
  | 'search'
  | 'dropdown'
  | 'tabs'
  | 'accordion'
  | 'modal'
  | 'table'
  | 'grid'
  | 'pricing'
  | 'testimonial'
  | 'cta'
  | 'gallery'
  | 'lever'
  | 'toggle'
  | 'badge'
  | 'custom';

export interface DetectedComponent {
  id: string;
  type: ComponentCategory;
  name: string;
  confidence: number; // 0 to 1
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  styles: Record<string, string>;
  variants: string[];
  observableStates: string[];
  responsiveBehavior: string;
  subElements: string[];
  semanticTag: string;
  accessibleRole?: string;
  implementationNotes?: string;
  source?: EvidenceSource;
}

export interface SectionStructure {
  id: string;
  name: string;
  order: number;
  boundingBox?: { width: number; height: number };
  backgroundColor: string;
  layoutPattern: 'flex' | 'grid' | 'block' | 'columns';
  contentAlignment: string;
  componentsContained: string[];
  description: string;
  source?: EvidenceSource;
}

export interface AssetItem {
  id: string;
  originalUrl: string;
  type: 'image' | 'svg' | 'icon' | 'font';
  mimeType?: string;
  dimensions?: { width: number; height: number };
  downloadStatus: 'available' | 'downloaded' | 'remote_only' | 'failed';
  altText?: string;
  localPath?: string;
  attribution?: string;
}

export interface InteractionState {
  element: string;
  trigger: 'hover' | 'click' | 'focus' | 'scroll';
  observedState: string;
  verified: boolean;
  source?: EvidenceSource;
}

export interface ResponsiveObservation {
  viewport: 'desktop' | 'tablet' | 'mobile';
  width: number;
  height: number;
  changes: string[];
  verified: boolean;
}

export interface AnalysisEvidence {
  url: string;
  pageTitle: string;
  metaDescription?: string;
  screenshotBase64?: string;
  screenshotMimeType?: string;
  screenshotDimensions?: { width: number; height: number };
  viewport: { width: number; height: number };
  headings: {
    level: number;
    text: string;
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    color?: string;
    source?: EvidenceSource;
  }[];
  tokens: ExtractedTokens;
  components: DetectedComponent[];
  sections: SectionStructure[];
  assets: AssetItem[];
  interactions: InteractionState[];
  responsiveObservations: ResponsiveObservation[];
  knownLimitations: string[];
  timestamp: string;
  analysisMode: 'remote_worker' | 'screenshot_analysis' | 'deterministic_page' | 'hybrid' | 'headless_browser' | 'deterministic_fallback';
  isAiEnhanced: boolean;
  aiProviderName?: string;
  textSnippets?: string[];
  dominantBackground?: string;
  dominantText?: string;
  elementsCount?: number;
}

export interface GeneratedDocuments {
  'DESIGN.md': string;
  'COMPONENTS.md': string;
  'AGENT-PROMPT.md': string;
  'VALIDATION.md': string;
  'DESIGN.txt': string;
  'design-tokens.json': string;
  'assets-manifest.json': string;
}

export interface AnalysisResult {
  evidence: AnalysisEvidence;
  documents: GeneratedDocuments;
  referenceImages: { name: string; dataUrl: string }[];
}

export interface StepProgress {
  stage: AnalysisStatus;
  title: string;
  description: string;
  progressPercent: number;
  isComplete: boolean;
  isError?: boolean;
}
