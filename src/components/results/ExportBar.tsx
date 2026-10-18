import React, { useState } from 'react';
import { Download, Copy, Check, Archive, FileText, Sparkles, AlertCircle } from 'lucide-react';
import { AnalysisResult } from '../../types';
import {
  downloadCompleteZip,
  downloadDesignMarkdown,
  downloadDesignText,
  copyMarkdownToClipboard,
  copyAgentPromptToClipboard,
} from '../../features/export/download-manager';

interface ExportBarProps {
  result: AnalysisResult;
}

export const ExportBar: React.FC<ExportBarProps> = ({ result }) => {
  const [isZipping, setIsZipping] = useState(false);
  const [copyMdSuccess, setCopyMdSuccess] = useState(false);
  const [copyPromptSuccess, setCopyPromptSuccess] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleZipDownload = async () => {
    setIsZipping(true);
    setExportError(null);
    const res = await downloadCompleteZip(result);
    setIsZipping(false);
    if (!res.success) {
      setExportError(res.error || 'Failed to generate ZIP package');
    }
  };

  const handleCopyMd = async () => {
    const ok = await copyMarkdownToClipboard(result);
    if (ok) {
      setCopyMdSuccess(true);
      setTimeout(() => setCopyMdSuccess(false), 2000);
    }
  };

  const handleCopyPrompt = async () => {
    const ok = await copyAgentPromptToClipboard(result);
    if (ok) {
      setCopyPromptSuccess(true);
      setTimeout(() => setCopyPromptSuccess(false), 2000);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Stats & Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0">
            <Archive className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Website Reconstruction Blueprint Package
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete ZIP bundle ready for Claude, Cursor, v0, Devin, or Windsurf
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Subtle Secondary: Copy Agent Prompt */}
          <button
            type="button"
            onClick={handleCopyPrompt}
            className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center gap-1.5 transition-colors"
            title="Copy instruction prompt for AI agents"
          >
            {copyPromptSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Prompt Copied</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>Copy Agent Prompt</span>
              </>
            )}
          </button>

          {/* Subtle Secondary: Download MD */}
          <button
            type="button"
            onClick={() => downloadDesignMarkdown(result)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Download DESIGN.md file"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Subtle Secondary: Download TXT */}
          <button
            type="button"
            onClick={() => downloadDesignText(result)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Download plain text (DESIGN.txt)"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* PRIMARY SHOWCASE 1: Copy DESIGN.md */}
          <button
            type="button"
            onClick={handleCopyMd}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 shadow-md ${
              copyMdSuccess
                ? 'bg-emerald-500 text-white shadow-emerald-500/25'
                : 'bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/70 dark:hover:bg-brand-900/90 text-brand-700 dark:text-brand-300 border-2 border-brand-500 dark:border-brand-400 shadow-brand-500/20'
            }`}
          >
            {copyMdSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>DESIGN.md Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Copy DESIGN.md</span>
              </>
            )}
          </button>

          {/* PRIMARY SHOWCASE 2: Download Complete ZIP */}
          <button
            type="button"
            onClick={handleZipDownload}
            disabled={isZipping}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-700 hover:from-brand-700 hover:via-indigo-700 hover:to-brand-800 active:scale-95 shadow-lg shadow-brand-600/35 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>{isZipping ? 'Archiving...' : 'Download Complete ZIP'}</span>
          </button>
        </div>
      </div>

      {exportError && (
        <div className="flex items-center gap-2 text-xs text-rose-600 dark:text-rose-400 pt-1">
          <AlertCircle className="w-4 h-4" />
          <span>{exportError}</span>
        </div>
      )}
    </div>
  );
};
