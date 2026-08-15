import React from 'react';
import { BarChart3, TrendingUp, ShieldCheck, AlertTriangle, CheckCircle2, PieChart } from 'lucide-react';

export default function AnalyticsDashboard() {
  const metrics = [
    { label: "Overall Catalog Completeness", val: "94.2%", change: "+4.1%", isGood: true },
    { label: "Mean AI Extraction Confidence", val: "92.8%", change: "+2.5%", isGood: true },
    { label: "Attribute Conflict Rate", val: "4.8%", change: "-6.2%", isGood: true },
    { label: "Automated Approval Rate", val: "88.4%", change: "+12.1%", isGood: true },
    { label: "Manual Review Workload", val: "11.6%", change: "-12.1%", isGood: true },
    { label: "Average Latency / Record", val: "1.4s", change: "-0.3s", isGood: true }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-extrabold text-white tracking-tight">QUALITY & PERFORMANCE ANALYTICS</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time quality intelligence metrics, automation efficiency, and error rates across supplier batches.
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl font-bold">
          Demo Dataset Metrics
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
        {metrics.map((m, i) => (
          <div key={i} className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase">{m.label}</div>
            <div className="text-xl font-extrabold text-white">{m.val}</div>
            <div className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>{m.change} vs baseline</span>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        
        {/* Quality Trend Bar Chart */}
        <div className="p-5 bg-slate-950/90 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-slate-300 font-bold border-b border-slate-800 pb-2">
            <span>Catalog Quality Trend (Last 6 Batches)</span>
            <span className="text-emerald-400">Target 95%</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { batch: "Batch #101 (Motors)", val: 94 },
              { batch: "Batch #102 (Pumps)", val: 82 },
              { batch: "Batch #103 (Valves)", val: 78 },
              { batch: "Batch #104 (Sensors)", val: 98 },
              { batch: "Batch #105 (Drives)", val: 91 },
              { batch: "Batch #106 (Current)", val: 96 }
            ].map((b, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">{b.batch}</span>
                  <span className="text-amber-400 font-bold">{b.val}% Quality</span>
                </div>
                <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-400" style={{ width: `${b.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Automation Breakdown */}
        <div className="p-5 bg-slate-950/90 rounded-xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between text-slate-300 font-bold border-b border-slate-800 pb-2">
            <span>Automation vs Exception Breakdown</span>
            <span className="text-amber-400">88.4% Auto</span>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30 flex items-center justify-between text-emerald-300">
              <span>Auto-Approved High Confidence SKUs</span>
              <strong className="text-sm">88.4%</strong>
            </div>

            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 flex items-center justify-between text-amber-300">
              <span>Routed for HITL Exception Review</span>
              <strong className="text-sm">9.5%</strong>
            </div>

            <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/30 flex items-center justify-between text-rose-300">
              <span>Blocked Critical Safety Violations</span>
              <strong className="text-sm">2.1%</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
