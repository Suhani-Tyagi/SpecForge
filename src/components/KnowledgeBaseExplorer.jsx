import React, { useState } from 'react';
import { Database, Search, ShieldCheck, Tag, Box, AlertTriangle, Layers } from 'lucide-react';

export default function KnowledgeBaseExplorer({ taxonomy = [], referenceProducts = [], consistencyRules = [] }) {
  const [activeTab, setActiveTab] = useState('taxonomy'); // 'taxonomy', 'ref_products', 'rules'
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTaxonomy = taxonomy.filter(cat =>
    cat.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.code.includes(searchTerm)
  );

  const filteredRefProducts = referenceProducts.filter(prod =>
    prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prod.category_code.includes(searchTerm)
  );

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-6">
      
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100 font-mono">
              Seed Knowledge Base Explorer (RAG Engine Source)
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Browse the 20 UNSPSC/ETIM categories, 12 reference products, and consistency rules driving SpecForge's RAG enrichment.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search taxonomy, products..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('taxonomy')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
            activeTab === 'taxonomy'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Industrial Taxonomy ({taxonomy.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ref_products')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
            activeTab === 'ref_products'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
          <span>Reference Products ({referenceProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all ${
            activeTab === 'rules'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Consistency Rules ({consistencyRules.length})</span>
        </button>
      </div>

      {/* TAB 1: Taxonomy */}
      {activeTab === 'taxonomy' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredTaxonomy.map((cat) => (
            <div key={cat.code} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                  {cat.code}
                </span>
                <span className="text-xs font-bold text-amber-300 font-mono">
                  {cat.category}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-100">
                {cat.subcategory}
              </h4>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Typical Attributes:</span>
                <div className="flex flex-wrap gap-1">
                  {cat.typical_attributes.map(attr => (
                    <span key={attr} className="text-[10px] font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                      {attr}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Reference Products */}
      {activeTab === 'ref_products' && (
        <div className="space-y-4">
          {filteredRefProducts.map((prod) => (
            <div key={prod.id} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-amber-400">{prod.id}</span>
                  <h4 className="text-sm font-bold text-slate-100">{prod.name}</h4>
                </div>
                <span className="text-xs font-mono text-cyan-400">
                  Category: {prod.category_code}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Object.entries(prod.attributes || {}).map(([key, val]) => (
                  <div key={key} className="p-2 bg-slate-900 rounded-lg border border-slate-800 font-mono text-xs">
                    <span className="text-[9px] text-slate-400 block">{key}</span>
                    <span className="font-semibold text-amber-300">{String(val.value)}</span>
                    <span className="block text-[8px] text-slate-500 uppercase mt-0.5">
                      {val.confidence} ({val.source})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Consistency Rules */}
      {activeTab === 'rules' && (
        <div className="space-y-3">
          {consistencyRules.map((rule, idx) => (
            <div key={idx} className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 font-mono">
                  Applies to: {rule.applies_to}
                </span>
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                  rule.severity === 'error' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {rule.severity}
                </span>
              </div>
              <p className="text-xs text-slate-200 font-mono">
                "{rule.rule}"
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
