import React, { useState } from 'react';
import { Building2, Award, AlertTriangle, ShieldCheck, TrendingUp, Filter, PlusCircle, CheckCircle2 } from 'lucide-react';
import { SUPPLIER_METRICS } from '../data/demoDataset.js';

export default function SupplierIntelligence({ onToast }) {
  const [createdPolicies, setCreatedPolicies] = useState([]);

  const handleCreatePolicy = (supplier) => {
    const newPolicy = `${supplier.name}: ${supplier.policyRule || 'MANDATORY_VERIFICATION'}`;
    if (!createdPolicies.includes(newPolicy)) {
      setCreatedPolicies(prev => [...prev, newPolicy]);
      if (onToast) onToast(`Policy rule created for ${supplier.name}: ${supplier.policyRule}`, 'success');
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 font-mono text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-extrabold text-white tracking-tight">ACTIONABLE SUPPLIER INTELLIGENCE</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate vendor catalog reliability, conflict frequency, evidence quality, and trigger automated policy enforcement rules.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
          <span>Active Supplier Policies: <strong className="text-emerald-400">{createdPolicies.length} Rules Enforced</strong></span>
        </div>
      </div>

      {/* Supplier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SUPPLIER_METRICS.map(sup => (
          <div key={sup.id} className="p-5 bg-slate-950/80 rounded-xl border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
            
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

            {/* AI Recommendation & Policy Action */}
            <div className="p-3 bg-slate-900 rounded-lg border border-amber-500/30 space-y-2">
              <div className="text-amber-400 font-bold text-[10px] uppercase">AI Actionable Recommendation:</div>
              <p className="text-slate-200 text-xs">{sup.aiRecommendation}</p>
              
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">Rule: <code>{sup.policyRule}</code></span>
                <button
                  onClick={() => handleCreatePolicy(sup)}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[11px] flex items-center space-x-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Enforce Policy</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
