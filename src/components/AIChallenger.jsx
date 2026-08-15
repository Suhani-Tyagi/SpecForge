import React from 'react';
import { ShieldAlert, Cpu, ArrowRight, CheckCircle2, AlertTriangle, Scale, ShieldCheck } from 'lucide-react';

export default function AIChallenger({ candidateSpec = { field: "Voltage", extractorVal: "415 V", confidence: 98 } }) {
  const steps = [
    { title: "Extractor AI", detail: "Gemini 2.0 Flash extracted 415 V with 98% confidence", icon: Cpu, color: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10" },
    { title: "Candidate Spec", detail: "Voltage: 415 V (Normalized String)", icon: CheckCircle2, color: "text-slate-300 border-slate-700 bg-slate-900" },
    { title: "AI Challenger", detail: "ALERT: Supplier Listing contains 380 V. Discrepancy flagged.", icon: AlertTriangle, color: "text-amber-400 border-amber-500/30 bg-amber-500/10" },
    { title: "Engineering Validator", detail: "Rule EV-002: 415V verified consistent with 5HP 3-Phase motor rating.", icon: Scale, color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" },
    { title: "Source Authority", detail: "Manufacturer Datasheet PDF wins over Supplier Listing text.", icon: ShieldCheck, color: "text-emerald-300 border-emerald-400/30 bg-emerald-500/10" },
    { title: "Final Decision", detail: "415 V — VERIFIED & COMMERCE-READY", icon: CheckCircle2, color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/20" }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-extrabold text-white tracking-tight">AI CHALLENGER & REASONING PIPELINE</h3>
        </div>
        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
          Active Critique Stage
        </span>
      </div>

      <p className="text-xs text-slate-400 font-mono">
        The AI Challenger actively inspects candidates for hidden source contradictions, impossible physics bounds, and vendor unit typos.
      </p>

      {/* Conceptual Flow Diagram */}
      <div className="overflow-x-auto py-2">
        <div className="flex items-center space-x-2 min-w-[900px] font-mono text-xs">
          {steps.map((stg, idx) => {
            const Icon = stg.icon;
            return (
              <React.Fragment key={idx}>
                <div className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-1.5 shrink-0 w-36 ${stg.color}`}>
                  <div className="flex items-center space-x-1 font-bold text-[11px]">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="truncate">{stg.title}</span>
                  </div>
                  <div className="text-[10px] text-slate-300 leading-tight">{stg.detail}</div>
                </div>

                {idx < steps.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

    </div>
  );
}
