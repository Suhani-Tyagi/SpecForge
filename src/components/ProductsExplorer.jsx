import React, { useState } from 'react';
import { Package, Search, Filter, ShieldCheck, AlertTriangle, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { DEMO_PRODUCTS } from '../data/demoDataset.js';

export default function ProductsExplorer({ onSelectProductForReview }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [readinessFilter, setReadinessFilter] = useState('ALL'); // ALL, READY, BLOCKED

  const filteredProducts = DEMO_PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReadiness = readinessFilter === 'ALL' ? true : p.commerceStatus === readinessFilter;
    return matchesSearch && matchesReadiness;
  });

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Package className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-extrabold text-white tracking-tight">PRODUCTS CATALOG EXPLORER</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Search, filter, and inspect structured product records and their commerce readiness status.
          </p>
        </div>

        {/* Search & Filter controls */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products, suppliers..."
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          <select
            value={readinessFilter}
            onChange={(e) => setReadinessFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="ALL">All Readiness</option>
            <option value="READY">Ready Only</option>
            <option value="BLOCKED">Blocked Only</option>
          </select>
        </div>
      </div>

      {/* Product List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] bg-slate-900/50">
              <th className="py-3 px-4">Product Name & SKU</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Supplier</th>
              <th className="py-3 px-4">Confidence</th>
              <th className="py-3 px-4">Risk Score</th>
              <th className="py-3 px-4">Commerce Status</th>
              <th className="py-3 px-4 text-right">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredProducts.map(p => {
              const isReady = p.commerceStatus === 'READY';

              return (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-all">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white text-xs">{p.name}</div>
                    <div className="text-[10px] text-slate-500">{p.sku}</div>
                  </td>

                  <td className="py-3 px-4 text-slate-300">{p.category}</td>
                  <td className="py-3 px-4 text-slate-400">{p.supplier}</td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.confidence >= 0.90 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {(p.confidence * 100).toFixed(0)}% Conf
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.riskScore < 25 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {p.riskScore}/100 Risk
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold inline-flex items-center space-x-1 ${
                      isReady ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {isReady ? <CheckCircle2 className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                      <span>{isReady ? 'READY' : 'BLOCKED'}</span>
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onSelectProductForReview(p)}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs transition-all flex items-center space-x-1 ml-auto"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
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
