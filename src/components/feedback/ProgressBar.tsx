import React, { useEffect, useState } from 'react';
import { Loader2, XCircle, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { StepProgress, AnalysisStatus } from '../../types';

interface ProgressBarProps {
  progress: StepProgress;
  onCancel: () => void;
}

const STAGES_LIST: { id: AnalysisStatus; label: string }[] = [
  { id: 'validating', label: 'Validate' },
  { id: 'connecting', label: 'Connect' },
  { id: 'capturing', label: 'Capture' },
  { id: 'extracting', label: 'Tokens' },
  { id: 'detecting_components', label: 'Components' },
  { id: 'generating', label: 'Blueprint' },
  { id: 'packaging', label: 'Package' },
];

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, onCancel }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentIdx = STAGES_LIST.findIndex((s) => s.id === progress.stage);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 animate-in fade-in transition-colors">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center animate-pulse">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {progress.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{progress.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
            <Clock className="w-3.5 h-3.5" />
            <span>{elapsedSeconds}s</span>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
            title="Cancel analysis"
            aria-label="Cancel analysis"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Bar with Scanning Line Effect */}
      <div className="space-y-2">
        <div className="relative w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-600 via-indigo-500 to-brand-400 transition-all duration-300 ease-out rounded-full relative"
            style={{ width: `${progress.progressPercent}%` }}
          >
            {/* Subtle light sweep */}
            <div className="absolute inset-0 bg-white/20 w-8 blur-sm animate-[sweep_1.5s_infinite]" />
          </div>
        </div>
        <div className="flex justify-between text-[11px] text-slate-400 font-mono">
          <span>Processing real evidence</span>
          <span>{progress.progressPercent}%</span>
        </div>
      </div>

      {/* Real Task-Based Step Indicators */}
      <div className="grid grid-cols-7 gap-1 pt-1">
        {STAGES_LIST.map((step, idx) => {
          const isDone = currentIdx > idx;
          const isCurrent = currentIdx === idx;
          return (
            <div key={step.id} className="flex flex-col items-center gap-1 text-center">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                    ? 'bg-brand-600 text-white ring-4 ring-brand-500/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
              </div>
              <span
                className={`text-[10px] hidden sm:block ${
                  isCurrent
                    ? 'font-bold text-brand-600 dark:text-brand-400'
                    : isDone
                    ? 'text-slate-600 dark:text-slate-300'
                    : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Informational Subtext */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          Deterministic processing • Zero data sent to paid third-party APIs
        </span>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-rose-500 hover:underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
