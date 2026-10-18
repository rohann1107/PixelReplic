import React, { useState } from 'react';
import {
  FileText,
  Layers,
  Palette,
  FileCode,
  Sparkles,
  ShieldCheck,
  Globe,
  ExternalLink,
  ArrowLeft,
  LayoutGrid,
} from 'lucide-react';
import { AnalysisResult } from '../../types';
import { MarkdownPreview } from './MarkdownPreview';
import { DesignTokensViewer } from './DesignTokensViewer';
import { ComponentInspector } from './ComponentInspector';
import { AssetManifestViewer } from './AssetManifestViewer';
import { ExportBar } from './ExportBar';

interface ResultsWorkspaceProps {
  result: AnalysisResult;
  onReset: () => void;
}

type TabType =
  | 'DESIGN.md'
  | 'COMPONENTS.md'
  | 'AGENT-PROMPT.md'
  | 'VALIDATION.md'
  | 'tokens-visual'
  | 'components-visual'
  | 'tokens-json'
  | 'assets-manifest';

export const ResultsWorkspace: React.FC<ResultsWorkspaceProps> = ({ result, onReset }) => {
  const [activeTab, setActiveTab] = useState<TabType>('DESIGN.md');
  const { evidence, documents, referenceImages } = result;

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'DESIGN.md', label: 'DESIGN.md', icon: FileText },
    { id: 'tokens-visual', label: 'Design Tokens', icon: Palette },
    { id: 'components-visual', label: 'Component Catalog', icon: Layers },
    { id: 'AGENT-PROMPT.md', label: 'AGENT-PROMPT.md', icon: Sparkles },
    { id: 'COMPONENTS.md', label: 'COMPONENTS.md', icon: FileCode },
    { id: 'VALIDATION.md', label: 'VALIDATION.md', icon: ShieldCheck },
    { id: 'tokens-json', label: 'design-tokens.json', icon: FileCode },
    { id: 'assets-manifest', label: 'assets-manifest.json', icon: LayoutGrid },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation Bar with Back Action & Quick Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onReset}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Start new analysis"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {evidence.pageTitle || 'Analysis Blueprint'}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
                Generated
              </span>
            </div>
            <a
              href={evidence.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-mono mt-0.5"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{evidence.url}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Mode & Engine Tag */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-slate-600 dark:text-slate-300">
            Mode: {evidence.analysisMode}
          </span>
          {evidence.isAiEnhanced && (
            <span className="px-3 py-1 rounded-xl bg-brand-50 dark:bg-brand-950/50 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Enhanced
            </span>
          )}
        </div>
      </div>

      {/* Export Action Bar */}
      <ExportBar result={result} />

      {/* Main Workspace Layout (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar Panel (Metadata, Outline, Color Swatches) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Screenshot Preview Card if available */}
          {referenceImages.length > 0 && (
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Visual Reference Snapshot
              </span>
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 max-h-56">
                <img
                  src={referenceImages[0].dataUrl}
                  alt="Reference capture"
                  className="w-full object-cover object-top hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-mono text-center">
                Captured at {evidence.viewport.width} × {evidence.viewport.height} px
              </p>
            </div>
          )}

          {/* Quick Metrics */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Extraction Metrics
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 block text-[11px]">Core Sections</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {evidence.sections.length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 block text-[11px]">Detected Components</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {evidence.components.length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 block text-[11px]">Color Tokens</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {evidence.tokens.colors.all.length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <span className="text-slate-500 block text-[11px]">Typography Steps</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">
                  {evidence.tokens.typography.scale.length}
                </span>
              </div>
            </div>
          </div>

          {/* Section Outline */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Page Section Hierarchy
            </h3>
            <div className="space-y-1.5 text-xs">
              {evidence.sections.map((s, idx) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-5 h-5 rounded-md bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                      {s.name}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                    {s.layoutPattern}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Main Viewer Panel */}
        <main className="lg:col-span-8 space-y-4">
          {/* Scrollable Tabs Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Content */}
          <div className="min-h-[500px]">
            {activeTab === 'DESIGN.md' && (
              <MarkdownPreview content={documents['DESIGN.md']} filename="DESIGN.md" />
            )}
            {activeTab === 'COMPONENTS.md' && (
              <MarkdownPreview content={documents['COMPONENTS.md']} filename="COMPONENTS.md" />
            )}
            {activeTab === 'AGENT-PROMPT.md' && (
              <MarkdownPreview content={documents['AGENT-PROMPT.md']} filename="AGENT-PROMPT.md" />
            )}
            {activeTab === 'VALIDATION.md' && (
              <MarkdownPreview content={documents['VALIDATION.md']} filename="VALIDATION.md" />
            )}
            {activeTab === 'tokens-visual' && (
              <DesignTokensViewer tokens={evidence.tokens} />
            )}
            {activeTab === 'components-visual' && (
              <ComponentInspector components={evidence.components} />
            )}
            {activeTab === 'tokens-json' && (
              <MarkdownPreview
                content={`\`\`\`json\n${documents['design-tokens.json']}\n\`\`\``}
                filename="design-tokens.json"
              />
            )}
            {activeTab === 'assets-manifest' && (
              <AssetManifestViewer assets={evidence.assets} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
