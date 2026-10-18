import { describe, it, expect } from 'vitest';
import { generateSpecificationZip } from '../features/export/zip-generator';
import JSZip from 'jszip';

describe('ZIP Archive Package Generator', () => {
  it('bundles all specification documents into a valid ZIP archive', async () => {
    const mockDocuments = {
      'DESIGN.md': '# Design Blueprint',
      'COMPONENTS.md': '# Components',
      'AGENT-PROMPT.md': '# Agent Prompt',
      'VALIDATION.md': '# Validation',
      'DESIGN.txt': 'Design Blueprint Text',
      'design-tokens.json': '{"colors":{}}',
      'assets-manifest.json': '{"assets":[]}',
    };

    const zipBlob = await generateSpecificationZip({
      documents: mockDocuments,
      referenceImages: [
        {
          name: 'desktop.png',
          dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        },
      ],
    });

    expect(zipBlob).toBeDefined();
    expect(zipBlob.size).toBeGreaterThan(0);

    // Read back zip to verify file entries
    const zip = await JSZip.loadAsync(zipBlob);
    expect(zip.file('DESIGN.md')).toBeDefined();
    expect(zip.file('COMPONENTS.md')).toBeDefined();
    expect(zip.file('design-tokens.json')).toBeDefined();
    expect(zip.file('reference/desktop.png')).toBeDefined();

    const designContent = await zip.file('DESIGN.md')?.async('string');
    expect(designContent).toBe('# Design Blueprint');
  });
});
