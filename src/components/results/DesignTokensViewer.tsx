import React, { useState } from 'react';
import { ExtractedTokens } from '../../types';
import { Palette, Type, Space, Box } from 'lucide-react';
import { copyToClipboard } from '../../lib/formatting';

interface DesignTokensViewerProps {
  tokens: ExtractedTokens;
}

export const DesignTokensViewer: React.FC<DesignTokensViewerProps> = ({ tokens }) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyColor = async (hex: string) => {
    await copyToClipboard(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div className="space-y-8 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
      {/* 1. Colors */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Palette className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Color Palette & Roles
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {tokens.colors.all.map((c, idx) => (
            <div
              key={idx}
              onClick={() => handleCopyColor(c.hex)}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:scale-[1.02] cursor-pointer transition-all shadow-xs group"
              title="Click to copy hex"
            >
              <div
                className="w-full h-12 rounded-lg border border-black/10 dark:border-white/10 mb-2 relative flex items-center justify-center"
                style={{ backgroundColor: c.hex }}
              >
                {copiedHex === c.hex && (
                  <span className="text-[10px] bg-black/80 text-white px-2 py-0.5 rounded font-mono">
                    Copied!
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{c.hex}</span>
                <span className="text-[10px] text-slate-400 font-mono">{c.frequency}%</span>
              </div>
              <div className="text-[10px] text-brand-600 dark:text-brand-400 font-medium uppercase mt-0.5">
                {c.role}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Typography */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Type className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Typography Scale
          </h3>
        </div>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-semibold">
              <tr>
                <th className="px-4 py-2.5 text-left">Level / Token</th>
                <th className="px-4 py-2.5 text-left">Font Size</th>
                <th className="px-4 py-2.5 text-left">Weight</th>
                <th className="px-4 py-2.5 text-left">Line Height</th>
                <th className="px-4 py-2.5 text-left">Sample Output</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 font-mono">
              {tokens.typography.scale.map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="px-4 py-2.5 font-sans font-semibold text-slate-800 dark:text-slate-200">
                    {t.name}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{t.fontSize}</td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{t.fontWeight}</td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{t.lineHeight}</td>
                  <td className="px-4 py-2.5 font-sans text-slate-900 dark:text-slate-100 truncate max-w-xs">
                    Every pixel has a blueprint.
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Spacing Scale */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Space className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            8pt Spacing Scale & Tokens
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {tokens.spacing.scale.map((s, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-center"
            >
              <div className="h-10 flex items-center justify-center mb-1">
                <div
                  className="bg-brand-500 rounded-sm"
                  style={{ width: `${Math.min(s.px, 48)}px`, height: '8px' }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200 block">
                {s.value}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">--space-{s.key}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Radii & Shadows */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
          <Box className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Radii & Elevation System
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-12 h-12 bg-brand-50 dark:bg-brand-950/60 border border-brand-300 dark:border-brand-700 mx-auto mb-2 rounded-sm" />
            <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">Small (4px)</span>
            <span className="text-[10px] text-slate-500 font-mono">--radius-sm</span>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-12 h-12 bg-brand-50 dark:bg-brand-950/60 border border-brand-300 dark:border-brand-700 mx-auto mb-2 rounded-md" />
            <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">Medium (8px)</span>
            <span className="text-[10px] text-slate-500 font-mono">--radius-md</span>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-12 h-12 bg-brand-50 dark:bg-brand-950/60 border border-brand-300 dark:border-brand-700 mx-auto mb-2 rounded-lg" />
            <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">Large (12px)</span>
            <span className="text-[10px] text-slate-500 font-mono">--radius-lg</span>
          </div>
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-12 h-12 bg-brand-50 dark:bg-brand-950/60 border border-brand-300 dark:border-brand-700 mx-auto mb-2 rounded-2xl" />
            <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">Extra Large (16px)</span>
            <span className="text-[10px] text-slate-500 font-mono">--radius-xl</span>
          </div>
        </div>
      </section>
    </div>
  );
};
