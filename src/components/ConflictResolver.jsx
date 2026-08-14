import React, { useState } from 'react';
import { AlertTriangle, Check, Edit2, X, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ConflictResolver({ conflicts = [], onResolveConflict }) {
  const [resolvedFields, setResolvedFields] = useState({});

  if (!conflicts || conflicts.length === 0) return null;

  const handleResolve = (field, chosenValue, choiceType) => {
    setResolvedFields(prev => ({ ...prev, [field]: { chosenValue, choiceType } }));
    if (onResolveConflict) onResolveConflict(field, chosenValue, choiceType);
  };

  return (
    <div className="bg-amber-950/20 rounded-2xl border border-amber-500/30 p-5 shadow-xl space-y-4 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wide">
            Source Authority Conflict Resolution Engine ({conflicts.length} Conflicts Detected)
          </h3>
        </div>
        <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
          Source Precedence Active
        </span>
      </div>

      <div className="space-y-3">
        {conflicts.map((c) => {
          const isResolved = Boolean(resolvedFields[c.field]);
          const resInfo = resolvedFields[c.field];

          return (
            <div
              key={c.field}
              className={`p-4 rounded-xl border transition-all ${
                isResolved
                  ? 'bg-slate-950/60 border-emerald-500/40 opacity-80'
                  : 'bg-slate-950/90 border-amber-500/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-100">{c.field}</span>
                    {isResolved && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Resolved: {String(resInfo.chosenValue)}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 font-sans">
                    Reason: {c.reason}
                  </p>
                </div>

                {!isResolved && (
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleResolve(c.field, c.recommendedValue, 'ACCEPTED_RECOMMENDATION')}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-md flex items-center space-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept {String(c.recommendedValue)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleResolve(c.field, c.competingValue, 'CHOSE_ALTERNATIVE')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 flex items-center space-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      <span>Choose {String(c.competingValue)}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleResolve(c.field, c.recommendedValue, 'DISMISSED')}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg border border-slate-700"
                      aria-label="Dismiss conflict"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
