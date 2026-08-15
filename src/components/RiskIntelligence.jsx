import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, ShieldCheck, Info } from 'lucide-react';

export default function RiskIntelligence({ product }) {
  const score = product?.riskScore ?? 18;
  const level = product?.riskLevel || (score < 25 ? 'LOW' : score < 70 ? 'MEDIUM' : 'HIGH');

  const riskFactors = [
    { name: "Specification Conflicts", weight: "High", status: product?.conflicts?.length > 0 ? "CONFLICT_PRESENT" : "OK", points: product?.conflicts?.length ? 35 : 0 },
    { name: "Missing Safety Parameters", weight: "Critical", status: product?.commerceReadiness?.blockingIssues?.some(i => i.toLowerCase().includes('missing')) ? "MISSING_FIELD" : "OK", points: 25 },
    { name: "Low Extraction Confidence", weight: "Medium", status: (product?.confidence < 0.85) ? "LOW_CONF" : "OK", points: (product?.confidence < 0.85) ? 20 : 0 },
    { name: "Engineering Bounds Violation", weight: "High", status: "OK", points: 0 },
    { name: "Supplier Reliability Penalty", weight: "Low", status: "OK", points: 0 }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-extrabold text-white tracking-tight">PRODUCT RISK INTELLIGENCE</h3>
        </div>
        <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${
          level === 'LOW' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
          level === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
        }`}>
          {level} RISK (Score {score}/100)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Risk Gauge Visual */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-950/80 rounded-xl border border-slate-800 text-center font-mono">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-800"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={level === 'LOW' ? 'text-emerald-400' : level === 'MEDIUM' ? 'text-amber-400' : 'text-rose-500'}
                strokeDasharray={`${score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-white">{score}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">/ 100 RISK</span>
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-300">
            {score < 25 ? (
              <span className="text-emerald-400 font-semibold flex items-center justify-center space-x-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Low Risk: Cleared for Catalog</span>
              </span>
            ) : (
              <span className="text-rose-400 font-semibold flex items-center justify-center space-x-1">
                <AlertTriangle className="w-4 h-4" />
                <span>High Risk: Publication Blocked</span>
              </span>
            )}
          </div>
        </div>

        {/* Risk Breakdown List */}
        <div className="md:col-span-7 space-y-3 font-mono text-xs">
          <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-2 font-bold">
            Risk Factor Penalty Breakdown:
          </div>

          {riskFactors.map((rf, idx) => (
            <div key={idx} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-slate-200 font-bold">{rf.name}</div>
                <div className="text-[10px] text-slate-500">Impact Weight: {rf.weight}</div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  rf.points > 0 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400'
                }`}>
                  +{rf.points} Risk Pts
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
