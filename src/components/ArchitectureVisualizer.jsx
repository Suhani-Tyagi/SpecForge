import React, { useState } from 'react';
import { Layers, Cpu, Database, CheckCircle2, ShieldCheck, UserCheck, Rocket, ChevronRight, FileText, Lock } from 'lucide-react';

export default function ArchitectureVisualizer() {
  const [selectedStage, setSelectedStage] = useState(0);

  const stages = [
    {
      id: "input",
      title: "1. INPUT LAYER",
      subtitle: "Multimodal Ingestion",
      icon: FileText,
      color: "text-amber-400 border-amber-500/40 bg-amber-500/10",
      description: "Ingests unstructured PDFs, supplier datasheets, product nameplates (JPEG/PNG/WEBP), raw text descriptions, and external REST URLs.",
      techDetails: [
        "Multer file security parser (10MB limit, image MIME check)",
        "SSRF guard URL validator preventing internal network scanning",
        "Base64 image buffer encoding for vision LLM processing"
      ]
    },
    {
      id: "ai",
      title: "2. AI INTELLIGENCE",
      subtitle: "Gemini 2.0 Multimodal",
      icon: Cpu,
      color: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10",
      description: "Uses Google Gemini 2.0 Flash to extract high-precision technical specifications, numerical ranges, electrical ratings, and source offsets.",
      techDetails: [
        "Structured JSON schema enforcement via Zod validation",
        "Per-field confidence calculation (0.00 to 1.00)",
        "Prompt sanitization middleware guarding against prompt injection"
      ]
    },
    {
      id: "rag",
      title: "3. KNOWLEDGE (RAG)",
      subtitle: "Domain Vector Taxonomy",
      icon: Database,
      color: "text-purple-400 border-purple-500/40 bg-purple-500/10",
      description: "Enriches extracted data against UNSPSC industrial taxonomy, reference product benchmarks, and domain consistency rules.",
      techDetails: [
        "Pre-loaded knowledge base of 20 categories & 12 reference SKUs",
        "Category schema enforcement (Required, Recommended, Optional)",
        "Vector-style schema matching eliminating generic hallucinations"
      ]
    },
    {
      id: "val",
      title: "4. VALIDATION ENGINE",
      subtitle: "Unit & Engineering Physics",
      icon: CheckCircle2,
      color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
      description: "Deterministic unit normalizer and engineering physics validator checks electrical, mechanical, and fluid properties.",
      techDetails: [
        "Deterministic unit normalizer (HP -> kW, PSI -> bar, r/min -> RPM)",
        "Engineering physics rules (EV-001 power matching, slip speeds)",
        "Zero-tolerance bounds checking for critical industrial attributes"
      ]
    },
    {
      id: "gov",
      title: "5. GOVERNANCE LAYER",
      subtitle: "Source Discrepancy Matrix",
      icon: ShieldCheck,
      color: "text-amber-300 border-amber-400/40 bg-amber-400/10",
      description: "Resolves conflicting values across multiple supplier sources using hierarchical authority rules.",
      techDetails: [
        "Source Authority Matrix (Datasheet PDF > Supplier Text > AI Inference)",
        "Conflict Resolver engine assigning per-attribute authority weights",
        "Automated resolution of 80%+ cross-source discrepancies"
      ]
    },
    {
      id: "hitl",
      title: "6. HUMAN CONTROL",
      subtitle: "Exception Review Queue",
      icon: UserCheck,
      color: "text-rose-400 border-rose-500/40 bg-rose-500/10",
      description: "Routes low-confidence, high-risk, or conflicting records to domain experts for one-click human approval or editing.",
      techDetails: [
        "Keyboard shortcut review UI (A = Approve, E = Edit, R = Reject)",
        "Side-by-side data diff view comparing original vs normalized",
        "Evidence drawer detailing source text page & confidence trace"
      ]
    },
    {
      id: "out",
      title: "7. COMMERCE OUTPUT",
      subtitle: "PIM & API Integration",
      icon: Rocket,
      color: "text-emerald-300 border-emerald-400/40 bg-emerald-400/10",
      description: "Delivers commerce-ready, validated product records to PIM systems, enterprise eCommerce, CSV, JSON, and audit reports.",
      techDetails: [
        "Commerce Readiness Gatekeeper blocking invalid publication",
        "Structured PIM payload export format",
        "Cryptographic audit log tracing every modification step"
      ]
    }
  ];

  const stage = stages[selectedStage];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-extrabold text-white tracking-tight">SYSTEM ARCHITECTURE VISUALIZATION</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any processing stage to inspect the technical implementation and security protections.
          </p>
        </div>

        <span className="text-xs font-mono text-cyan-400 px-3 py-1 bg-slate-900 rounded-xl border border-slate-800">
          Clickable 7-Stage Pipeline
        </span>
      </div>

      {/* Pipeline Stages Flow Diagram */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {stages.map((stg, idx) => {
          const Icon = stg.icon;
          const isSelected = selectedStage === idx;

          return (
            <button
              key={stg.id}
              onClick={() => setSelectedStage(idx)}
              className={`p-3 rounded-xl border flex flex-col items-center text-center space-y-2 font-mono transition-all ${
                isSelected
                  ? `${stg.color} ring-2 ring-amber-400 shadow-lg scale-105`
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <div>
                <div className="text-[11px] font-bold tracking-tight">{stg.title}</div>
                <div className="text-[9px] opacity-80 mt-0.5">{stg.subtitle}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Detail Panel */}
      <div className="p-6 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="text-amber-400 font-extrabold text-sm">{stage.title}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300 font-semibold">{stage.subtitle}</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 bg-slate-900 text-slate-400 rounded border border-slate-800">
            Stage {selectedStage + 1} of 7
          </span>
        </div>

        <p className="text-slate-200 text-sm leading-relaxed">{stage.description}</p>

        <div className="space-y-2 pt-2">
          <div className="text-amber-400 font-bold uppercase text-[10px] tracking-wider">
            Technical Implementation Details:
          </div>
          <div className="space-y-1.5">
            {stage.techDetails.map((detail, idx) => (
              <div key={idx} className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800 text-slate-300 flex items-center space-x-2">
                <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
