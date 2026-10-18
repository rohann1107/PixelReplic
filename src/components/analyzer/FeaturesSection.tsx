import React from 'react';
import {
  FileText,
  Palette,
  Layers,
  Smartphone,
  FolderArchive,
  Terminal,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'Structured DESIGN.md Specification',
      description: 'Generates an exhaustive 13-section visual blueprint detailing page geometry, layout patterns, color tokens, and implementation guidelines.',
      icon: FileText,
    },
    {
      title: 'Normalized Design Tokens JSON',
      description: 'Produces valid design-tokens.json with exact color roles, 8pt spacing grid, typography scale, radii, and container breakpoints.',
      icon: Palette,
    },
    {
      title: 'Component Inventory & States',
      description: 'Catalog of headers, heroes, cards, navigation drawers, buttons, and forms with measured computed styles, variants, and observable states.',
      icon: Layers,
    },
    {
      title: 'Multi-Viewport Responsive Rules',
      description: 'Documents column adjustments, container padding shifts, and navigation collapses for 1440px Desktop, 768px Tablet, and 390px Mobile.',
      icon: Smartphone,
    },
    {
      title: 'Coding-Agent Directive Prompt',
      description: 'Pre-formatted AGENT-PROMPT.md providing step-by-step instructions telling your AI coding agent how to build the site without hallucinations.',
      icon: Terminal,
    },
    {
      title: 'Instant In-Browser ZIP Packaging',
      description: 'Compiles all generated Markdown, JSON tokens, assets manifests, and reference captures into a single downloadable ZIP using JSZip.',
      icon: FolderArchive,
    },
    {
      title: 'Client-Side Deterministic Engine',
      description: 'Zero dependency on expensive external AI APIs. Works completely client-side in your browser with optional AI enhancement if configured.',
      icon: CheckCircle2,
    },
    {
      title: '100% Free & Anonymous',
      description: 'No login, no subscriptions, no tracking cookies, and no personal account creation. Built purely for developer productivity.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Engine Capabilities
        </h2>
        <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Everything your AI agent needs to write perfect code
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Built to bridge the communication gap between human designers and automated AI coding assistants.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {feat.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {feat.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
