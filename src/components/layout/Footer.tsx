import React from 'react';
import { Layers, FileCode } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-sm text-slate-500 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
              Pixel<span className="text-brand-600 dark:text-brand-400">Spec</span>
            </span>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            A free, browser-based website design reverse-engineering tool and AI specification generator for developers. Turn any public URL or screenshot into a precise design blueprint your AI coding agent can understand.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
            Specification Files
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <code className="text-brand-600 dark:text-brand-400 font-mono">DESIGN.md</code> — 13-section visual blueprint
            </li>
            <li>
              <code className="text-brand-600 dark:text-brand-400 font-mono">COMPONENTS.md</code> — Component specs & styles
            </li>
            <li>
              <code className="text-brand-600 dark:text-brand-400 font-mono">design-tokens.json</code> — Normalized JSON tokens
            </li>
            <li>
              <code className="text-brand-600 dark:text-brand-400 font-mono">AGENT-PROMPT.md</code> — Coding agent directives
            </li>
            <li>
              <code className="text-brand-600 dark:text-brand-400 font-mono">VALIDATION.md</code> — Visual QA checklist
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white mb-3 text-xs uppercase tracking-wider">
            Quick Navigation
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <button
                onClick={() => onNavigate('analyzer')}
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                Website Analyzer
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('workflow')}
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                How It Works
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('features')}
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                Feature Highlights
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('faq')}
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                Frequently Asked Questions
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('privacy')}
                className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                Privacy & Technical Limitations
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <p>
          © {new Date().getFullYear()} PixelSpec. Free developer tool. Sourced evidence is measured objectively without unauthorized data collection.
        </p>
        <p className="flex items-center gap-1 text-slate-400">
          <FileCode className="w-3.5 h-3.5" /> Built with React, TypeScript & Tailwind CSS
        </p>
      </div>
    </footer>
  );
};
