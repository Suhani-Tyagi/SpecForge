import React, { useState } from 'react';
import { AlertOctagon, AlertTriangle, ShieldCheck, CheckCircle2, XCircle, ArrowRight, Eye, Edit3, Check } from 'lucide-react';
import { DEMO_PRODUCTS } from '../data/demoDataset.js';

export default function AIAttentionQueue({ onSelectProductForReview, onToast }) {
  const [selectedFilter, setSelectedFilter] = useState('ALL'); // ALL, CRITICAL, NEEDS_REVIEW, LOW_CONFIDENCE, AUTO_APPROVED

  const queueItems = DEMO_PRODUCTS.map(prod => {
    let category = 'AUTO_APPROVED';
    if (prod.riskScore >= 75) category = 'CRITICAL';
    else if (prod.conflicts.length > 0) category = 'NEEDS_REVIEW';
    else if (prod.confidence < 0.75) category = 'LOW_CONFIDENCE';

    return { ...prod, queueCategory: category };
  });

  const filteredItems = selectedFilter === 'ALL' 
    ? queueItems 
    : queueItems.filter(i => i.queueCategory === selectedFilter);

  const categoryCounts = {
    ALL: queueItems.length,
    CRITICAL: queueItems.filter(i => i.queueCategory === 'CRITICAL').length,
    NEEDS_REVIEW: queueItems.filter(i => i.queueCategory === 'NEEDS_REVIEW').length,
    LOW_CONFIDENCE: queueItems.filter(i => i.queueCategory === 'LOW_CONFIDENCE').length,
    AUTO_APPROVED: queueItems.filter(i => i.queueCategory === 'AUTO_APPROVED').length
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <AlertOctagon className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-extrabold text-white tracking-tight">AI ATTENTION QUEUE</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            <strong>Exception-Driven Governance:</strong> AI automatically processes high-confidence records; human experts resolve exceptions.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-1.5 font-mono text-xs">
          {[
            { id: 'ALL', label: 'All Items', count: categoryCounts.ALL },
            { id: 'CRITICAL', label: 'Critical Blockers', count: categoryCounts.CRITICAL, color: 'text-rose-400 border-rose-500/30 bg-rose-500/10' },
            { id: 'NEEDS_REVIEW', label: 'Needs Review', count: categoryCounts.NEEDS_REVIEW, color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
            { id: 'LOW_CONFIDENCE', label: 'Low Confidence', count: categoryCounts.LOW_CONFIDENCE, color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
            { id: 'AUTO_APPROVED', label: 'Auto Approved', count: categoryCounts.AUTO_APPROVED, color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setSelectedFilter(btn.id)}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                selectedFilter === btn.id
                  ? 'bg-slate-700 text-white border-slate-500 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <span>{btn.label}</span>
              <span className="ml-1.5 px-1.5 py-0.2 text-[10px] rounded-full bg-slate-950 text-slate-300">
                {btn.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Queue Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] bg-slate-900/50">
              <th className="py-3 px-4">Product Record</th>
              <th className="py-3 px-4">Supplier</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Confidence / Risk</th>
              <th className="py-3 px-4">Flag Reason</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredItems.map(item => {
              const isBlocked = item.commerceStatus === 'BLOCKED';

              return (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-all">
                  
                  {/* Product */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-white text-xs">{item.name}</div>
                    <div className="text-[10px] text-slate-500">{item.sku}</div>
                  </td>

                  {/* Supplier */}
                  <td className="py-3 px-4 text-slate-300">
                    {item.supplier}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-slate-400">
                    {item.category}
                  </td>

                  {/* Confidence & Risk */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.confidence >= 0.90 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {(item.confidence * 100).toFixed(0)}% Conf
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.riskLevel === 'LOW' ? 'bg-emerald-500/10 text-emerald-400' :
                        item.riskLevel === 'HIGH' ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        Risk {item.riskScore}/100
                      </span>
                    </div>
                  </td>

                  {/* Reason */}
                  <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                    {item.commerceReadiness?.blockingIssues?.[0] || item.conflicts?.[0]?.resolution || 'High confidence specification extraction verified'}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => onSelectProductForReview(item)}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[11px] transition-all"
                    >
                      HITL Review
                    </button>
                    {isBlocked && (
                      <button
                        onClick={() => onToast && onToast(`Product ${item.id} override approved by user.`, 'success')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded text-[11px] border border-slate-700"
                      >
                        Override
                      </button>
                    )}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
