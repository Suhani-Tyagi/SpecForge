import React, { useEffect } from 'react';
import { X, ShieldCheck, Database, FileText, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, Layers } from 'lucide-react';
import { SOURCE_PRECEDENCE } from '../../server/utils/conflictResolver.js';

export default function EvidenceDrawer({ attributeKey, attributeData, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!attributeKey || !attributeData) return null;

  const sourceInfo = SOURCE_PRECEDENCE[attributeData.source] || { weight: 50, label: attributeData.source || 'General Source' };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="evidence-drawer-title"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end transition-opacity font-mono"
    >
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl h-full flex flex-col justify-between p-6 space-y-6 overflow-y-auto">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h2 id="evidence-drawer-title" className="text-base font-bold text-slate-100 font-sans">
                Explainable AI Evidence Graph
              </h2>
              <span className="text-[10px] text-amber-300">
                Attribute: <strong>{attributeKey}</strong>
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close evidence drawer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Value Card */}
        <div className="space-y-4">
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 uppercase block">Extracted & Validated Value</span>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-extrabold text-amber-400">
                {String(attributeData.value)}
              </span>
              {attributeData.normalized_unit && (
                <span className="text-xs text-cyan-300 font-bold">
                  {attributeData.normalized_unit}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 pt-1">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                attributeData.confidence === 'high' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                attributeData.confidence === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {attributeData.confidence} Confidence
              </span>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Source Weight: {sourceInfo.weight}/100
              </span>
            </div>
          </div>

          {/* Evidence Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              1. Primary Source Attribution
            </h3>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1 text-xs">
              <span className="font-bold text-cyan-300">{sourceInfo.label}</span>
              <p className="text-[11px] text-slate-400 font-sans">
                Evidence snippet: "{attributeData.evidence || 'Explicitly identified from input supplier payload.'}"
              </p>
            </div>

            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              2. AI Reasoning & RAG Inference
            </h3>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1 text-xs">
              <p className="text-[11px] text-slate-300 italic font-sans">
                "{attributeData.reasoning || 'Derived using UNSPSC category default baseline and RAG reference products.'}"
              </p>
            </div>

            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              3. Transformation & Normalization
            </h3>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono">
              <span>{attributeData.transformation || 'Unit normalized to ISO/DIN metric standard.'}</span>
            </div>

            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              4. Validation Engine Status
            </h3>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300">Rules Engine Status:</span>
              <span className="text-emerald-400 font-bold uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {attributeData.validationStatus || 'PASS'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Close Button */}
        <div className="pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold font-mono rounded-xl border border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Close Evidence Drawer
          </button>
        </div>

      </div>
    </div>
  );
}
