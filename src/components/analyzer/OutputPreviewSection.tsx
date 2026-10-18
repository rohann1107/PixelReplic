import React from 'react';
import { Folder, FileCode, FileText, Image, Sparkles } from 'lucide-react';

export const OutputPreviewSection: React.FC = () => {
  const files = [
    {
      name: 'DESIGN.md',
      desc: 'The primary 13-section visual blueprint with layout geometry, color tables, typography scale, and section-by-section breakdown.',
      icon: FileText,
      color: 'text-brand-600 dark:text-brand-400',
    },
    {
      name: 'COMPONENTS.md',
      desc: 'Exhaustive UI component inventory with computed CSS rules, variants, observable states (hover, focus, active), and semantic tags.',
      icon: FileCode,
      color: 'text-indigo-500',
    },
    {
      name: 'design-tokens.json',
      desc: 'Normalized machine-readable JSON tokens for colors, typography scales, 8pt spacing grid, radii, and container widths.',
      icon: FileCode,
      color: 'text-amber-500',
    },
    {
      name: 'assets-manifest.json',
      desc: 'Catalog of referenced vector marks, logos, icons, and image dimensions with status and accessibility alt-text metadata.',
      icon: FileCode,
      color: 'text-emerald-500',
    },
    {
      name: 'AGENT-PROMPT.md',
      desc: 'Standalone, step-by-step directive prompt telling Claude, Cursor, Devin, v0, or Windsurf how to faithfully code the frontend.',
      icon: Sparkles,
      color: 'text-purple-500',
    },
    {
      name: 'VALIDATION.md',
      desc: 'Quality assurance checklist, viewport test dimensions, and visual overlay criteria for comparing the rebuilt application.',
      icon: FileText,
      color: 'text-blue-500',
    },
    {
      name: 'reference/ (Directory)',
      desc: 'High-resolution viewport screenshots captured or uploaded during the analysis session for pixel-comparison verification.',
      icon: Image,
      color: 'text-rose-500',
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Generated Blueprint Package
        </h2>
        <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          What is inside <code className="font-mono text-brand-600 dark:text-brand-400">website-blueprint.zip</code>?
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          A structured developer package ready to drop directly into your AI coding workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive File Tree Preview */}
        <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 font-mono text-xs shadow-xl">
          <div className="flex items-center gap-2 text-slate-400 pb-4 border-b border-slate-800">
            <Folder className="w-4 h-4 text-brand-400" />
            <span className="font-bold text-white">website-blueprint/</span>
          </div>
          <div className="pt-4 space-y-3 pl-2">
            <div className="flex items-center gap-2 text-brand-300">
              <span className="text-slate-600">├──</span>
              <FileText className="w-3.5 h-3.5 text-brand-400" />
              <span className="font-semibold">DESIGN.md</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-300">
              <span className="text-slate-600">├──</span>
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              <span>COMPONENTS.md</span>
            </div>
            <div className="flex items-center gap-2 text-amber-300">
              <span className="text-slate-600">├──</span>
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              <span>design-tokens.json</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-300">
              <span className="text-slate-600">├──</span>
              <FileCode className="w-3.5 h-3.5 text-emerald-400" />
              <span>assets-manifest.json</span>
            </div>
            <div className="flex items-center gap-2 text-purple-300">
              <span className="text-slate-600">├──</span>
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>AGENT-PROMPT.md</span>
            </div>
            <div className="flex items-center gap-2 text-blue-300">
              <span className="text-slate-600">├──</span>
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>VALIDATION.md</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-slate-600">└──</span>
              <Folder className="w-3.5 h-3.5 text-slate-500" />
              <span>reference/</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 pl-6 text-[11px]">
              <span className="text-slate-700">└──</span>
              <Image className="w-3 h-3 text-slate-500" />
              <span>desktop.png</span>
            </div>
          </div>
        </div>

        {/* Right: Explanatory Card List */}
        <div className="lg:col-span-7 space-y-3">
          {files.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs flex items-start gap-3"
              >
                <div className="mt-0.5 flex-shrink-0">
                  <Icon className={`w-4 h-4 ${f.color}`} />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                    {f.name}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal mt-0.5">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
