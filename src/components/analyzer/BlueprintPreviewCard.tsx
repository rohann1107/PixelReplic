import React from 'react';
import { CheckCircle2, Sparkles, FileText, Layers, Code2 } from 'lucide-react';

export const BlueprintPreviewCard: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden transition-all">
      {/* Window Titlebar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-400/90 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-400/90 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-400/90 inline-block" />
        </div>

        <div className="px-4 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-400 shadow-sm">
          <span>pixelspec.blueprint → website-blueprint.zip</span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>Valid Spec</span>
        </div>
      </div>

      {/* Card Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-7">
        {/* Left Column: Target Website Evidence Wireframe */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              Target Website Evidence
            </span>
            <span className="font-mono text-[11px] text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/50 px-2.5 py-0.5 rounded-full border border-brand-200/50 dark:border-brand-800/50">
              1440 × 900 px
            </span>
          </div>

          {/* Wireframe Mockup */}
          <div className="w-full bg-slate-100/80 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
            {/* Nav wireframe */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 dark:border-slate-700/50">
              <div className="h-3 w-16 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <div className="flex gap-1.5">
                <div className="h-2.5 w-8 bg-slate-300 dark:bg-slate-700 rounded-full" />
                <div className="h-2.5 w-8 bg-slate-300 dark:bg-slate-700 rounded-full" />
              </div>
            </div>

            {/* Hero Wireframe */}
            <div className="py-4 flex flex-col items-center justify-center space-y-2.5 bg-white/70 dark:bg-slate-900/60 rounded-xl border border-slate-200/40 dark:border-slate-800 p-4">
              <div className="h-3 w-3/4 bg-slate-400 dark:bg-slate-600 rounded-full" />
              <div className="h-2 w-1/2 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <div className="pt-1.5">
                <div className="h-6 w-20 bg-brand-600 dark:bg-brand-500 rounded-lg shadow-sm" />
              </div>
            </div>

            {/* 3 Sub-Cards */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white/60 dark:bg-slate-900/40 rounded-lg p-2.5 border border-slate-200/40 dark:border-slate-800 space-y-2"
                >
                  <div className="h-3.5 w-3.5 rounded bg-brand-400/40 dark:bg-brand-500/30" />
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Generated Agent Package */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              Generated Agent Package
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              Ready
            </span>
          </div>

          <div className="space-y-3">
            {/* DESIGN.md */}
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-4 border border-slate-200/70 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-brand-600 dark:text-brand-400">
                <FileText className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>DESIGN.md (13 Sections)</span>
              </div>
              <ul className="pl-6 space-y-1 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 inline-block" />
                  <span>8pt Spacing Scale & Max Container</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 inline-block" />
                  <span>Exact Measured Color Tokens (#4F46E5)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 inline-block" />
                  <span>Typographic Scale & Heading Rules</span>
                </li>
              </ul>
            </div>

            {/* COMPONENTS.md */}
            <div className="flex items-center gap-2.5 px-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/70 dark:border-slate-800 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>COMPONENTS.md (State & Variants)</span>
            </div>

            {/* AGENT-PROMPT.md */}
            <div className="flex items-center gap-2.5 px-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/70 dark:border-slate-800 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Code2 className="w-4 h-4 text-amber-500" />
              <span>AGENT-PROMPT.md (Step-by-step)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
