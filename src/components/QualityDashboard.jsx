import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle, Award, Activity, FileSearch, Info } from 'lucide-react';

export default function QualityDashboard({ record, attributesState = {} }) {
  if (!record) return null;

  const totalAttrs = Object.keys(attributesState).length || 1;
  const acceptedAttrs = Object.values(attributesState).filter(a => a.status === 'accepted' || a.status === 'edited').length;
  const highConfAttrs = Object.values(attributesState).filter(a => a.confidence === 'high').length;
  const nonUnknownAttrs = Object.values(attributesState).filter(a => a.value !== 'unknown' && a.value !== '').length;

  const completenessScore = Math.round((nonUnknownAttrs / totalAttrs) * 100);
  const confidenceScore = Math.round((highConfAttrs / totalAttrs) * 100);
  const humanApprovalScore = Math.round((acceptedAttrs / totalAttrs) * 100);
  
  const violations = record.validation?.rule_violations || [];
  const consistencyScore = violations.length === 0 ? 100 : Math.max(40, 100 - violations.length * 15);
  const overallQualityScore = record.validation?.quality_score || Math.round((completenessScore * 0.3) + (confidenceScore * 0.3) + (consistencyScore * 0.4));

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wide">
            AI Product Data Quality Dashboard
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Derived from Real AI & Engineering Audit
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Main Quality Score Gauge */}
        <div className="md:col-span-2 p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Overall Catalog Readiness</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className={`text-4xl font-extrabold font-mono ${
                overallQualityScore >= 85 ? 'text-emerald-400' :
                overallQualityScore >= 70 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {overallQualityScore}
              </span>
              <span className="text-sm font-mono text-slate-500">/ 100</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  overallQualityScore >= 85 ? 'bg-emerald-400' :
                  overallQualityScore >= 70 ? 'bg-amber-400' : 'bg-rose-400'
                }`}
                style={{ width: `${overallQualityScore}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 font-mono">
              {overallQualityScore >= 85 ? '✅ High quality: Commerce & PIM catalog ready.' :
               overallQualityScore >= 70 ? '⚠️ Medium quality: Review recommended before export.' :
               '🚨 Low quality: Critical rule violations require attention.'}
            </p>
          </div>
        </div>

        {/* Derived Breakdown Gauges */}
        <div className="md:col-span-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">Completeness</span>
            <span className="text-lg font-bold text-slate-200">{completenessScore}%</span>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-400 h-full" style={{ width: `${completenessScore}%` }}></div>
            </div>
            <span className="text-[9px] text-slate-500 block">{nonUnknownAttrs}/{totalAttrs} fields present</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">Confidence</span>
            <span className="text-lg font-bold text-amber-400">{confidenceScore}%</span>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full" style={{ width: `${confidenceScore}%` }}></div>
            </div>
            <span className="text-[9px] text-slate-500 block">{highConfAttrs}/{totalAttrs} high confidence</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">Consistency</span>
            <span className="text-lg font-bold text-emerald-400">{consistencyScore}%</span>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full" style={{ width: `${consistencyScore}%` }}></div>
            </div>
            <span className="text-[9px] text-slate-500 block">{violations.length} rule violations</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono space-y-1">
            <span className="text-[10px] text-slate-400 uppercase block">Human Approval</span>
            <span className="text-lg font-bold text-purple-400">{humanApprovalScore}%</span>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-400 h-full" style={{ width: `${humanApprovalScore}%` }}></div>
            </div>
            <span className="text-[9px] text-slate-500 block">{acceptedAttrs}/{totalAttrs} accepted</span>
          </div>

        </div>
      </div>

    </div>
  );
}
