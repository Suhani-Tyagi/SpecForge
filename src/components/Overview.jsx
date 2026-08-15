import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Cpu, Database, Award, CheckCircle2, TrendingUp, Layers, Rocket, Lock } from 'lucide-react';
import RawToProductTransformation from './RawToProductTransformation.jsx';
import ScaleSimulator from './ScaleSimulator.jsx';
import ArchitectureVisualizer from './ArchitectureVisualizer.jsx';

export default function Overview({ onLaunchStudio, onStartJudgeMode, onRunDemo, onSelectProductForReview }) {
  const kpis = [
    { label: "Products Processed", val: "12,840", note: "SKUs ingested" },
    { label: "Catalog Readiness", val: "94.2%", note: "Commerce ready" },
    { label: "Automation Rate", val: "88.4%", note: "Zero manual intervention" },
    { label: "Records Blocked", val: "2.1%", note: "Critical safety violations" },
    { label: "Average Confidence", val: "92.8%", note: "Per attribute mean" },
    { label: "Conflicts Resolved", val: "1,420", note: "Source authority rules" },
    { label: "Processing Time", val: "1.4s", note: "Mean latency per SKU" },
    { label: "Review Reduction", val: "85%", note: "Manual effort saved" }
  ];

  return (
    <div className="space-y-8">
      
      {/* Top Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 relative overflow-hidden">
        
        {/* Subtle background gradient glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>AI SYSTEM ONLINE</span>
              </span>
              <span className="text-xs font-mono text-slate-400">SpecForge v1.2 Enterprise</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Turn messy supplier data into <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-200">trusted product intelligence.</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Transform PDFs, images, supplier text, URLs and structured data into validated, traceable, commerce-ready product records using multimodal AI, RAG enrichment, engineering rules, and human governance.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={onStartJudgeMode}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-amber-500/25 transition-all font-mono"
            >
              <Award className="w-4 h-4" />
              <span>JUDGE MODE (3-Min Demo)</span>
            </button>

            <div className="flex space-x-2">
              <button
                onClick={onLaunchStudio}
                className="flex-1 flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl text-xs border border-slate-700 font-mono transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Launch Studio</span>
              </button>

              <button
                onClick={onRunDemo}
                className="flex-1 flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs border border-slate-800 font-mono transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Run Demo</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Visual Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-start space-x-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-extrabold text-xs font-mono">AI-POWERED</div>
              <div className="text-xs text-slate-400 mt-0.5">Multimodal Gemini 2.0 extraction + domain RAG taxonomy enrichment.</div>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-start space-x-3">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-extrabold text-xs font-mono">EXPLAINABLE</div>
              <div className="text-xs text-slate-400 mt-0.5">Every value carries explicit evidence, source offsets, and confidence scoring.</div>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800 flex items-start space-x-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-extrabold text-xs font-mono">COMMERCE-READY</div>
              <div className="text-xs text-slate-400 mt-0.5">Engineering physics validated before catalog publication gating.</div>
            </div>
          </div>
        </div>

      </div>

      {/* Business KPIs Section */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-extrabold text-white tracking-tight">EXECUTIVE PRODUCT METRICS</h2>
          </div>
          <span className="text-[11px] font-mono text-amber-400/80 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
            Demo / illustrative metrics
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-mono text-xs">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center space-y-1 hover:border-slate-700 transition-all">
              <div className="text-[10px] text-slate-500 uppercase font-bold truncate">{kpi.label}</div>
              <div className="text-lg font-extrabold text-white tracking-tight">{kpi.val}</div>
              <div className="text-[9px] text-slate-400 truncate">{kpi.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Business Impact Workflow Comparison */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-base font-extrabold text-white tracking-tight">BUSINESS IMPACT: WORKFLOW TRANSFORMATION</h2>
          <p className="text-xs text-slate-400">Comparing traditional manual spreadsheet operations vs SpecForge AI governance layer.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          
          {/* Before */}
          <div className="p-5 bg-rose-500/5 rounded-2xl border border-rose-500/20 space-y-3">
            <div className="text-rose-400 font-extrabold text-xs uppercase tracking-wider flex items-center justify-between border-b border-rose-500/20 pb-2">
              <span>BEFORE SPECFORGE</span>
              <span className="text-[10px] bg-rose-500/10 px-2 py-0.5 rounded">Manual & Error-Prone</span>
            </div>
            <div className="space-y-2 text-slate-300">
              <div className="p-2.5 bg-slate-950/80 rounded border border-rose-500/20">Messy Supplier Data (PDFs, Emails)</div>
              <div className="text-center text-rose-400 font-bold">↓ Manual Copy-Paste Extraction</div>
              <div className="p-2.5 bg-slate-950/80 rounded border border-rose-500/20">Spreadsheet Cleanup & Unit Formatting</div>
              <div className="text-center text-rose-400 font-bold">↓ Manual Spec Verification</div>
              <div className="p-2.5 bg-slate-950/80 rounded border border-rose-500/20">PIM Entry & Unverified Publication</div>
            </div>
            <div className="text-[11px] text-rose-300/80 pt-1">
              Result: 3-5 days per SKU batch; 12% error rate in buyer catalog.
            </div>
          </div>

          {/* With SpecForge */}
          <div className="p-5 bg-emerald-500/5 rounded-2xl border border-emerald-500/20 space-y-3">
            <div className="text-emerald-400 font-extrabold text-xs uppercase tracking-wider flex items-center justify-between border-b border-emerald-500/20 pb-2">
              <span>WITH SPECFORGE</span>
              <span className="text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded">Automated & Governed</span>
            </div>
            <div className="space-y-2 text-slate-300">
              <div className="p-2.5 bg-slate-950/80 rounded border border-emerald-500/20">Multimodal AI Extraction (Gemini 2.0)</div>
              <div className="text-center text-emerald-400 font-bold">↓ RAG & Unit Physics Validation</div>
              <div className="p-2.5 bg-slate-950/80 rounded border border-emerald-500/20">Source Authority Conflict Resolution</div>
              <div className="text-center text-emerald-400 font-bold">↓ Exception-Driven HITL Review</div>
              <div className="p-2.5 bg-slate-950/80 rounded border border-emerald-500/20">Commerce-Ready Trusted Catalog</div>
            </div>
            <div className="text-[11px] text-emerald-300/80 pt-1">
              Result: 1.4s per SKU; 85% review workload reduction; 100% data integrity.
            </div>
          </div>

        </div>
      </div>

      {/* Raw Data -> Product Intelligence Visualizer */}
      <RawToProductTransformation onRunDemo={onRunDemo} />

      {/* Scalable Architecture Overview */}
      <ArchitectureVisualizer />

      {/* Scale Simulator */}
      <ScaleSimulator />

    </div>
  );
}
