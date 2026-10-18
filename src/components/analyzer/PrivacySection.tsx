import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Trash2, CheckCircle2 } from 'lucide-react';

export const PrivacySection: React.FC = () => {
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleClearLocalStorage = () => {
    localStorage.removeItem('pixelspec-theme');
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 2500);
  };

  return (
    <section id="privacy" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-200 dark:border-slate-800 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Security & Privacy Statement
        </h2>
        <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy-First & Technical Limitations
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          PixelSpec is engineered with zero data monetization, zero telemetry, and zero mandatory backend dependencies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Privacy Principles */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Privacy Guarantees
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>No User Account:</strong> We do not store email addresses, names, or credentials.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>In-Browser Processing:</strong> Canvas pixel analysis and ZIP exports execute 100% locally on your machine.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>Zero Tracking:</strong> No tracking cookies, third-party analytics pixels, or commercial tracking scripts.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span><strong>SSRF Protection:</strong> Localhost and private subnets (127.0.0.1, 10.x, 192.168.x) are strictly restricted from remote requests.</span>
            </li>
          </ul>
        </div>

        {/* Known Limitations */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Technical Limitations
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>CORS Boundaries:</strong> Direct fetch calls from standard browsers cannot read raw cross-origin HTML without an authorized worker proxy.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Protected Content:</strong> Websites behind paywalls, CAPTCHAs, or authentication cannot be analyzed automatically. Use Screenshot Mode instead.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span><strong>Proprietary Fonts:</strong> Licensed web fonts that are not openly accessible are replaced by safe web-standard system fallbacks in the specification.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Clear Local Cache Control */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Clear Browser Stored Preferences
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Reset locally stored theme preferences and session data.
          </p>
        </div>
        <button
          type="button"
          onClick={handleClearLocalStorage}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-900 flex items-center gap-2 transition-colors"
        >
          {clearedNotice ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600">Preferences Reset</span>
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4 text-slate-400" />
              <span>Clear Local Data</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};
