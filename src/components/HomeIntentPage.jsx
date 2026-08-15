import React from 'react';
import { Upload, AlertTriangle, Building2, ShieldCheck, Database, ArrowRight, Zap, CheckCircle2, FileText, Activity } from 'lucide-react';
import ExplainTooltip from './ExplainTooltip.jsx';

export default function HomeIntentPage({
  onStartProcessData,
  onReviewIssues,
  onCheckSuppliers,
  onViewCatalog,
  onManageKnowledge
}) {
  return (
    <div className="space-y-8 font-sans">
      
      {/* Welcome Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>SYSTEM READY</span>
              </span>
              <span className="text-xs font-mono text-slate-400">SpecForge AI v2.0 Enterprise</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              SPECForge — <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-200">AI Product Intelligence & Governance</span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Turn messy supplier information into trusted, commerce-ready product data. SpecForge extracts, validates, challenges and explains product specifications before publication.
            </p>

            <div className="flex items-center space-x-2 text-xs font-mono text-amber-400/90 pt-1">
              <span>INGEST</span> → <span>EXTRACT</span> → <span>NORMALIZE</span> → <span>VALIDATE</span> → <span>CHALLENGE</span> → <span>RESOLVE</span> → <span>REVIEW</span> → <span>PUBLISH</span>
            </div>
          </div>

          <div className="shrink-0 flex items-center space-x-3 font-mono text-xs bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div className="space-y-1 text-center">
              <div className="text-[10px] text-slate-500 uppercase">Catalog Readiness</div>
              <div className="text-xl font-extrabold text-emerald-400">94.2%</div>
              <div className="text-[10px] text-slate-400">11,420 SKUs Ready</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: WHAT DO YOU WANT TO DO? */}
      <div className="space-y-4">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-white tracking-tight font-mono uppercase">
            WHAT DO YOU WANT TO DO?
          </h2>
          <span className="text-xs text-slate-400 font-mono">Select a task to get started</span>
        </div>

        {/* 5 Large Intent Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: PRIMARY - Process Product Data */}
          <div
            onClick={onStartProcessData}
            className="p-6 bg-slate-950/90 rounded-2xl border-2 border-amber-500/60 hover:border-amber-400 cursor-pointer shadow-xl transition-all hover:scale-[1.01] space-y-4 flex flex-col justify-between group glow-amber"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 bg-amber-500 text-slate-950 font-extrabold rounded-full uppercase">
                  PRIMARY ACTION
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                Process Product Data
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                Upload a PDF, spreadsheet, image or paste a URL and let SpecForge extract and validate the product information automatically.
              </p>
            </div>

            <button className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs font-mono flex items-center justify-center space-x-2 shadow-md">
              <span>Process Product Data</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Review Issues */}
          <div
            onClick={onReviewIssues}
            className="p-6 bg-slate-950/90 rounded-2xl border border-slate-800 hover:border-rose-500/50 cursor-pointer shadow-lg transition-all hover:scale-[1.01] space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-rose-500/20 text-rose-300 font-bold rounded">
                  3 Issues Flagged
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-rose-300 transition-colors">
                Review Issues
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                See products with specification conflicts, missing required information or high-risk safety data requiring human review.
              </p>
            </div>

            <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl text-xs font-mono flex items-center justify-center space-x-2 border border-slate-700">
              <span>Review Issues</span>
              <ArrowRight className="w-4 h-4 text-rose-400" />
            </button>
          </div>

          {/* Card 3: Check Suppliers */}
          <div
            onClick={onCheckSuppliers}
            className="p-6 bg-slate-950/90 rounded-2xl border border-slate-800 hover:border-cyan-500/50 cursor-pointer shadow-lg transition-all hover:scale-[1.01] space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-500/10 text-cyan-300 font-bold rounded">
                  4 Suppliers Scored
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                Check Suppliers
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                See which suppliers provide reliable product specifications and which vendors trigger high conflict rates.
              </p>
            </div>

            <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl text-xs font-mono flex items-center justify-center space-x-2 border border-slate-700">
              <span>Check Suppliers</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          {/* Card 4: View Catalog Health */}
          <div
            onClick={onViewCatalog}
            className="p-6 bg-slate-950/90 rounded-2xl border border-slate-800 hover:border-emerald-500/50 cursor-pointer shadow-lg transition-all hover:scale-[1.01] space-y-4 flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-300 font-bold rounded">
                  12,840 Total SKUs
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                View Catalog Health
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                Inspect how many products are ready to publish, need review or are blocked by safety validation rules.
              </p>
            </div>

            <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl text-xs font-mono flex items-center justify-center space-x-2 border border-slate-700">
              <span>View Catalog</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

          {/* Card 5: Manage Knowledge & Rules */}
          <div
            onClick={onManageKnowledge}
            className="p-6 bg-slate-950/90 rounded-2xl border border-slate-800 hover:border-purple-500/50 cursor-pointer shadow-lg transition-all hover:scale-[1.01] space-y-4 flex flex-col justify-between group md:col-span-2 lg:col-span-1"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                  <Database className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-purple-500/10 text-purple-300 font-bold rounded">
                  20 Categories
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                Manage Knowledge & Rules
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed">
                Configure product categories, expected attribute schemas, physics validation rules and trusted reference standards.
              </p>
            </div>

            <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-xl text-xs font-mono flex items-center justify-center space-x-2 border border-slate-700">
              <span>Manage Knowledge</span>
              <ArrowRight className="w-4 h-4 text-purple-400" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
