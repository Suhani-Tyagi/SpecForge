import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Cpu, Database, Award, CheckCircle2, TrendingUp, Layers, AlertTriangle, Lock, ShieldAlert, Scale, HelpCircle } from 'lucide-react';
import RawToProductTransformation from './RawToProductTransformation.jsx';
import SpecForensics from './SpecForensics.jsx';
import WhatIfSimulator from './WhatIfSimulator.jsx';
import BusinessImpactEngine from './BusinessImpactEngine.jsx';
import CategoryPluginVisualizer from './CategoryPluginVisualizer.jsx';
import TrustScoreCard from './TrustScoreCard.jsx';
import { DECISIONS_REQUIRING_ATTENTION, FORENSICS_CASE } from '../data/demoDataset.js';

export default function Overview({ onLaunchStudio, onStartJudgeMode, onRunDemo, onSelectProductForReview, onOpenForensics }) {
  const catalogHealth = {
    totalSkus: "12,840",
    ready: "11,420",
    needsReview: "1,180",
    blocked: "240"
  };

  const aiImpact = [
    { label: "Supplier Records Processed", val: "12,840", note: "Multimodal ingestion" },
    { label: "Conflicts Detected", val: "1,420", note: "Cross-source discrepancies" },
    { label: "Critical Risks Blocked", val: "84 SKUs", note: "Prevented catalog publication" },
    { label: "Manual Reviews Avoided", val: "11,340", note: "88.4% Auto-approval rate" },
    { label: "Estimated Time Saved", val: "4,250 hrs", note: "Simulated workload benchmark" }
  ];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Hero Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 relative overflow-hidden">
        
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SPECFORGE CONTROL CENTER</span>
              </span>
              <span className="text-xs font-mono text-slate-400">Enterprise AI Product Governance</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Stop bad product data <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-200">before it reaches your catalog.</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              SpecForge is an AI-powered product intelligence and governance layer that extracts, validates, challenges and proves supplier specifications before publication.
            </p>

            <div className="flex items-center space-x-2 text-xs font-mono text-amber-400/90 pt-1">
              <span>INGEST</span> → <span>UNDERSTAND</span> → <span>CHALLENGE</span> → <span>VALIDATE</span> → <span>PROVE</span> → <span>DECIDE</span> → <span>PUBLISH</span>
            </div>
          </div>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={onStartJudgeMode}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-amber-500/25 transition-all font-mono"
            >
              <Award className="w-4 h-4" />
              <span>▶ RUN WINNING DEMO</span>
            </button>

            <button
              onClick={onLaunchStudio}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl text-xs border border-slate-700 font-mono transition-all"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>OPEN INTELLIGENCE STUDIO</span>
            </button>
          </div>
        </div>

      </div>

      {/* Catalog Health & AI Impact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Catalog Health Section */}
        <div className="md:col-span-5 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-white font-extrabold text-xs uppercase tracking-wider flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>CATALOG HEALTH METRICS</span>
            </span>
            <span className="text-[10px] text-slate-500">Live Snapshot</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-bold">TOTAL SKUs</div>
              <div className="text-2xl font-extrabold text-white mt-1">{catalogHealth.totalSkus}</div>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-emerald-500/30">
              <div className="text-[10px] text-slate-500 uppercase font-bold text-emerald-400">READY</div>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">{catalogHealth.ready}</div>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-amber-500/30">
              <div className="text-[10px] text-slate-500 uppercase font-bold text-amber-400">NEEDS REVIEW</div>
              <div className="text-2xl font-extrabold text-amber-400 mt-1">{catalogHealth.needsReview}</div>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-xl border border-rose-500/30">
              <div className="text-[10px] text-slate-500 uppercase font-bold text-rose-400">BLOCKED</div>
              <div className="text-2xl font-extrabold text-rose-400 mt-1">{catalogHealth.blocked}</div>
            </div>
          </div>
        </div>

        {/* AI Impact Section */}
        <div className="md:col-span-7 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-white font-extrabold text-xs uppercase tracking-wider flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>AI GOVERNANCE IMPACT</span>
            </span>
            <span className="text-[10px] text-amber-400/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Demo benchmark
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {aiImpact.map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-center space-y-1">
                <div className="text-[9px] text-slate-500 uppercase font-bold truncate">{item.label}</div>
                <div className="text-lg font-extrabold text-white">{item.val}</div>
                <div className="text-[8px] text-slate-400 truncate">{item.note}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 🚨 DECISIONS REQUIRING ATTENTION Section */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />
            <h2 className="text-base font-extrabold text-white tracking-tight">🚨 DECISIONS REQUIRING ATTENTION</h2>
          </div>
          <span className="text-xs text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded border border-rose-500/20 font-bold">
            {DECISIONS_REQUIRING_ATTENTION.length} High-Risk Conflicts Flagged
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DECISIONS_REQUIRING_ATTENTION.map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-950/90 rounded-xl border border-slate-800 space-y-3 hover:border-amber-500/40 transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-bold">{item.sku}</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                    item.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {item.severity}
                  </span>
                </div>

                <div className="font-bold text-white text-xs leading-snug">{item.name}</div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800 text-rose-300 text-[11px]">
                  Issue: {item.issue}
                </div>
                <div className="text-[10px] text-slate-400">
                  Recommended: <strong className="text-slate-200">{item.recommendedAction}</strong>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">Risk {item.riskScore}/100</span>
                <button
                  onClick={() => {
                    if (onOpenForensics) onOpenForensics();
                    else onSelectProductForReview({ name: item.name, sku: item.sku, confidence: 0.81, riskScore: item.riskScore });
                  }}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded text-xs transition-all flex items-center space-x-1"
                >
                  <span>REVIEW CONFLICT</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Raw Data -> Product Intelligence Visualizer */}
      <RawToProductTransformation onRunDemo={onRunDemo} />

      {/* SpecForensics Module */}
      <SpecForensics forensicData={FORENSICS_CASE} />

      {/* Trust Score Card & What-If Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrustScoreCard />
        <WhatIfSimulator />
      </div>

      {/* Business Impact ROI Engine */}
      <BusinessImpactEngine />

      {/* Scalable Category Plugin Architecture Visualizer */}
      <CategoryPluginVisualizer />

    </div>
  );
}
