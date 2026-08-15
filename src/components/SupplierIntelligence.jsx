import React from 'react';
import { Building2, Award, AlertTriangle, ShieldCheck, TrendingUp, Filter } from 'lucide-react';
import { SUPPLIER_METRICS } from '../data/demoDataset.js';

export default function SupplierIntelligence() {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-extrabold text-white tracking-tight">SUPPLIER QUALITY INTELLIGENCE</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate vendor catalog reliability, conflict frequency, data completeness, and manual review burden.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
          <span>Tracked Suppliers: <strong className="text-amber-400">4 Tier-1 Vendors</strong></span>
        </div>
      </div>

      {/* Supplier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SUPPLIER_METRICS.map(sup => (
          <div key={sup.id} className="p-5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-4 font-mono hover:border-slate-700 transition-all">
            
            {/* Top row */}
            <div className="flex items-start justify-between">
              <div>
                <div className="text-white font-bold text-sm flex items-center space-x-2">
                  <span>{sup.name}</span>
                  <span className="text-[10px] text-slate-500">({sup.id})</span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{sup.category}</div>
              </div>

              <div className="text-right">
                <span className={`px-2.5 py-1 rounded text-xs font-extrabold border ${
                  sup.qualityScore >= 90 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  sup.qualityScore >= 75 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  Quality Score {sup.qualityScore}%
                </span>
                <div className="text-[10px] text-slate-500 mt-1">{sup.reliabilityIndex}</div>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-800/80">
              <div className="p-2 bg-slate-900/90 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Completeness</div>
                <div className="font-bold text-slate-200 mt-0.5">{sup.completeness}%</div>
              </div>
              <div className="p-2 bg-slate-900/90 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Conflict Rate</div>
                <div className={`font-bold mt-0.5 ${sup.conflictRate <= 5 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {sup.conflictRate}%
                </div>
              </div>
              <div className="p-2 bg-slate-900/90 rounded border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase">Review Burden</div>
                <div className="font-bold text-amber-400 mt-0.5">{sup.reviewBurden}</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Catalog SKUs: <strong className="text-slate-200">{sup.productCount} SKUs</strong></span>
              <span>Traceability: <strong className="text-emerald-400">{sup.traceability}%</strong></span>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
