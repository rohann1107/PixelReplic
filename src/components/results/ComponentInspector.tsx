import React from 'react';
import { DetectedComponent } from '../../types';
import { Layout, CheckCircle, Tag, Eye } from 'lucide-react';

interface ComponentInspectorProps {
  components: DetectedComponent[];
}

export const ComponentInspector: React.FC<ComponentInspectorProps> = ({ components }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
          Detected UI Components ({components.length})
        </h3>
        <span className="text-xs text-slate-500 font-mono">Ranked by heuristic confidence</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {components.map((comp) => (
          <div
            key={comp.id}
            className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Layout className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  {comp.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {comp.semanticTag}
                  </span>
                  {comp.accessibleRole && (
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                      role="{comp.accessibleRole}"
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{Math.round(comp.confidence * 100)}%</span>
              </div>
            </div>

            {/* Variants & States */}
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400" /> Variants:
                </span>
                <div className="flex flex-wrap gap-1">
                  {comp.variants.map((v, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" /> Observable States:
                </span>
                <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                  {comp.observableStates.join(' • ')}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Responsive: </span>
                <span className="text-slate-600 dark:text-slate-400 text-[11px] leading-tight">
                  {comp.responsiveBehavior}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
