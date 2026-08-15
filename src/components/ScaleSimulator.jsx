import React, { useState } from 'react';
import { Rocket, Cpu, Database, ArrowRight, ShieldCheck, CheckCircle2, Server, Layers } from 'lucide-react';
import { SCALE_BENCHMARKS } from '../data/demoDataset.js';

export default function ScaleSimulator() {
  const [selectedScale, setSelectedScale] = useState(1000);
  const bench = SCALE_BENCHMARKS[selectedScale] || SCALE_BENCHMARKS[1000];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Rocket className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-extrabold text-white tracking-tight">ENTERPRISE SCALE SIMULATOR</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate processing throughput, automated approval rates, and workload reduction at scale.
          </p>
        </div>

        {/* Scale Selectors */}
        <div className="flex items-center space-x-1.5 font-mono text-xs bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {[100, 1000, 10000, 100000].map((count) => (
            <button
              key={count}
              onClick={() => setSelectedScale(count)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                selectedScale === count
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {count.toLocaleString()} SKUs
            </button>
          ))}
        </div>
      </div>

      {/* Mandatory Label Notice */}
      <div className="px-3.5 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 font-mono text-xs flex items-center justify-between">
        <span>⚠ Illustrative simulation — projected metrics based on benchmark queue performance.</span>
        <span className="text-[10px] text-amber-400/80">Modeled for 100K catalog batching</span>
      </div>

      {/* Simulation Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase">Products Processed</div>
          <div className="text-xl font-extrabold text-white">{bench.products.toLocaleString()} SKUs</div>
          <div className="text-[10px] text-emerald-400">100% Ingestion Complete</div>
        </div>

        <div className="p-4 bg-slate-950/80 rounded-xl border border-emerald-500/30 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase">AI Auto-Approved</div>
          <div className="text-xl font-extrabold text-emerald-400">{bench.aiApproved.toLocaleString()} SKUs</div>
          <div className="text-[10px] text-slate-400">High-confidence baseline</div>
        </div>

        <div className="p-4 bg-slate-950/80 rounded-xl border border-amber-500/30 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase">HITL Exception Review</div>
          <div className="text-xl font-extrabold text-amber-400">{bench.humanReview.toLocaleString()} SKUs</div>
          <div className="text-[10px] text-slate-400">Routed to review queue</div>
        </div>

        <div className="p-4 bg-slate-950/80 rounded-xl border border-rose-500/30 space-y-1">
          <div className="text-[10px] text-slate-500 uppercase">Catalog Blocked</div>
          <div className="text-xl font-extrabold text-rose-400">{bench.blocked.toLocaleString()} SKUs</div>
          <div className="text-[10px] text-slate-400">Critical safety violations</div>
        </div>
      </div>

      {/* ROI & Workload Impact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-[10px]">Estimated Workload Hours Saved</div>
            <div className="text-lg font-bold text-amber-300 mt-0.5">{bench.workloadHoursSaved.toLocaleString()} Hours</div>
          </div>
          <CheckCircle2 className="w-6 h-6 text-amber-400" />
        </div>

        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-[10px]">Estimated Batch Processing Time</div>
            <div className="text-lg font-bold text-cyan-300 mt-0.5">{bench.processingTimeMinutes} Minutes</div>
          </div>
          <Cpu className="w-6 h-6 text-cyan-400" />
        </div>

        <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-[10px]">Projected Cost / SKU</div>
            <div className="text-lg font-bold text-emerald-300 mt-0.5">{bench.costPerProduct} / SKU</div>
          </div>
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
        </div>
      </div>

      {/* Scalable Architecture Flow Diagram */}
      <div className="p-5 bg-slate-950/90 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
        <div className="text-slate-400 uppercase tracking-wider text-[11px] font-bold">
          Scalable Parallel Queue Architecture Diagram:
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 py-3 px-2 bg-slate-900/80 rounded-lg border border-slate-800 text-[11px]">
          <span className="p-2 bg-slate-800 text-slate-200 rounded border border-slate-700">Supplier Inputs</span>
          <ArrowRight className="w-4 h-4 text-slate-500" />
          <span className="p-2 bg-slate-800 text-cyan-300 rounded border border-cyan-500/30">API Gateway</span>
          <ArrowRight className="w-4 h-4 text-slate-500" />
          <span className="p-2 bg-slate-800 text-amber-300 rounded border border-amber-500/30">Async Worker Queue</span>
          <ArrowRight className="w-4 h-4 text-slate-500" />
          <span className="p-2 bg-slate-800 text-purple-300 rounded border border-purple-500/30">Gemini AI Engine</span>
          <ArrowRight className="w-4 h-4 text-slate-500" />
          <span className="p-2 bg-slate-800 text-emerald-300 rounded border border-emerald-500/30">Commerce Output</span>
        </div>
      </div>

    </div>
  );
}
