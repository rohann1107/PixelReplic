import React, { useState } from 'react';
import { Layers, Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { ThemeToggle } from '../common/ThemeToggle';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  onOpenAnalyzer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, onOpenAnalyzer }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => handleNavClick('hero')}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                Pixel<span className="text-brand-600 dark:text-brand-400">Spec</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                Free
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono hidden sm:block">
              Every pixel has a blueprint.
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button
            onClick={() => handleNavClick('analyzer')}
            className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            Analyzer
          </button>
          <button
            onClick={() => handleNavClick('workflow')}
            className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick('features')}
            className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            FAQ
          </button>
          <button
            onClick={() => handleNavClick('privacy')}
            className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Privacy
          </button>
        </nav>

        {/* Right Action & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={onOpenAnalyzer}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 shadow-sm shadow-brand-600/30 transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            <Sparkles className="w-4 h-4" />
            Analyze Website
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-4 pb-6 space-y-3">
          <button
            onClick={() => handleNavClick('analyzer')}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600"
          >
            Analyzer
          </button>
          <button
            onClick={() => handleNavClick('workflow')}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600"
          >
            How It Works
          </button>
          <button
            onClick={() => handleNavClick('features')}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600"
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600"
          >
            FAQ
          </button>
          <button
            onClick={() => handleNavClick('privacy')}
            className="w-full text-left py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Privacy & Limitations
          </button>
          <div className="pt-2">
            <button
              onClick={() => {
                onOpenAnalyzer();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              Analyze Website Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
