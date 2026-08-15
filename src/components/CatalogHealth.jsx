import React from 'react';
import { ShieldCheck, AlertTriangle, Lock, Building2, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import ExplainTooltip from './ExplainTooltip.jsx';
import { SUPPLIER_METRICS } from '../data/demoDataset.js';

export default function CatalogHealth({ onSelectSupplier, onReviewIssues }) {
  const blockReasons = [
    { reason: "Conflicting Specifications", count: 1420, impact: "High Risk", detail: "Opposing voltage, power or dimension specs across sources" },
    { reason: "Missing Required Category Fields", count: 640, impact: "Medium Risk", detail: "Mandatory UNSPSC fields missing from supplier intake" },
    { reason: "Invalid Values / Physics Out of Bounds", count: 210, impact: "Critical Risk", detail: "Failed EV-001 or EV-002 engineering verification" },
    { reason: "Insufficient Evidence Coverage", count: 120, impact: "Low Risk", detail: "Lacks PDF datasheet or image snippet proof" }
  ];

  const fixFirstList = [
    { title: "Fix 415V Nominal Voltage Conflicts on Heavy-Duty Motors", skus: "380 SKUs", action: "Apply Source Authority SA-02", impact: "High Impact" },
    { title: "Enforce IP Rating Mandatory Field for Submersible Pumps", skus: "140 SKUs", action: "Trigger Category Rule EV-104", impact: "Medium Impact" },
    { title: "Normalize Bar / PSI Pressure Units on Hydraulic Valves", skus: "520 SKUs", action: "Run Automated Unit Normalizer", impact: "High Impact" }
  ];

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 font-mono">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-extrabold text-white tracking-tight uppercase">Catalog Health & Readiness</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor catalog completeness, blocked products, supplier quality rankings, and priority fixes.
          </p>
        </div>

        <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold">
          94.2% Catalog Readiness
        </span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase font-bold">Total Products</div>
          <div className="text-2xl font-extrabold text-white mt-1">12,840</div>
        </div>

        <div className="p-4 bg-slate-950/80 rounded-xl border border-emerald-500/30">
          <div className="text-[10px] text-slate-500 uppercase font-bold text-emerald-400">Ready to Publish</div>
          <div className="text-2xl font-extrabold text-emerald-400 mt-1">11,420</div>
        </div>

        <div className="p-4 bg-slate-950/80 rounded-xl border border-amber-500/30">
          <div className="text-[10px] text-slate-500 uppercase font-bold text-amber-400">Needs Review</div>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">1,180</div>
        </div>

        <div className="p-4 bg-slate-950/80 rounded-xl border border-rose-500/30">
          <div className="text-[10px] text-slate-500 uppercase font-bold text-rose-400">Blocked</div>
          <div className="text-2xl font-extrabold text-rose-400 mt-1">240</div>
        </div>
      </div>

      {/* SECTION 1: Why are products blocked? */}
      <div className="space-y-3 font-mono text-xs">
        <div className="text-slate-300 font-extrabold uppercase text-xs flex items-center space-x-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Why are products blocked?</span>
          <ExplainTooltip title="Blocked Products" text="Products are blocked from catalog export if they contain unresolved specification conflicts or fail category validation rules." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {blockReasons.map((b, idx) => (
            <div key={idx} className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white text-xs">{b.reason}</div>
                <div className="text-[10px] text-slate-400">{b.detail}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-base font-extrabold text-rose-400">{b.count} SKUs</div>
                <div className="text-[9px] text-slate-500">{b.impact}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: Which suppliers cause the most issues? */}
      <div className="space-y-3 font-mono text-xs">
        <div className="text-slate-300 font-extrabold uppercase text-xs flex items-center space-x-1.5">
          <Building2 className="w-4 h-4 text-cyan-400" />
          <span>Which suppliers cause the most issues?</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-slate-800">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-900">
                <th className="py-2.5 px-3">Supplier Name</th>
                <th className="py-2.5 px-3">Quality Score</th>
                <th className="py-2.5 px-3">Conflict Rate</th>
                <th className="py-2.5 px-3">Completeness</th>
                <th className="py-2.5 px-3">Review Burden</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {SUPPLIER_METRICS.map(sup => (
                <tr key={sup.id} className="hover:bg-slate-800/30 cursor-pointer" onClick={onSelectSupplier}>
                  <td className="py-2.5 px-3 font-bold text-white">{sup.name}</td>
                  <td className="py-2.5 px-3 font-bold text-emerald-400">{sup.qualityScore}%</td>
                  <td className="py-2.5 px-3 text-rose-400 font-bold">{sup.conflictRate}%</td>
                  <td className="py-2.5 px-3 text-slate-300">{sup.completeness}%</td>
                  <td className="py-2.5 px-3 text-amber-400">{sup.reviewBurden}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: What should we fix first? */}
      <div className="space-y-3 font-mono text-xs pt-2">
        <div className="text-slate-300 font-extrabold uppercase text-xs flex items-center space-x-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>What should we fix first? (Prioritized Recommendations)</span>
        </div>

        <div className="space-y-2">
          {fixFirstList.map((item, idx) => (
            <div key={idx} className="p-3.5 bg-slate-950/90 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="font-bold text-white text-xs">{item.title}</div>
                <div className="text-[10px] text-slate-400">Affects {item.skus} • Recommendation: {item.action}</div>
              </div>

              <button
                onClick={onReviewIssues}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1 shrink-0"
              >
                <span>Fix Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
