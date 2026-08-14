import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, FileCheck, Layers, ArrowRight } from 'lucide-react';
import { evaluateCommerceReadiness } from '../../server/utils/conflictResolver.js';

export default function CommerceReadinessGate({ record, attributes = {}, validationResults = {} }) {
  const readiness = evaluateCommerceReadiness(record, attributes, validationResults);

  const isReady = readiness.status === 'READY_FOR_CATALOG';

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5 font-mono">
      
      {/* Header & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <FileCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100 font-sans">
              Commerce Readiness Gate Console
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Evaluates product catalog compliance against completeness, confidence, and engineering rules.
          </p>
        </div>

        <div className={`px-4 py-2 rounded-xl border flex items-center space-x-2 ${
          isReady
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
        }`}>
          {isReady ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <div>
            <span className="text-xs font-extrabold tracking-wider uppercase block">
              {isReady ? 'READY FOR CATALOG' : 'NOT READY FOR CATALOG'}
            </span>
            <span className="text-[10px] text-slate-300">
              Readiness Score: <strong>{readiness.score}/100</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Breakdown Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">Completeness</span>
          <span className="text-lg font-bold text-amber-400">{readiness.completeness}%</span>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">Confidence</span>
          <span className="text-lg font-bold text-cyan-400">{readiness.confidenceScore}%</span>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">Consistency</span>
          <span className="text-lg font-bold text-emerald-400">{readiness.consistencyScore}%</span>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">Traceability</span>
          <span className="text-lg font-bold text-purple-400">{readiness.traceabilityScore}%</span>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">Normalization</span>
          <span className="text-lg font-bold text-blue-400">{readiness.normalizationScore}%</span>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 block uppercase">Validation</span>
          <span className="text-lg font-bold text-yellow-400">{readiness.validationScore}%</span>
        </div>
      </div>

      {/* Blocking Issues Checklist */}
      {readiness.blockingIssues.length > 0 && (
        <div className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-2">
          <h4 className="text-xs font-bold text-rose-400 uppercase flex items-center space-x-1">
            <AlertCircle className="w-4 h-4" />
            <span>Catalog Blocking Issues ({readiness.blockingIssues.length}):</span>
          </h4>
          <ul className="space-y-1 text-xs text-rose-300 font-sans pl-5 list-disc">
            {readiness.blockingIssues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
