import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, Filter, ArrowRight, ShieldCheck, Lock } from 'lucide-react';
import ExplainTooltip from './ExplainTooltip.jsx';
import { DECISIONS_REQUIRING_ATTENTION, DEMO_PRODUCTS } from '../data/demoDataset.js';

export default function NeedsYourAttention({ onSelectProductForReview, onToast }) {
  const [filter, setFilter] = useState('ALL'); // ALL, CRITICAL, CONFLICTS, MISSING, READY

  const items = DECISIONS_REQUIRING_ATTENTION;

  const filteredItems = items.filter(item => {
    if (filter === 'CRITICAL') return item.severity === 'CRITICAL';
    if (filter === 'CONFLICTS') return item.issue.toLowerCase().includes('conflict') || item.issue.toLowerCase().includes('voltage');
    if (filter === 'MISSING') return item.issue.toLowerCase().includes('missing');
    return true;
  });

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 font-mono text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />
            <h1 className="text-xl font-extrabold text-white tracking-tight uppercase">Needs Your Attention</h1>
            <ExplainTooltip title="Needs Your Attention" text="Products flagged by AI Challenger or Physics Rules requiring single-click human confirmation before catalog publication." />
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Products with specification conflicts, missing required data, or physics anomalies.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
          <span>{filteredItems.length} Products Require Attention</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto text-xs pb-1">
        {['ALL', 'CRITICAL', 'CONFLICTS', 'MISSING', 'READY'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filter === f
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Issue Items List */}
      <div className="space-y-3">
        {filteredItems.map((item, idx) => (
          <div key={idx} className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-amber-500/40 transition-all">
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center space-x-2">
                <span className="text-white font-extrabold text-sm">{item.name}</span>
                <span className="text-[10px] text-slate-500">({item.sku})</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                  item.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {item.severity}
                </span>
              </div>

              <div className="text-slate-300 text-xs font-sans">
                Issue: <strong className="text-rose-300">{item.issue}</strong>
              </div>

              <div className="text-slate-400 text-[11px] font-sans">
                Recommended Action: <strong className="text-emerald-400">{item.recommendedAction}</strong>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <div className="text-right text-[10px] text-slate-500">
                <div>Risk Score</div>
                <div className="text-sm font-bold text-rose-400">{item.riskScore}/100</div>
              </div>

              <button
                onClick={() => {
                  if (onSelectProductForReview) {
                    onSelectProductForReview(DEMO_PRODUCTS[1]);
                  }
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20 transition-all"
              >
                <span>REVIEW PRODUCT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
