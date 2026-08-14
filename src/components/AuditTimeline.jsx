import React from 'react';
import { Clock, CheckCircle2, Layers, Database, ShieldCheck, UserCheck, FileJson } from 'lucide-react';

export default function AuditTimeline({ stagesData, recordStatus }) {
  if (!stagesData) return null;

  const intakeLatency = stagesData.intake?.latencyMs || 250;
  const enrichLatency = stagesData.enrichment?.latencyMs || 850;
  const valLatency = stagesData.validation?.latencyMs || 350;

  const events = [
    {
      time: 'T+0ms',
      title: 'Stage 1: Multi-Modal Intake & Raw Extraction Completed',
      subtitle: `Gemini extracted ${Object.keys(stagesData.intake?.data?.raw_attributes || {}).length} attributes (${intakeLatency}ms)`,
      icon: Layers,
      color: 'amber'
    },
    {
      time: `T+${intakeLatency}ms`,
      title: 'Stage 2: RAG Knowledge Base Enrichment Completed',
      subtitle: `Retrieved knowledge base patterns & inferred missing fields (${enrichLatency}ms)`,
      icon: Database,
      color: 'cyan'
    },
    {
      time: `T+${intakeLatency + enrichLatency}ms`,
      title: 'Stage 3: Engineering Consistency Validation Audit',
      subtitle: `Rules engine checked dimensions, ratings, and physical constraints (${valLatency}ms)`,
      icon: ShieldCheck,
      color: 'emerald'
    },
    {
      time: `T+${intakeLatency + enrichLatency + valLatency}ms`,
      title: 'Stage 4: Human-In-The-Loop Review & Record Governance',
      subtitle: `Status: ${recordStatus.replace('_', ' ')}`,
      icon: UserCheck,
      color: 'purple'
    }
  ];

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            Audit Trail & Traceability Timeline
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Field Provenance Audit Log
        </span>
      </div>

      <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
        {events.map((ev, i) => {
          const Icon = ev.icon;
          return (
            <div key={i} className="flex items-start space-x-3 relative z-10">
              <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-700 text-amber-400 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200">{ev.title}</h4>
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {ev.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{ev.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
