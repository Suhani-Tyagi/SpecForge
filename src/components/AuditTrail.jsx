import React from 'react';
import { History, Download, ShieldCheck, CheckCircle2, Cpu, UserCheck, AlertTriangle, Filter } from 'lucide-react';

export default function AuditTrail({ onToast }) {
  const auditLogs = [
    { timestamp: "2026-08-15 14:20:12", event: "INGESTION_COMPLETE", actor: "System Intake", details: "PDF Technical Datasheet parsed (ED-MTR-2026.pdf). Hash: sha256:e3b0c442", status: "SUCCESS" },
    { timestamp: "2026-08-15 14:20:13", event: "AI_EXTRACTION", actor: "Gemini 2.0 Flash", details: "Extracted 8 attributes with 98% mean confidence", status: "SUCCESS" },
    { timestamp: "2026-08-15 14:20:14", event: "UNIT_NORMALIZATION", actor: "UnitNormalizer", details: "Converted 5 HP -> 3.7 kW (ISO Standard SI Unit)", status: "SUCCESS" },
    { timestamp: "2026-08-15 14:20:14", event: "RAG_TAXONOMY_CHECK", actor: "KnowledgeBase", details: "Matched UNSPSC Category 23-15-16. Nominal voltage verified.", status: "SUCCESS" },
    { timestamp: "2026-08-15 14:20:15", event: "ENGINEERING_VALIDATION", actor: "Rule Engine", details: "Rule EV-001 passed (Power to kW ratio 1.0)", status: "SUCCESS" },
    { timestamp: "2026-08-15 15:45:01", event: "CONFLICT_DETECTED", actor: "ConflictResolver", details: "Voltage discrepancy detected: Datasheet (415V) vs Web API (380V)", status: "FLAGGED" },
    { timestamp: "2026-08-15 15:45:02", event: "SOURCE_AUTHORITY_APPLIED", actor: "ConflictResolver", details: "Datasheet preferred (Rule SA-02). Selected 415V.", status: "RESOLVED_AUTO" },
    { timestamp: "2026-08-15 15:46:10", event: "HITL_HUMAN_REVIEW", actor: "Domain Specialist (User)", details: "Confirmed 415V resolution via HITL Review UI", status: "HUMAN_APPROVED" },
    { timestamp: "2026-08-15 15:46:11", event: "CATALOG_PUBLICATION", actor: "CommerceGatekeeper", details: "Record transition -> COMMERCE-READY. Exported PIM payload.", status: "SUCCESS" }
  ];

  const handleExportAudit = () => {
    const reportStr = JSON.stringify(auditLogs, null, 2);
    const blob = new Blob([reportStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SpecForge_Audit_Report_${Date.now()}.json`;
    a.click();
    if (onToast) onToast("Audit report downloaded successfully!", "success");
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-extrabold text-white tracking-tight">AUDIT TRAIL & DATA LINEAGE</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable chronological log tracing AI extractions, RAG enrichment, engineering rules, and human approvals.
          </p>
        </div>

        <button
          onClick={handleExportAudit}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 transition-all shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>Export Audit Report</span>
        </button>
      </div>

      {/* Audit Log Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] bg-slate-900/50">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Event Type</th>
              <th className="py-3 px-4">Actor / Engine</th>
              <th className="py-3 px-4">Transformation Details</th>
              <th className="py-3 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {auditLogs.map((log, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 transition-all">
                <td className="py-3 px-4 text-slate-400">{log.timestamp}</td>
                <td className="py-3 px-4 text-slate-200 font-bold">{log.event}</td>
                <td className="py-3 px-4 text-amber-400">{log.actor}</td>
                <td className="py-3 px-4 text-slate-300 max-w-xs truncate">{log.details}</td>
                <td className="py-3 px-4 text-right">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400' :
                    log.status === 'HUMAN_APPROVED' ? 'bg-cyan-500/10 text-cyan-400' :
                    log.status === 'FLAGGED' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
