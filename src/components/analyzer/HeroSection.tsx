import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  onAnalyzeClick: () => void;
  onExploreWorkflow: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onAnalyzeClick,
  onExploreWorkflow,
}) => {
  return (
    <section className="relative pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-brand-500/10 to-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="text-center max-w-3xl mx-auto space-y-6 relative z-10">
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
          Turn any website into a{' '}
          <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">
            blueprint
          </span>
          .
        </h1>

        {/* Supporting Paragraph */}
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
          Inspect website structure, understand visual design tokens, and generate comprehensive Markdown specifications optimized for your AI coding agent.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={onAnalyzeClick}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-700 active:scale-95 shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <span>Analyze a Website</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onExploreWorkflow}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-semibold text-sm text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-all"
          >
            <span>Explore the Workflow</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </section>
  );
};
