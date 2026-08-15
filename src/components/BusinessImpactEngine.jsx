import React from 'react';
import { TrendingUp, AlertTriangle, ShieldCheck, Clock, DollarSign, CheckCircle2, ArrowRight } from 'lucide-react';
import { BUSINESS_IMPACT_METRICS } from '../data/demoDataset.js';

export default function BusinessImpactEngine() {
  const metrics = BUSINESS_IMPACT_METRICS;

  const chains = [
    { issue: "Unresolved Voltage Conflict (415V vs 380V)", impact: "High Return Rate & Industrial Motor Burnout Risk", action: "Invoke Datasheet Source Authority SA-02" },
    { issue: "Missing Operating Temperature Rating", impact: "Non-compliance with Chemical Safety Regulations", action: "Block Publication via Category Gate EV-104" },
    { issue: "Unnormalized PSI / Bar Pressure Units", impact: "Inability of Buyers to Filter & CompareSKUs", action: "Apply Automated SI Unit Normalizer" }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 font-mono text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-extrabold text-white tracking-tight">BUSINESS IMPACT & ROI ENGINE</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Translate technical specification anomalies into operational risks and financial consequences.
          </p>
        </div>

        <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl font-bold">
          Simulated Workload Benchmark
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase">Conflicts Detected</div>
          <div className="text-xl font-extrabold text-white">{metrics.conflictsDetected.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400">Cross-source discrepancies</div>
        </div>

        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-rose-500/30 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase">Critical Safety Blocks</div>
          <div className="text-xl font-extrabold text-rose-400">{metrics.criticalBlocks} SKUs</div>
          <div className="text-[10px] text-slate-400">Prevented catalog publication</div>
        </div>

        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-amber-500/30 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase">Manual Hours Saved</div>
          <div className="text-xl font-extrabold text-amber-400">{metrics.hoursSaved.toLocaleString()} Hours</div>
          <div className="text-[10px] text-slate-400">85% Review workload cut</div>
        </div>

        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-emerald-500/30 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase">Estimated Financial ROI</div>
          <div className="text-xl font-extrabold text-emerald-400">{metrics.estimatedCostSavings}</div>
          <div className="text-[10px] text-slate-400">Reduced returns & labor</div>
        </div>
      </div>

      {/* Data Issue -> Business Consequence -> Recommended Action */}
      <div className="space-y-3 pt-2">
        <div className="text-slate-400 uppercase tracking-wider text-[11px] font-bold">
          Data Issue → Business Consequence → Recommended Action Chain:
        </div>

        <div className="space-y-2">
          {chains.map((c, i) => (
            <div key={i} className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5 max-w-md">
                <div className="text-rose-400 font-bold flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>DATA ISSUE: {c.issue}</span>
                </div>
                <div className="text-slate-300 text-[11px]">CONSEQUENCE: {c.impact}</div>
              </div>

              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300 font-bold text-[11px] shrink-0">
                ACTION: {c.action}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
