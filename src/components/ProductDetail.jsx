import React, { useState } from 'react';
import { Package, ShieldCheck, AlertTriangle, Lock, CheckCircle2, FileText, Scale, History, Network, ArrowRight, HelpCircle, Eye, AlertOctagon, XCircle } from 'lucide-react';
import SpecForensics from './SpecForensics.jsx';
import TrustScoreCard from './TrustScoreCard.jsx';
import WhatIfSimulator from './WhatIfSimulator.jsx';
import EvidenceGraph from './EvidenceGraph.jsx';
import ExplainTooltip from './ExplainTooltip.jsx';
import { DEMO_PRODUCTS, FORENSICS_CASE } from '../data/demoDataset.js';

export default function ProductDetail({ product = DEMO_PRODUCTS[1], onToast, onOpenReview }) {
  const [activeSubTab, setActiveSubTab] = useState('overview'); // overview, specs, issues, evidence, risk, history

  const readiness = product?.commerceReadiness || { completeness: 88, confidence: 81, blockingIssues: ["Voltage discrepancy (415V vs 380V)"] };
  const isReady = product?.commerceStatus === 'READY' || readiness.blockingIssues.length === 0;

  const specRows = [
    { attribute: "Rated Power", value: "3.7 kW (5 HP)", status: "VERIFIED", symbol: "✓ Verified", source: "Manufacturer Datasheet (pg 2)" },
    { attribute: "Nominal Voltage", value: "415 V (Datasheet) vs 380 V (Web)", status: "CONFLICT", symbol: "⚠ Conflict", source: "3 Competing Sources" },
    { attribute: "Synchronous Speed", value: "1440 RPM", status: "VERIFIED", symbol: "✓ Verified", source: "Manufacturer Datasheet (pg 2)" },
    { attribute: "Protection Class", value: "IP55", status: "VERIFIED", symbol: "✓ Verified", source: "Nameplate Image" },
    { attribute: "Operating Temperature", value: "MISSING", status: "MISSING", symbol: "! Missing", source: "N/A" }
  ];

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 font-sans">
      
      {/* Product Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span>SKU: <strong className="text-amber-400">{product.sku || 'MTR-204'}</strong></span>
            <span>• Supplier: <strong className="text-slate-200">{product.supplier}</strong></span>
            <span>• Category: <strong className="text-slate-200">{product.category}</strong></span>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">{product.name}</h1>
        </div>

        {/* Publication Readiness Status */}
        <div className="flex items-center space-x-3 shrink-0 font-mono">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase flex items-center justify-end space-x-1">
              <span>Publication Readiness</span>
              <ExplainTooltip title="Publication Readiness" text="Automated compliance score calculating completeness, unit validation, and conflict resolution before catalog export." />
            </div>
            <div className="text-lg font-extrabold text-white">{readiness.completeness}% Ready</div>
          </div>

          <span className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 border shadow-lg ${
            isReady 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-rose-500/10'
          }`}>
            {isReady ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>{isReady ? 'READY TO PUBLISH' : 'NEEDS REVIEW'}</span>
          </span>
        </div>
      </div>

      {/* Unified Sub-Tabs Navigation */}
      <div className="flex items-center space-x-1 border-b border-slate-800 pb-2 overflow-x-auto font-mono text-xs">
        {[
          { id: 'overview', label: 'OVERVIEW' },
          { id: 'specs', label: 'SPECIFICATIONS' },
          { id: 'issues', label: 'ISSUES & FORENSICS', count: 1 },
          { id: 'evidence', label: 'EVIDENCE & GRAPH' },
          { id: 'risk', label: 'RISK & TRUST' },
          { id: 'history', label: 'HISTORY & AUDIT' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${
              activeSubTab === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* SUBTAB 1: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6 font-mono text-xs">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Verified Specs</div>
              <div className="text-xl font-extrabold text-emerald-400 mt-0.5">18 Fields</div>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-amber-500/30">
              <div className="text-[10px] text-slate-500 uppercase font-bold text-amber-400">Issues Flagged</div>
              <div className="text-xl font-extrabold text-amber-400 mt-0.5">1 Conflict</div>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-cyan-500/30">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Evidence Sources</div>
              <div className="text-xl font-extrabold text-cyan-400 mt-0.5">3 Documents</div>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-rose-500/30">
              <div className="text-[10px] text-slate-500 uppercase font-bold text-rose-400">Risk Score</div>
              <div className="text-xl font-extrabold text-rose-400 mt-0.5">68 / 100</div>
            </div>
          </div>

          {/* Recommended Next Action Banner */}
          {!isReady && (
            <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-200">
              <div>
                <div className="font-extrabold text-amber-400 text-sm flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>RECOMMENDED NEXT ACTION</span>
                </div>
                <p className="text-xs text-slate-300 font-sans mt-0.5">
                  Resolve the nominal voltage discrepancy (415V vs 380V) before publishing this product to the PIM catalog.
                </p>
              </div>

              <button
                onClick={() => setActiveSubTab('issues')}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-amber-500/20 transition-all shrink-0"
              >
                <span>REVIEW ISSUE</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Embedded Quick Specs Table Preview */}
          <div className="space-y-2">
            <div className="text-slate-400 uppercase tracking-wider text-[11px] font-bold">Quick Specifications Preview:</div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-slate-800">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-900">
                    <th className="py-2.5 px-3">Attribute</th>
                    <th className="py-2.5 px-3">Extracted Value</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Primary Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {specRows.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-bold text-slate-200">{r.attribute}</td>
                      <td className="py-2.5 px-3 text-white">{r.value}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400' :
                          r.status === 'CONFLICT' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {r.symbol}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px]">{r.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB 2: SPECIFICATIONS */}
      {activeSubTab === 'specs' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
            <span className="font-bold">Extracted Product Specifications:</span>
            <span>Total 18 Attributes</span>
          </div>

          <table className="w-full text-left border-collapse border border-slate-800">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-900">
                <th className="py-2.5 px-3">Attribute Name</th>
                <th className="py-2.5 px-3">Extracted Value</th>
                <th className="py-2.5 px-3">Normalized Value</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Source Lineage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {specRows.map((r, i) => (
                <tr key={i} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-bold text-slate-200">{r.attribute}</td>
                  <td className="py-2.5 px-3 text-white">{r.value}</td>
                  <td className="py-2.5 px-3 text-amber-300 font-bold">{r.value}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400' :
                      r.status === 'CONFLICT' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {r.symbol}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SUBTAB 3: ISSUES & FORENSICS */}
      {activeSubTab === 'issues' && (
        <SpecForensics forensicData={FORENSICS_CASE} onSelectForReview={onOpenReview} />
      )}

      {/* SUBTAB 4: EVIDENCE & GRAPH */}
      {activeSubTab === 'evidence' && (
        <EvidenceGraph product={product} />
      )}

      {/* SUBTAB 5: RISK & TRUST */}
      {activeSubTab === 'risk' && (
        <div className="space-y-6">
          <TrustScoreCard product={product} />
          <WhatIfSimulator onToast={onToast} />
        </div>
      )}

      {/* SUBTAB 6: HISTORY & AUDIT */}
      {activeSubTab === 'history' && (
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs space-y-2">
          <div className="text-amber-400 font-bold">Product Audit Lineage Timeline:</div>
          <p className="text-slate-400">Ingested on 2026-08-15 14:20:12 • AI Extraction (Gemini 2.0 Flash) • Unit Normalization Complete • Flagged for Human Review.</p>
        </div>
      )}

    </div>
  );
}
