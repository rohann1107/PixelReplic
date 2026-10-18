import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      q: 'Is PixelSpec free?',
      a: 'Yes, 100% free. There are no paywalls, hidden fees, tiered pricing, subscriptions, or credit card requirements.',
    },
    {
      q: 'Do I need an account?',
      a: 'No. PixelSpec operates completely anonymously. You never need to sign up, provide an email address, or log in.',
    },
    {
      q: 'Does it work on mobile and tablets?',
      a: 'Yes. The interface is fully responsive and optimized for touch devices, smartphones (e.g. 390px viewport), and iPads as well as desktop monitors.',
    },
    {
      q: 'Can it analyze every website?',
      a: 'PixelSpec can analyze any publicly accessible HTTP or HTTPS web address. However, websites requiring logins, paywalls, CAPTCHAs, or blocking automated bots cannot be crawled directly. For those, simply upload a screenshot to extract the full visual blueprint.',
    },
    {
      q: 'Does it use AI?',
      a: 'PixelSpec uses a layered approach. Its core engine is 100% deterministic and rule-based—requiring no AI keys or paid APIs. If an approved free inference provider is configured, it can optionally enrich the architectural summaries, but it is never a mandatory dependency.',
    },
    {
      q: 'Can it guarantee an exact 100% pixel-perfect replica?',
      a: 'No engineering tool can guarantee a 100% identical replica without access to the original proprietary source code repository. PixelSpec provides the highest practical fidelity and clearly distinguishes measured objective evidence from inferred recommendations.',
    },
    {
      q: 'What if a website blocks automated access?',
      a: 'Browser CORS security restrictions often block client-side fetch calls to arbitrary external websites. When this occurs, PixelSpec transparently informs you and lets you upload a screenshot to instantly extract the exact colors, typography, components, and layout.',
    },
    {
      q: 'What is included in the downloaded ZIP?',
      a: 'The archive contains DESIGN.md (13-section specification), COMPONENTS.md, design-tokens.json, assets-manifest.json, AGENT-PROMPT.md, VALIDATION.md, DESIGN.txt, and a reference/ folder containing captured or uploaded screenshots.',
    },
    {
      q: 'Does it upload my screenshots to a server?',
      a: 'No. In default deterministic analysis, screenshots are processed entirely in your browser using client-side HTML5 Canvas pixel sampling. Your images stay on your device.',
    },
    {
      q: 'Can I use the output with AI coding agents?',
      a: 'Yes, absolutely. The blueprint is specifically formatted with structured Markdown and JSON so tools like Claude 3.7 Sonnet, Cursor, GitHub Copilot, Devin, Windsurf, or v0 can execute the instructions step-by-step with zero guesswork.',
    },
  ];

  return (
    <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
          Frequently Asked Questions
        </h2>
        <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Everything you need to know about PixelSpec
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Honest answers without exaggerated marketing claims.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-xs"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                aria-expanded={isOpen}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-brand-600' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
