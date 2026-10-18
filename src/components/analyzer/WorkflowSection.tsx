import React from 'react';
import { Globe, Search, FileText, Download } from 'lucide-react';

export const WorkflowSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Enter Website Target',
      description: 'Provide any public website URL or drag-and-drop a screenshot for instant, client-side visual inspection.',
      icon: Globe,
    },
    {
      number: '02',
      title: 'Extract Real Evidence',
      description: 'PixelSpec measures the layout geometry, color histograms, typography baseline, and component hierarchies.',
      icon: Search,
    },
    {
      number: '03',
      title: 'Generate Blueprint',
      description: 'Rule-based deterministic engine synthesizes comprehensive DESIGN.md, tokens.json, and coding directives.',
      icon: FileText,
    },
    {
      number: '04',
      title: 'Feed Your Coding Agent',
      description: 'Download the complete ZIP archive and pass it directly to Claude 3.7, Cursor, Devin, v0, or Windsurf.',
      icon: Download,
    },
  ];

  return (
    <section id="workflow" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Reverse-Engineering Workflow
        </h2>
        <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          From live website to coding prompt in 4 steps
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Measurable, structured facts instead of vague hand-waving prompts like "make a site like this."
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative group hover:border-brand-500/50 transition-colors space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-black text-brand-600/30 dark:text-brand-400/20 group-hover:text-brand-600/60 transition-colors">
                  {step.number}
                </span>
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center group-hover:bg-brand-50 dark:group-hover:bg-brand-950/60 group-hover:text-brand-600 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {step.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
