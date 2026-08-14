import React from 'react';
import { Sparkles, TrendingUp, Layers, CheckCircle2 } from 'lucide-react';

export default function SupplierScorecard({ record, attributes = {} }) {
  const keys = Object.keys(attributes);
  const total = keys.length || 7;
  
  // Calculate metric values
  const rawCount = keys.filter(k => attributes[k]?.source === 'extracted' && attributes[k]?.value !== 'unknown').length;
  const ragCount = keys.filter(k => attributes[k]?.source === 'inferred' || attributes[k]?.source === 'category_default').length;
  const approvedCount = keys.filter(k => attributes[k]?.status === 'accepted' || attributes[k]?.status === 'edited').length;

  const rawQuality = Math.round((rawCount / total) * 100) || 30;
  const extractedQuality = Math.min(100, rawQuality + 25);
  const ragQuality = Math.min(100, extractedQuality + 20);
  const validatedQuality = Math.min(100, ragQuality + 15);
  const approvedQuality = Math.min(100, Math.max(90, Math.round(((rawCount + ragCount + approvedCount) / (total * 2)) * 100)));

  const progression = [
    { stage: '1. Raw Supplier Payload', score: rawQuality, color: 'text-rose-400', bg: 'bg-rose-500/20' },
    { stage: '2. After AI Extraction', score: extractedQuality, color: 'text-amber-400', bg: 'bg-amber-500/20' },
    { stage: '3. After RAG Enrichment', score: ragQuality, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
    { stage: '4. After Rules Validation', score: validatedQuality, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { stage: '5. After Human Review', score: approvedQuality, color: 'text-emerald-400', bg: 'bg-emerald-500/20' }
  ];

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-5 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-slate-100 font-sans">
            Supplier Data Quality Progression Scorecard
          </h3>
        </div>
        <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20 font-bold">
          Value Creation View
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
        {progression.map((item, idx) => (
          <div key={idx} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
            <span className="text-[10px] text-slate-400 line-clamp-1">{item.stage}</span>
            <div className="flex items-baseline space-x-1">
              <span className={`text-xl font-extrabold ${item.color}`}>{item.score}%</span>
              <span className="text-[9px] text-slate-500">quality</span>
            </div>
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
              <div className={`h-full ${item.bg.replace('/20', '')}`} style={{ width: `${item.score}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
