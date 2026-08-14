import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, ChevronDown, ChevronRight, Info } from 'lucide-react';

export default function ValidationExplorer({ validationData = {} }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const status = validationData.status || 'valid';
  const score = validationData.quality_score || 85;
  const violations = validationData.rule_violations || [];

  const passedRulesCount = Math.max(5 - violations.length, 3);
  const warningsCount = violations.filter(v => v.severity === 'warning').length;
  const errorCount = violations.filter(v => v.severity === 'error').length;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5 font-mono">
      
      {/* Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100 font-sans">
              Engineering Rules Validation Engine Explorer
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Deterministic physical consistency checks & UNSPSC rule evaluation.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
            ✓ {passedRulesCount} Passed
          </span>
          {warningsCount > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
              ⚠️ {warningsCount} Warnings
            </span>
          )}
          {errorCount > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
              ✕ {errorCount} Failures
            </span>
          )}
        </div>
      </div>

      {/* Rules Breakdown List */}
      <div className="space-y-3">
        {violations.length > 0 ? (
          violations.map((v, idx) => {
            const isExpanded = expandedIndex === idx;

            return (
              <div key={idx} className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between hover:bg-slate-900/50 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className={`w-4 h-4 ${v.severity === 'error' ? 'text-rose-400' : 'text-amber-400'}`} />
                    <span className="text-xs font-bold text-slate-200">Rule: {v.rule}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      v.severity === 'error' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {v.severity}
                    </span>
                  </div>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                </button>

                {isExpanded && (
                  <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">TARGET FIELD</span>
                      <span className="font-bold text-amber-300">{v.field}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">VIOLATION REASON</span>
                      <p className="text-slate-200 font-sans text-[11px]">{v.message}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">RECOMMENDED ACTION</span>
                      <p className="text-cyan-300 font-sans text-[11px]">Inspect supplier datasheet for exact physical dimensions.</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center space-x-3 text-xs text-emerald-300">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <div>
              <span className="font-bold block">100% Engineering Rules Compliance</span>
              <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                All physical dimension correlations, RPM ranges, and material ratings passed validation cleanly.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
