import { AssetItem, AnalysisEvidence } from '../../types';

export function generateAssetsManifestJson(
  assets: AssetItem[],
  evidence?: Partial<AnalysisEvidence>
): string {
  const manifest = {
    $schema: 'https://pixelspec.dev/schemas/assets-manifest.v1.json',
    metadata: {
      generatedAt: evidence?.timestamp || new Date().toISOString(),
      sourceUrl: evidence?.url || 'unknown',
      totalAssetsCount: assets.length,
      downloadedLocallyCount: assets.filter((a) => a.downloadStatus === 'downloaded').length,
    },
    assets: assets.map((a) => ({
      id: a.id,
      originalUrl: a.originalUrl,
      type: a.type,
      mimeType: a.mimeType || 'unknown',
      dimensions: a.dimensions || { width: 0, height: 0 },
      downloadStatus: a.downloadStatus,
      altText: a.altText || null,
      localPath: a.downloadStatus === 'downloaded' ? a.localPath : null,
      attribution: a.attribution || 'Sourced from target website or public DOM reference',
    })),
  };

  return JSON.stringify(manifest, null, 2);
}
