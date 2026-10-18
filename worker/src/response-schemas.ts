export interface WorkerInspectionRequest {
  url: string;
  viewport?: 'desktop' | 'tablet' | 'mobile';
}

export interface WorkerInspectionResponse {
  success: boolean;
  url: string;
  title: string;
  metaDescription?: string;
  viewport: { width: number; height: number };
  screenshot?: string; // base64
  headings: { level: number; text: string }[];
  elementsCount: number;
  extractedColors: { hex: string; role: string; count: number }[];
  error?: string;
}
