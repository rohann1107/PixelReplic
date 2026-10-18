import React from 'react';
import { X, Sliders, Monitor, Tablet, Smartphone, Server } from 'lucide-react';
import { AnalyzerSettings } from '../../types';

interface AdvancedSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AnalyzerSettings;
  onUpdateSettings: (newSettings: AnalyzerSettings) => void;
}

export const AdvancedSettingsModal: React.FC<AdvancedSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h3 id="settings-title" className="text-lg font-bold text-slate-900 dark:text-white">
              Analyzer Configuration
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target Viewport */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Target Viewport Architecture
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'desktop', label: 'Desktop', desc: '1440 × 900', icon: Monitor },
                { id: 'tablet', label: 'Tablet', desc: '768 × 1024', icon: Tablet },
                { id: 'mobile', label: 'Mobile', desc: '390 × 844', icon: Smartphone },
              ] as const
            ).map(({ id, label, desc, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onUpdateSettings({ ...settings, targetViewport: id })}
                className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  settings.targetViewport === id
                    ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 ring-2 ring-brand-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon
                    className={`w-4 h-4 ${
                      settings.targetViewport === id
                        ? 'text-brand-600 dark:text-brand-400'
                        : 'text-slate-500'
                    }`}
                  />
                  {settings.targetViewport === id && (
                    <span className="w-2 h-2 rounded-full bg-brand-600"></span>
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">{label}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">{desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Output Detail Level */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            Specification Detail Level
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'standard', label: 'Standard', desc: 'Core hierarchy, tokens & agent prompt' },
              { id: 'detailed', label: 'Comprehensive', desc: 'Full 13-section blueprint with complete CSS rules' },
            ].map(({ id, label, desc }) => (
              <button
                key={id}
                type="button"
                onClick={() => onUpdateSettings({ ...settings, outputDetail: id as any })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  settings.outputDetail === id
                    ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 ring-2 ring-brand-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">{label}</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">{desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Toggle Flags */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Include Inferred Interactions
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate hover, focus, and drawer states in COMPONENTS.md
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.includeInferredInteractions}
              onChange={(e) =>
                onUpdateSettings({ ...settings, includeInferredInteractions: e.target.checked })
              }
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Responsive Breakdown
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Include mobile/tablet/desktop breakpoint transition guide
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.includeResponsiveRecommendations}
              onChange={(e) =>
                onUpdateSettings({ ...settings, includeResponsiveRecommendations: e.target.checked })
              }
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Accessible Asset Manifest
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate assets-manifest.json with alt tags and mime-types
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.includeAccessibleAssetReferences}
              onChange={(e) =>
                onUpdateSettings({ ...settings, includeAccessibleAssetReferences: e.target.checked })
              }
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Optional Remote Inspection Worker URL */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <label className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-indigo-500" />
            Optional Worker Endpoint
          </label>
          <input
            type="text"
            placeholder="e.g. https://pixelspec-worker.yourdomain.workers.dev"
            value={settings.workerEndpoint || ''}
            onChange={(e) => onUpdateSettings({ ...settings, workerEndpoint: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            Leave blank to use fast browser-side deterministic analysis or screenshot mode without deploying a server.
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
