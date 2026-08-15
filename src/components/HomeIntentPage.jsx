import React from 'react';
import { Upload, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2, Zap, FileText, Layers, RefreshCw } from 'lucide-react';

export default function HomeIntentPage({
  onStartProcessData,
  onTrySampleProduct,
  onReviewIssues,
  onCheckSuppliers,
  onViewCatalog,
  onManageKnowledge
}) {
  return (
    <div className="space-y-12 font-sans text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* FIRST VIEWPORT (1440x900): Brand, Value Prop, Pipeline & CTAs */}
      <section className="glass-panel p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-8 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-28 -right-28 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header Badge & Navigation Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center space-x-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>SPECFORGE CORE PIPELINE ENGINE</span>
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">v2.0 Enterprise Release</span>
          </div>

          <span className="text-xs text-slate-400 font-mono bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
            Catalog Readiness: <strong className="text-emerald-400 font-bold">94.2%</strong>
          </span>
        </div>

        {/* Headline & Core Positioning */}
        <div className="space-y-3 max-w-4xl">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Stop bad product data <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-200">before it reaches your catalog.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            SpecForge turns fragmented supplier information into evidence-backed, validated and publication-ready product data.
          </p>
        </div>

        {/* Core Proposition Pipeline Visual */}
        <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800/80 font-mono text-xs overflow-x-auto">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 font-bold">
            SPECFORGE DECISION LINEAGE ENGINE:
          </div>
          <div className="flex items-center space-x-2 text-slate-300 min-w-[700px]">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-amber-400 font-bold">INGEST</span> →
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-bold">EXTRACT</span> →
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-purple-400 font-bold">NORMALIZE</span> →
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-amber-300 font-bold">CHALLENGE</span> →
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-emerald-400 font-bold">VALIDATE</span> →
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-bold">PROVE</span> →
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-amber-400 font-bold">DECIDE</span> →
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">PUBLISH</span>
          </div>
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
          <button
            onClick={onStartProcessData}
            className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-2xl text-sm flex items-center justify-center space-x-2 shadow-xl shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 font-sans"
          >
            <Upload className="w-5 h-5" />
            <span>PROCESS PRODUCT DATA</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </button>

          <button
            onClick={onTrySampleProduct}
            className="px-6 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold rounded-2xl text-sm border border-slate-700 flex items-center justify-center space-x-2 transition-all font-sans"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>TRY WITH SAMPLE PRODUCT (MTR-204)</span>
          </button>
        </div>
      </section>

      {/* BELOW THE FOLD: SHOW THE PROBLEM VISUALLY */}
      <section className="space-y-6">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">THE PROBLEM VISUALLY</h2>
            <p className="text-sm text-slate-400 mt-0.5">Industrial supply chains present contradictory specs across datasheets, web portals, and images.</p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 font-bold hidden sm:inline">
            Real Industrial Conflict Scenario
          </span>
        </div>

        {/* Fragmented Data Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
          
          <div className="p-5 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white text-xs">Source A: Manufacturer Datasheet PDF</span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">Authority 1.0</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1 font-mono text-[11px]">
              <div className="text-slate-400">Power: <strong className="text-white">5 HP (3.7 kW)</strong></div>
              <div className="text-slate-400">Nominal Voltage: <strong className="text-emerald-400 font-extrabold">415 V</strong></div>
              <div className="text-slate-400">Speed: <strong className="text-white">1440 RPM</strong></div>
              <div className="text-slate-400">Enclosure: <strong className="text-white">IP55</strong></div>
            </div>
            <p className="text-[11px] text-slate-400">Extracted from page 3, section 2.1 (Electrical Specifications).</p>
          </div>

          <div className="p-5 bg-slate-950/90 rounded-2xl border border-rose-500/40 space-y-3 glow-rose">
            <div className="flex items-center justify-between border-b border-rose-500/30 pb-2">
              <span className="font-bold text-rose-300 text-xs">Source B: Supplier Web Portal API</span>
              <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded">Authority 0.6</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-rose-500/30 space-y-1 font-mono text-[11px]">
              <div className="text-slate-400">Power: <strong className="text-white">5 HP</strong></div>
              <div className="text-slate-400">Nominal Voltage: <strong className="text-rose-400 font-extrabold">380 V (DISCREPANCY!)</strong></div>
              <div className="text-slate-400">Speed: <strong className="text-white">1450 RPM</strong></div>
              <div className="text-slate-400">Enclosure: <strong className="text-white">IP54</strong></div>
            </div>
            <p className="text-[11px] text-rose-300 font-medium">ALERT: Supplier API claims 380V, contradicting 415V datasheet.</p>
          </div>

          <div className="p-5 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white text-xs">Source C: Physical Nameplate Image</span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded">Authority 0.9</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1 font-mono text-[11px]">
              <div className="text-slate-400">Power: <strong className="text-white">3.7 kW</strong></div>
              <div className="text-slate-400">Nominal Voltage: <strong className="text-emerald-400 font-extrabold">415 V (Confirms Datasheet)</strong></div>
              <div className="text-slate-400">Speed: <strong className="text-white">1440 RPM</strong></div>
              <div className="text-slate-400">Enclosure: <strong className="text-white">IP55</strong></div>
            </div>
            <p className="text-[11px] text-slate-400">OCR text extracted from stamped motor rating plate.</p>
          </div>

        </div>

        {/* Without SpecForge vs With SpecForge Comparative Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 font-sans text-xs">
          
          {/* WITHOUT SPECFORGE */}
          <div className="p-6 bg-rose-500/5 rounded-3xl border border-rose-500/30 space-y-4">
            <div className="font-extrabold text-rose-400 text-sm uppercase tracking-wider font-mono flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>WITHOUT SPECFORGE</span>
            </div>
            <div className="space-y-2 text-slate-300 font-mono text-[11px]">
              <div className="p-3 bg-slate-950 rounded-xl border border-rose-500/20">1. Fragmented & contradictory supplier text</div>
              <div className="p-3 bg-slate-950 rounded-xl border border-rose-500/20">2. Manual spreadsheet review (3 days per 100 SKUs)</div>
              <div className="p-3 bg-slate-950 rounded-xl border border-rose-500/20">3. Undetected 380V vs 415V voltage catalog error</div>
              <div className="p-3 bg-slate-950 rounded-xl border border-rose-500/20 text-rose-400 font-bold">4. High return rate & industrial equipment damage risk</div>
            </div>
          </div>

          {/* WITH SPECFORGE */}
          <div className="p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/40 space-y-4 glow-amber">
            <div className="font-extrabold text-emerald-400 text-sm uppercase tracking-wider font-mono flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4" />
              <span>WITH SPECFORGE</span>
            </div>
            <div className="space-y-2 text-slate-300 font-mono text-[11px]">
              <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/20">1. Multimodal AI extracts all 3 sources in 1.4s</div>
              <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/20">2. AI Challenger flags 380V discrepancy</div>
              <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/20">3. Engineering EV-002 rule & Source Authority SA-02 validate 415V</div>
              <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/20 text-emerald-400 font-bold">4. Single-click human approval → 100% Trusted Catalog Export</div>
            </div>
          </div>

        </div>
      </section>

      {/* BUILT TO SCALE BEYOND ONE CATEGORY */}
      <section className="p-6 sm:p-8 bg-slate-950/80 rounded-3xl border border-slate-800 space-y-4 font-sans">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-lg font-extrabold text-white tracking-tight">Built to Scale Beyond One Category</h3>
            <p className="text-xs text-slate-400 mt-0.5">Category-specific schemas and validation rules plug directly into the SpecForge AI pipeline.</p>
          </div>
          <button
            onClick={onManageKnowledge}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 font-mono"
          >
            Configure Rules
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
          <div className="p-3 bg-slate-900 rounded-xl border border-amber-500/40 text-center space-y-1">
            <div className="text-amber-400 font-bold text-xs">Industrial Motors</div>
            <div className="text-[10px] text-slate-400">ACTIVE SCHEMA</div>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center space-y-1">
            <div className="text-white font-bold text-xs">Submersible Pumps</div>
            <div className="text-[10px] text-slate-400">READY</div>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center space-y-1">
            <div className="text-white font-bold text-xs">HVAC Systems</div>
            <div className="text-[10px] text-slate-400">READY</div>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center space-y-1">
            <div className="text-white font-bold text-xs">Valves & Actuators</div>
            <div className="text-[10px] text-slate-400">READY</div>
          </div>

          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-center space-y-1">
            <div className="text-white font-bold text-xs">Electrical Equipment</div>
            <div className="text-[10px] text-slate-400">READY</div>
          </div>
        </div>
      </section>

    </div>
  );
}
