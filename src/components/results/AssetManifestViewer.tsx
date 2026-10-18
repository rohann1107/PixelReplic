import React from 'react';
import { AssetItem } from '../../types';
import { Image, FileCode, CheckCircle, ExternalLink } from 'lucide-react';

interface AssetManifestViewerProps {
  assets: AssetItem[];
}

export const AssetManifestViewer: React.FC<AssetManifestViewerProps> = ({ assets }) => {
  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Asset Manifest Inventory ({assets.length})
          </h3>
          <p className="text-xs text-slate-500">
            Catalog of referenced vector marks, illustrations, and images
          </p>
        </div>
      </div>

      {assets.length === 0 ? (
        <div className="p-8 text-center text-slate-400 text-xs">
          No external raster media detected. Design is composed using CSS primitives and SVG tokens.
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-semibold">
              <tr>
                <th className="px-4 py-2.5 text-left">Asset ID</th>
                <th className="px-4 py-2.5 text-left">Type / MIME</th>
                <th className="px-4 py-2.5 text-left">Status</th>
                <th className="px-4 py-2.5 text-left">Source URL / Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 font-mono">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-2.5 font-sans font-semibold text-slate-800 dark:text-slate-200">
                    <div className="flex items-center gap-1.5">
                      {asset.type === 'svg' ? (
                        <FileCode className="w-4 h-4 text-brand-500" />
                      ) : (
                        <Image className="w-4 h-4 text-indigo-500" />
                      )}
                      <span>{asset.id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">
                    {asset.type.toUpperCase()} ({asset.mimeType || 'unknown'})
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle className="w-3 h-3" />
                      {asset.downloadStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 truncate max-w-sm">
                    <a
                      href={asset.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand-500 hover:underline flex items-center gap-1"
                    >
                      <span>{asset.originalUrl}</span>
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
