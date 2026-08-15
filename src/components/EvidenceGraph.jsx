import React from 'react';
import { Network, ArrowRight, ShieldCheck, FileText, Database, CheckCircle2, Cpu, UserCheck } from 'lucide-react';

export default function EvidenceGraph({ product }) {
  const nodes = [
    { id: 'src', title: 'Supplier Source', desc: 'PDF Datasheet (pg 3)', icon: FileText, color: 'border-amber-500/40 bg-amber-500/10 text-amber-400' },
    { id: 'ext', title: 'AI Extracted', desc: 'Voltage: 415 V (Conf 98%)', icon: Cpu, color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400' },
    { id: 'rag', title: 'RAG Taxonomy', desc: 'Category 23-15-16 Matched', icon: Database, color: 'border-purple-500/40 bg-purple-500/10 text-purple-400' },
    { id: 'val', title: 'Engineering Rule', desc: 'EV-001 Nominal 415V Checked', icon: CheckCircle2, color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400' },
    { id: 'cnf', title: 'Conflict Engine', desc: 'Datasheet > Web Text (SA-02)', icon: ShieldCheck, color: 'border-amber-400/40 bg-amber-400/10 text-amber-300' },
    { id: 'hitl', title: 'HITL Approval', desc: 'Approved by Domain Expert', icon: UserCheck, color: 'border-rose-500/40 bg-rose-500/10 text-rose-400' },
    { id: 'pub', title: 'Published SKU', desc: 'PIM Ready Output Record', icon: ShieldCheck, color: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300' }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <Network className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-extrabold text-white tracking-tight">AI DECISION EVIDENCE GRAPH</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">Complete Lineage Traceability</span>
      </div>

      {/* Node Flow Diagram */}
      <div className="overflow-x-auto py-2">
        <div className="flex items-center space-x-3 min-w-[850px] font-mono text-xs">
          {nodes.map((n, idx) => {
            const Icon = n.icon;
            return (
              <React.Fragment key={n.id}>
                <div className={`p-4 rounded-xl border space-y-1.5 shrink-0 w-36 ${n.color}`}>
                  <div className="flex items-center space-x-1.5 font-bold">
                    <Icon className="w-4 h-4" />
                    <span className="text-[11px] truncate">{n.title}</span>
                  </div>
                  <div className="text-[10px] text-slate-300 leading-tight">{n.desc}</div>
                </div>

                {idx < nodes.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
        <span>Target Attribute: <strong className="text-white">Voltage (415 V)</strong></span>
        <span className="text-emerald-400 font-bold">Trace Status: VERIFIED & COMPLIANT</span>
      </div>

    </div>
  );
}
