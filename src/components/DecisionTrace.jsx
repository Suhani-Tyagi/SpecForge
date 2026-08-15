import React from 'react';
import { Layers, ArrowDown, FileText, Cpu, Database, ShieldAlert, Scale, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export default function DecisionTrace({ product }) {
  const traceNodes = [
    { title: "INPUT DOCUMENT", detail: "ED-MTR-2026.pdf (Manufacturer Technical Datasheet)", icon: FileText, color: "text-amber-400 border-amber-500/30" },
    { title: "AI EXTRACTION", detail: "Gemini 2.0 Flash extracted Voltage: 415 V (Confidence 98%)", icon: Cpu, color: "text-cyan-400 border-cyan-500/30" },
    { title: "RAG TAXONOMY CONTEXT", detail: "Matched UNSPSC 23-15-16 (Electric Motors & Drives)", icon: Database, color: "text-purple-400 border-purple-500/30" },
    { title: "CONFLICT DETECTION", detail: "Distributor Portal text claims 380V (Discrepancy Detected)", icon: ShieldAlert, color: "text-rose-400 border-rose-500/30" },
    { title: "SOURCE AUTHORITY MATRIX", detail: "Rule SA-02: Manufacturer Datasheet (1.0) wins over Distributor API (0.6)", icon: Scale, color: "text-amber-300 border-amber-400/30" },
    { title: "ENGINEERING VALIDATION", detail: "Rule EV-002: 415V verified for 5HP 3-Phase standard configuration", icon: ShieldCheck, color: "text-emerald-400 border-emerald-500/30" },
    { title: "RISK ASSESSMENT", detail: "Risk Score: 68/100 (HIGH RISK due to unresolved source conflict)", icon: ShieldAlert, color: "text-rose-400 border-rose-500/30" },
    { title: "PUBLICATION DECISION", detail: "BLOCKED FROM CATALOG pending single-click human confirmation", icon: Lock, color: "text-rose-400 border-rose-500/30" },
    { title: "HUMAN APPROVAL", detail: "Domain Expert confirmed 415V -> Transition to COMMERCE-READY", icon: CheckCircle2, color: "text-emerald-400 border-emerald-500/40" }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-extrabold text-white tracking-tight">VISUAL DECISION TRACE</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">Complete AI Lineage Audit</span>
      </div>

      {/* Vertical Step-by-Step Decision Trace */}
      <div className="space-y-2 font-mono text-xs max-w-3xl mx-auto">
        {traceNodes.map((node, idx) => {
          const Icon = node.icon;
          return (
            <React.Fragment key={idx}>
              <div className={`p-4 bg-slate-950/90 rounded-xl border flex items-center space-x-3 ${node.color}`}>
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-extrabold text-white text-[11px] uppercase tracking-wider">{node.title}</div>
                  <div className="text-slate-300 text-xs mt-0.5">{node.detail}</div>
                </div>
              </div>

              {idx < traceNodes.length - 1 && (
                <div className="flex justify-center my-0.5">
                  <ArrowDown className="w-4 h-4 text-slate-600" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

    </div>
  );
}
