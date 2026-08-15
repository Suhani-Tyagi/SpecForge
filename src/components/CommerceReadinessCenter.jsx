import React from 'react';
import { CheckCircle2, AlertTriangle, RefreshCw, Edit3, ArrowRight, ShieldCheck, Lock } from 'lucide-react';

export default function CommerceReadinessCenter({ product, onSelectForReview, onToast }) {
  const readiness = product?.commerceReadiness || {
    completeness: 88,
    confidence: 81,
    consistency: 60,
    traceability: 95,
    blockingIssues: [
      "Unconfirmed primary voltage discrepancy between Datasheet (415V) and Distributor API (380V)",
      "Protection rating requires human sign-off (IP55 vs IP54)"
    ]
  };

  const isReady = product?.commerceStatus === 'READY' || readiness.blockingIssues.length === 0;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-extrabold text-white tracking-tight">COMMERCE READINESS GATING</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated quality gatekeeper ensuring zero invalid product records reach enterprise PIM/eCommerce catalogs.
          </p>
        </div>

        <div className={`px-4 py-2 rounded-xl text-xs font-mono font-extrabold flex items-center space-x-2 border shadow-lg ${
          isReady 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10' 
            : 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-rose-500/10'
        }`}>
          {isReady ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          <span>{isReady ? 'READY FOR CATALOG' : 'NOT READY FOR CATALOG'}</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
        {[
          { label: "Completeness", val: `${readiness.completeness}%`, isOk: readiness.completeness >= 85 },
          { label: "AI Confidence", val: `${readiness.confidence}%`, isOk: readiness.confidence >= 80 },
          { label: "Consistency", val: `${readiness.consistency}%`, isOk: readiness.consistency >= 80 },
          { label: "Traceability", val: `${readiness.traceability}%`, isOk: readiness.traceability >= 90 },
          { label: "Normalization", val: "100%", isOk: true },
          { label: "Validation", val: isReady ? "PASSED" : "FLAGGED", isOk: isReady }
        ].map((m, i) => (
          <div key={i} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center space-y-1">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">{m.label}</div>
            <div className={`text-base font-extrabold ${m.isOk ? 'text-emerald-400' : 'text-rose-400'}`}>
              {m.val}
            </div>
          </div>
        ))}
      </div>

      {/* Blocking Issues Section */}
      {!isReady && readiness.blockingIssues.length > 0 && (
        <div className="p-4 bg-rose-500/10 rounded-xl border border-rose-500/30 space-y-3 font-mono text-xs">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Catalog Publication Blockers ({readiness.blockingIssues.length} Blocking Issue):</span>
          </div>

          <div className="space-y-2">
            {readiness.blockingIssues.map((issue, idx) => (
              <div key={idx} className="p-2.5 bg-slate-950/90 rounded-lg border border-rose-500/20 text-rose-200 flex items-start space-x-2">
                <span className="text-rose-400 font-bold shrink-0">{idx + 1}.</span>
                <span className="leading-normal">{issue}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => onSelectForReview && onSelectForReview(product)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-all"
            >
              <span>Resolve Issues in HITL UI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onToast && onToast("Re-running automated validation engine...", "info")}
              className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg border border-slate-700"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Re-run Validation</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
