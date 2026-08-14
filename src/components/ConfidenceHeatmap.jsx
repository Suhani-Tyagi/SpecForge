import React from 'react';
import { CheckCircle2, AlertTriangle, Info, Sparkles, HelpCircle } from 'lucide-react';

export default function ConfidenceHeatmap({ attributes = {} }) {
  if (Object.keys(attributes).length === 0) return null;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wide">
            Field-Level AI Confidence Heatmap & Traceability Matrix
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Source & Reasoning Provenance per Attribute
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.entries(attributes).map(([key, attr]) => {
          const val = typeof attr === 'object' ? attr.value : attr;
          const conf = typeof attr === 'object' ? (attr.confidence || 'medium') : 'high';
          const src = typeof attr === 'object' ? (attr.source || 'extracted') : 'extracted';
          const reason = typeof attr === 'object' ? (attr.reasoning || 'Extracted attribute') : 'Extracted';
          const normVal = typeof attr === 'object' ? attr.normalized_value : null;
          const normUnit = typeof attr === 'object' ? attr.normalized_unit : null;

          return (
            <div
              key={key}
              className={`p-3 rounded-xl border transition-all space-y-1.5 ${
                conf === 'high' ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500' :
                conf === 'medium' ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-500' :
                'bg-rose-950/20 border-rose-500/40 hover:border-rose-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-slate-200 line-clamp-1">{key}</span>
                <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                  conf === 'high' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  conf === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {conf === 'high' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                  {conf === 'medium' && <Info className="w-3 h-3 text-amber-400" />}
                  {conf === 'low' && <AlertTriangle className="w-3 h-3 text-rose-400" />}
                  <span>{conf} CONFIDENCE</span>
                </span>
              </div>

              <div className="flex items-baseline justify-between font-mono">
                <span className="text-sm font-bold text-amber-300">{String(val)}</span>
                {normVal && normUnit && (
                  <span className="text-[10px] text-cyan-300 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-800/40">
                    {normVal} {normUnit}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] font-mono text-slate-400">
                <span className="bg-slate-800 px-1.5 py-0.5 rounded font-semibold text-slate-300">
                  {src}
                </span>
                <span className="italic line-clamp-1 text-slate-400 max-w-[180px]" title={reason}>
                  "{reason}"
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
