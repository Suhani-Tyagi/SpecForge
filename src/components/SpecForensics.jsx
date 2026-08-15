import React, { useState } from 'react';
import { ShieldAlert, FileText, CheckCircle2, AlertTriangle, Cpu, ArrowRight, ShieldCheck, HelpCircle, Eye, Scale } from 'lucide-react';
import { FORENSICS_CASE } from '../data/demoDataset.js';

export default function SpecForensics({ forensicData = FORENSICS_CASE, onSelectForReview }) {
  const [activeSource, setActiveSource] = useState('SRC-01');

  const selectedSource = forensicData.sources.find(s => s.id === activeSource) || forensicData.sources[0];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-extrabold text-white tracking-tight">SPECFORENSICS — CONFLICT INVESTIGATION</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Turn specification conflicts into transparent, evidence-backed investigations in under 10 seconds.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl font-bold">
            Target Attribute: {forensicData.targetAttribute} ({forensicData.finalDecision})
          </span>
        </div>
      </div>

      {/* Trust Score vs AI Confidence Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        <div className="p-4 bg-slate-950/90 rounded-xl border border-cyan-500/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold">AI Extraction Confidence</div>
            <div className="text-2xl font-extrabold text-cyan-400">{(forensicData.aiExtraction.confidence * 100).toFixed(0)}%</div>
            <div className="text-[10px] text-slate-500">Gemini Multimodal Vision / Text Parsing</div>
          </div>
          <Cpu className="w-8 h-8 text-cyan-400/80" />
        </div>

        <div className="p-4 bg-slate-950/90 rounded-xl border border-amber-500/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center space-x-1">
              <span>Factual Trust Score</span>
              <span className="text-[9px] text-amber-400 font-bold bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                AI CONFIDENCE ≠ FACTUAL TRUST
              </span>
            </div>
            <div className="text-2xl font-extrabold text-amber-400">91 / 100</div>
            <div className="text-[10px] text-slate-500">Authority Matrix + Physics Bounds + Multi-Source Agreement</div>
          </div>
          <Scale className="w-8 h-8 text-amber-400/80" />
        </div>
      </div>

      {/* Multi-Source Comparison Grid */}
      <div className="space-y-3 font-mono text-xs">
        <div className="text-slate-400 uppercase tracking-wider text-[11px] font-bold">
          Multi-Source Evidence Comparison:
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {forensicData.sources.map(src => {
            const isSelected = activeSource === src.id;
            const isWinner = src.claimedValue === forensicData.finalDecision;

            return (
              <div
                key={src.id}
                onClick={() => setActiveSource(src.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                  isSelected 
                    ? 'bg-slate-900 border-amber-500/60 ring-1 ring-amber-500/40 shadow-lg' 
                    : 'bg-slate-950/80 border-slate-800 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-[11px] truncate">{src.name}</span>
                  {isWinner && (
                    <span className="text-[9px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded font-bold border border-emerald-500/20">
                      Authoritative Winner
                    </span>
                  )}
                </div>

                <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Claimed Value:</span>
                  <strong className={isWinner ? "text-emerald-400 text-sm" : "text-rose-400 text-sm"}>
                    {src.claimedValue}
                  </strong>
                </div>

                <div className="text-[10px] text-slate-400">
                  Weight: <strong className="text-slate-200">{src.authorityWeight}</strong> | {src.trustRating}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Document Evidence Snippet Preview */}
      <div className="p-4 bg-slate-950/90 rounded-xl border border-slate-800 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-2">
          <span className="flex items-center space-x-1.5 font-bold text-amber-400">
            <FileText className="w-4 h-4" />
            <span>EVIDENCE PREVIEW — {selectedSource.name}</span>
          </span>
          <span className="text-[10px] text-slate-500">Page {selectedSource.page} | Section: {selectedSource.section}</span>
        </div>

        <div className="p-3 bg-slate-900/90 rounded border border-amber-500/30 text-amber-200 leading-relaxed font-sans text-xs">
          "{selectedSource.rawText}"
        </div>
      </div>

      {/* Reasoning Stages (Challenger + Engineering + Authority Engine) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        
        {/* AI Challenger */}
        <div className="p-4 bg-slate-950/80 rounded-xl border border-rose-500/30 space-y-2">
          <div className="text-rose-400 font-bold uppercase text-[10px]">1. AI Challenger Critique</div>
          <p className="text-slate-300 leading-normal text-[11px]">{forensicData.aiChallenger.critique}</p>
        </div>

        {/* Engineering Physics */}
        <div className="p-4 bg-slate-950/80 rounded-xl border border-emerald-500/30 space-y-2">
          <div className="text-emerald-400 font-bold uppercase text-[10px]">2. Engineering Validation</div>
          <div className="text-emerald-300 font-bold">{forensicData.engineeringValidation.ruleName}</div>
          <p className="text-slate-300 text-[11px]">{forensicData.engineeringValidation.message}</p>
        </div>

        {/* Authority Engine */}
        <div className="p-4 bg-slate-950/80 rounded-xl border border-amber-500/30 space-y-2">
          <div className="text-amber-400 font-bold uppercase text-[10px]">3. Source Authority Result</div>
          <div className="text-amber-300 font-bold">{forensicData.authorityEngine.winner}</div>
          <p className="text-slate-400 text-[11px]">{forensicData.authorityEngine.rule}</p>
        </div>

      </div>

      {/* Final Recommendation Box */}
      <div className="p-5 bg-slate-900 rounded-2xl border border-amber-500/40 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-amber-400 font-extrabold text-sm uppercase tracking-wider flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>FINAL FORENSIC RECOMMENDATION</span>
          </span>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 font-bold rounded-lg border border-emerald-500/20">
            {forensicData.recommendation}
          </span>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <div className="text-slate-400 font-bold uppercase text-[10px]">WHY THIS VALUE? (EXPLAINABLE REASONING):</div>
          <p className="text-slate-200 leading-relaxed text-xs">{forensicData.whyExplanation}</p>
        </div>
      </div>

    </div>
  );
}
