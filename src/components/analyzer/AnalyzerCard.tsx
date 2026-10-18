import React, { useState } from 'react';
import { Globe, ArrowRight, Sliders, AlertTriangle, Sparkles } from 'lucide-react';
import { AdvancedSettingsModal } from './AdvancedSettingsModal';
import { AnalyzerSettings } from '../../types';
import { validateAndNormalizeUrl } from '../../features/inspection/url-validation';
import { AppError } from '../../lib/errors';

interface AnalyzerCardProps {
  onStartAnalysis: (url: string, screenshotFile: File | null, screenshotDataUrl: string | null, settings: AnalyzerSettings) => void;
  isLoading: boolean;
  currentError: AppError | null;
  onClearError: () => void;
}

export const AnalyzerCard: React.FC<AnalyzerCardProps> = ({
  onStartAnalysis,
  isLoading,
  currentError,
  onClearError,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [urlValidationError, setUrlValidationError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [settings, setSettings] = useState<AnalyzerSettings>({
    targetViewport: 'desktop',
    outputDetail: 'detailed',
    includeInferredInteractions: true,
    includeResponsiveRecommendations: true,
    includeAccessibleAssetReferences: true,
    enableAiEnhancement: false,
  });

  const handleUrlChange = (val: string) => {
    setUrlInput(val);
    if (urlValidationError) setUrlValidationError(null);
    if (currentError) onClearError();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onClearError();

    const trimmed = urlInput.trim();
    if (!trimmed) {
      setUrlValidationError('Please enter a website URL (e.g. https://example.com)');
      return;
    }

    const validation = validateAndNormalizeUrl(trimmed);
    if (!validation.isValid) {
      setUrlValidationError(validation.error || 'Please enter a valid HTTP/HTTPS address.');
      return;
    }
    onStartAnalysis(validation.normalizedUrl!, null, null, settings);
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 p-6 sm:p-8 transition-colors">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* URL Input Bar */}
        <div className="space-y-2">
          <label
            htmlFor="target-url-input"
            className="block text-sm font-semibold text-slate-800 dark:text-slate-200"
          >
            Website Target URL
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-4 text-slate-400 pointer-events-none">
              <Globe className="w-5 h-5" />
            </div>
            <input
              id="target-url-input"
              type="text"
              value={urlInput}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com or any public domain..."
              disabled={isLoading}
              className={`w-full pl-12 pr-32 py-3.5 text-sm sm:text-base rounded-2xl border transition-all duration-150 outline-none ${
                urlValidationError
                  ? 'border-rose-400 bg-rose-50/20 text-rose-900 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 text-slate-900 dark:text-slate-100 focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-brand-500/10'
              }`}
            />
            <div className="absolute right-2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Analyzer Settings"
                aria-label="Open analyzer settings"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>
          </div>
          {urlValidationError && (
            <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
              {urlValidationError}
            </p>
          )}
        </div>


        {/* Current Error Banner */}
        {currentError && (
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-900 dark:text-rose-200 space-y-1 animate-in fade-in">
            <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-400">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{currentError.title}</span>
            </div>
            <p className="leading-normal">{currentError.message}</p>
            <p className="text-rose-600 dark:text-rose-300 font-medium pt-1">
              💡 {currentError.suggestedAction}
            </p>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2.5 shadow-lg transition-all duration-150 ${
              isLoading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-700 active:scale-95 shadow-brand-600/30 hover:shadow-brand-600/40'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {isLoading ? 'Analyzing Website...' : 'Analyze Website'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Advanced Settings Modal */}
      <AdvancedSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />
    </div>
  );
};
