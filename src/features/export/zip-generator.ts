import JSZip from 'jszip';
import { GeneratedDocuments } from '../../types';

export interface ZipOptions {
  documents: GeneratedDocuments;
  referenceImages?: { name: string; dataUrl: string }[];
  assets?: { name: string; content: Blob | string }[];
}

export async function generateSpecificationZip(options: ZipOptions): Promise<Blob> {
  const zip = new JSZip();

  // 1. Add core specification documents
  zip.file('DESIGN.md', options.documents['DESIGN.md']);
  zip.file('COMPONENTS.md', options.documents['COMPONENTS.md']);
  zip.file('AGENT-PROMPT.md', options.documents['AGENT-PROMPT.md']);
  zip.file('VALIDATION.md', options.documents['VALIDATION.md']);
  zip.file('DESIGN.txt', options.documents['DESIGN.txt']);
  zip.file('design-tokens.json', options.documents['design-tokens.json']);
  zip.file('assets-manifest.json', options.documents['assets-manifest.json']);

  // 2. Add reference directory if reference images exist
  if (options.referenceImages && options.referenceImages.length > 0) {
    const refFolder = zip.folder('reference');
    if (refFolder) {
      for (const img of options.referenceImages) {
        // Parse base64 dataUrl
        const parts = img.dataUrl.split(',');
        if (parts.length === 2) {
          const base64Data = parts[1];
          refFolder.file(img.name, base64Data, { base64: true });
        }
      }
    }
  }

  // 3. Add downloaded assets folder if any exist
  if (options.assets && options.assets.length > 0) {
    const assetsFolder = zip.folder('assets');
    if (assetsFolder) {
      for (const asset of options.assets) {
        assetsFolder.file(asset.name, asset.content);
      }
    }
  }

  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}
