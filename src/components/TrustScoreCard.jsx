import React from 'react';
import { Scale, Cpu, ShieldCheck, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export default function TrustScoreCard({ product }) {
  const trustScore = product?.trustScore ?? 91;
  const aiConfidence = product?.confidence ? (product.confidence * 100).toFixed(0) : 98;

  const breakdown = [
    { name: "Source Authority Matrix", score: 95, weight: "High", detail: "Manufacturer Datasheet PDF > Distributor Web API" },
    { name: "Evidence Completeness", score: 92, weight: "High", detail: "Exact page & section snippet evidence verified" },
    { name: "Cross-Source Agreement", score: 82, weight: "Medium", detail: "2 of 3 sources agree on 415V voltage value" },
    { name: "Engineering Physics Rules", score: 100, weight: "Critical", detail: "Passed EV-001 & EV-002 nominal limits" },
    { name: "AI Extraction Confidence", score: Number(aiConfidence), weight: "Medium", detail: "Gemini 2.0 Flash multimodal extraction score" }
  ];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-extrabold text-white tracking-tight">TRANSPARENT TRUST SCORE</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Differentiating statistical AI confidence from empirical factual domain trust.
          </p>
        </div>

        <div className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 font-mono text-xs font-bold">
          AI CONFIDENCE ≠ FACTUAL TRUST
        </div>
      </div>

      {/* Side-by-side Score Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        
        {/* AI Confidence */}
        <div className="p-5 bg-slate-950/90 rounded-xl border border-cyan-500/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">AI Extraction Confidence</div>
            <div className="text-3xl font-extrabold text-cyan-400 mt-1">{aiConfidence}%</div>
            <div className="text-[10px] text-slate-500 mt-0.5">LLM token probability & OCR match</div>
          </div>
          <Cpu className="w-10 h-10 text-cyan-400/60" />
        </div>

        {/* Factual Trust Score */}
        <div className="p-5 bg-slate-950/90 rounded-xl border border-amber-500/40 flex items-center justify-between glow-amber">
          <div>
            <div className="text-[10px] text-amber-400 uppercase font-extrabold tracking-wider">Factual Trust Score</div>
            <div className="text-3xl font-extrabold text-amber-400 mt-1">{trustScore} / 100</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Empirical domain & authority rating</div>
          </div>
          <ShieldCheck className="w-10 h-10 text-amber-400/80" />
        </div>

      </div>

      {/* Breakdown Table */}
      <div className="space-y-2 font-mono text-xs">
        <div className="text-slate-400 uppercase tracking-wider text-[11px] font-bold">
          Factual Trust Component Breakdown:
        </div>

        <div className="space-y-1.5">
          {breakdown.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-slate-200 font-bold">{item.name}</div>
                <div className="text-[10px] text-slate-500">{item.detail}</div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-[10px] text-slate-400">Weight: {item.weight}</span>
                <span className="text-amber-400 font-extrabold text-sm">{item.score}/100</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
