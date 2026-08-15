import React, { useState } from 'react';
import { ArrowRight, Sparkles, CheckCircle2, AlertCircle, FileText, Cpu, ShieldCheck, Zap, RefreshCw } from 'lucide-react';

export default function RawToProductTransformation({ product, onRunDemo }) {
  const [isTransforming, setIsTransforming] = useState(false);

  const sampleRaw = product?.rawInput || "Industrial motor, 5 HP, 415V, 3 phase, 1440 RPM, IP55 protection class, IE3 efficiency, Cast Iron frame 112M.";
  const sampleAttrs = product?.attributes || {
    power: { value: "3.7 kW (5 HP)", confidence: 0.99, source: "Supplier PDF (pg 2)", status: "VERIFIED", normalized: "3.7 kW" },
    voltage: { value: "415 V", confidence: 0.98, source: "Supplier Spec Sheet", status: "VERIFIED", normalized: "415 V" },
    phase: { value: "3 Phase", confidence: 0.99, source: "Supplier PDF", status: "VERIFIED", normalized: "3 Phase" },
    speed: { value: "1440 RPM", confidence: 0.96, source: "Supplier PDF", status: "VERIFIED", normalized: "1440 RPM" },
    protectionClass: { value: "IP55", confidence: 0.97, source: "Nameplate Image", status: "VERIFIED", normalized: "IP55" },
    efficiencyClass: { value: "IE3 Premium", confidence: 0.95, source: "Product Catalog", status: "VERIFIED", normalized: "IE3" },
    frameMaterial: { value: "Cast Iron", confidence: 0.94, source: "Supplier PDF", status: "VERIFIED", normalized: "Cast Iron" }
  };

  const handleAnimate = () => {
    setIsTransforming(true);
    setTimeout(() => {
      setIsTransforming(false);
      if (onRunDemo) onRunDemo();
    }, 1200);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-extrabold text-white tracking-tight">RAW DATA → PRODUCT INTELLIGENCE</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Watch SpecForge convert fragmented supplier strings into normalized, evidence-backed product specs.
          </p>
        </div>

        <button
          onClick={handleAnimate}
          disabled={isTransforming}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-500/20 transition-all shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isTransforming ? 'animate-spin' : ''}`} />
          <span>{isTransforming ? 'Transforming...' : 'Animate Transformation'}</span>
        </button>
      </div>

      {/* Grid: Left Raw -> Right Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Raw Supplier Input */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 bg-slate-950/80 rounded-xl border border-slate-800/80 font-mono text-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-2">
              <span className="flex items-center space-x-1.5 font-bold text-rose-400">
                <FileText className="w-4 h-4" />
                <span>RAW SUPPLIER INPUT</span>
              </span>
              <span className="text-[10px] bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded border border-rose-500/20">
                Unstructured / Messy
              </span>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-lg text-slate-300 leading-relaxed border border-slate-800">
              "{sampleRaw}"
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-400 pt-2">
              <div className="flex items-center space-x-2 text-rose-300/80">
                <span>• Missing standard taxonomy IDs</span>
              </div>
              <div className="flex items-center space-x-2 text-rose-300/80">
                <span>• Unnormalized units (5 HP instead of kW)</span>
              </div>
              <div className="flex items-center space-x-2 text-rose-300/80">
                <span>• No confidence or source authority traceability</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Source: Supplier Intake</span>
            <span>Format: Text / PDF</span>
          </div>
        </div>

        {/* Center Indicator */}
        <div className="hidden lg:flex lg:col-span-1 items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-slate-900 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <ArrowRight className={`w-5 h-5 text-amber-400 ${isTransforming ? 'animate-bounce' : ''}`} />
          </div>
        </div>

        {/* Right Side: SPECForge Structured Record */}
        <div className="lg:col-span-6 p-5 bg-slate-950/90 rounded-xl border border-emerald-500/30 font-mono text-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="flex items-center space-x-1.5 font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>SPECFORGE STRUCTURED RECORD</span>
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
              VERIFIED & NORMALIZED
            </span>
          </div>

          {/* Attributes List */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {Object.entries(sampleAttrs).map(([key, attr]) => (
              <div key={key} className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-all">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 font-semibold uppercase text-[10px]">{key}:</span>
                    <span className="text-white font-bold">{attr.value}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Source: {attr.source} | Normalized: <strong className="text-amber-300">{attr.normalized}</strong>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    attr.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {(attr.confidence * 100).toFixed(0)}% Conf
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">RAG Category: <strong className="text-slate-200">Electric Motors (23-15-16)</strong></span>
            <span className="text-emerald-400 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Catalog Ready</span>
            </span>
          </div>
        </div>

      </div>

    </div>
  );
}
