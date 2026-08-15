import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Lock, CheckCircle2, FileText, Scale, History, Network, ArrowRight, Eye, AlertOctagon, XCircle, Check } from 'lucide-react';
import SpecForensics from './SpecForensics.jsx';
import TrustScoreCard from './TrustScoreCard.jsx';
import WhatIfSimulator from './WhatIfSimulator.jsx';
import EvidenceGraph from './EvidenceGraph.jsx';
import ExplainTooltip from './ExplainTooltip.jsx';
import { DEMO_PRODUCTS, FORENSICS_CASE } from '../data/demoDataset.js';

export default function ProductDetail({ product = DEMO_PRODUCTS[1], onToast }) {
  const [activeSubTab, setActiveSubTab] = useState('overview'); // overview, specs, issues, evidence, risk, history
  const [isConflictResolved, setIsConflictResolved] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);

  const isReady = isConflictResolved || product?.commerceStatus === 'READY';
  const readinessScore = isReady ? 100 : 81;

  const handleApproveConflict = () => {
    setIsConflictResolved(true);
    setShowConflictModal(false);
    if (onToast) onToast('Nominal Voltage set to 415 V (Human Approved). Product is now READY TO PUBLISH!', 'success');
  };

  const specRows = [
    { attribute: "Rated Power", value: "3.7 kW (5 HP)", status: "VERIFIED", symbol: "✓ Verified", source: "Manufacturer Datasheet (pg 2)" },
    { attribute: "Nominal Voltage", value: isConflictResolved ? "415 V (Human Approved)" : "415 V (Datasheet) vs 380 V (Web)", status: isConflictResolved ? "VERIFIED" : "CONFLICT", symbol: isConflictResolved ? "✓ Verified" : "⚠ Conflict", source: isConflictResolved ? "Human Approval SA-02" : "3 Competing Sources" },
    { attribute: "Synchronous Speed", value: "1440 RPM", status: "VERIFIED", symbol: "✓ Verified", source: "Manufacturer Datasheet (pg 2)" },
    { attribute: "Protection Class", value: "IP55", status: "VERIFIED", symbol: "✓ Verified", source: "Nameplate Image" },
    { attribute: "Phase / Frequency", value: "3 Phase / 50 Hz", status: "VERIFIED", symbol: "✓ Verified", source: "Nameplate Image" }
  ];

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 font-sans">
      
      {/* Top Header & Publication Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <span>SKU: <strong className="text-amber-400">{product.sku || 'MTR-204'}</strong></span>
            <span>• Supplier: <strong className="text-slate-200">{product.supplier}</strong></span>
            <span>• Category: <strong className="text-slate-200">{product.category}</strong></span>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">{product.name}</h1>
        </div>

        {/* Publication Readiness Badge */}
        <div className="flex items-center space-x-4 shrink-0 font-sans">
          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase flex items-center justify-end space-x-1 font-mono">
              <span>Publication Readiness</span>
              <ExplainTooltip title="Publication Readiness" text="Automated compliance score calculating completeness, unit validation, and conflict resolution before catalog export." />
            </div>
            <div className="text-lg font-extrabold text-white font-mono">{readinessScore}% Ready</div>
          </div>

          <span className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-2 border shadow-lg ${
            isReady 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-emerald-500/10'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/40 shadow-rose-500/10'
          }`}>
            {isReady ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>{isReady ? 'READY TO PUBLISH' : 'NEEDS REVIEW'}</span>
          </span>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center space-x-1 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-mono">
        {[
          { id: 'overview', label: 'OVERVIEW' },
          { id: 'specs', label: 'SPECIFICATIONS' },
          { id: 'issues', label: 'ISSUES & FORENSICS', count: isConflictResolved ? 0 : 1 },
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

      {/* OVERVIEW SUBTAB */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          
          {/* SECTION 1: WHAT NEEDS YOUR ATTENTION? */}
          <div className="space-y-3">
            <div className="text-slate-300 font-extrabold text-xs uppercase font-mono tracking-wider flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>WHAT NEEDS YOUR ATTENTION?</span>
            </div>

            {!isConflictResolved ? (
              <div className="p-5 bg-rose-500/10 rounded-2xl border border-rose-500/40 space-y-4 flex flex-col md:flex-row md:items-center justify-between gap-4 glow-rose">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 font-mono text-xs text-rose-400 font-bold">
                    <AlertOctagon className="w-4 h-4" />
                    <span>HIGH-RISK SPECIFICATION CONFLICT</span>
                  </div>
                  <h3 className="text-base font-bold text-white">Nominal Voltage Discrepancy</h3>
                  <p className="text-xs text-slate-300 font-sans">
                    Manufacturer Datasheet specifies <strong className="text-emerald-400">415 V</strong>, while Supplier Web Portal text claims <strong className="text-rose-400">380 V</strong>.
                  </p>
                </div>

                <button
                  onClick={() => setShowConflictModal(true)}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center space-x-1.5 shadow-lg shadow-amber-500/20 shrink-0 transition-all font-mono"
                >
                  <span>REVIEW CONFLICT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-emerald-300 text-xs font-sans flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>All specification issues have been resolved. Product is ready for catalog export.</span>
              </div>
            )}
          </div>

          {/* SECTION 2: WHAT IS ALREADY TRUSTWORTHY? */}
          <div className="space-y-3">
            <div className="text-slate-300 font-extrabold text-xs uppercase font-mono tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>WHAT IS ALREADY TRUSTWORTHY?</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border border-slate-800 text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-900 font-mono">
                    <th className="py-2.5 px-3">Attribute</th>
                    <th className="py-2.5 px-3">Verified Value</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Primary Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-sans">
                  {specRows.map((r, i) => (
                    <tr key={i} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 font-bold text-slate-200 font-mono">{r.attribute}</td>
                      <td className="py-2.5 px-3 text-white font-bold">{r.value}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                          r.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {r.symbol}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px] font-mono">{r.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SECTION 3: PUBLICATION GATE */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono">
              <span className="font-extrabold text-white text-xs uppercase tracking-wider flex items-center space-x-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>PUBLICATION GATE CHECKLIST</span>
              </span>
              <span className={`px-3 py-1 rounded text-xs font-bold ${
                isReady ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}>
                {isReady ? '🟢 READY TO PUBLISH' : '🔒 BLOCKED UNTIL REVIEW'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-[11px]">
              <div className="p-3 bg-slate-900 rounded-xl border border-emerald-500/30 text-emerald-400 flex items-center justify-between">
                <span>Specifications Extracted</span>
                <Check className="w-4 h-4" />
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-emerald-500/30 text-emerald-400 flex items-center justify-between">
                <span>Category Schema Match</span>
                <Check className="w-4 h-4" />
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-emerald-500/30 text-emerald-400 flex items-center justify-between">
                <span>Physics EV-002 Check</span>
                <Check className="w-4 h-4" />
              </div>
              <div className={`p-3 bg-slate-900 rounded-xl border flex items-center justify-between ${
                isReady ? 'border-emerald-500/30 text-emerald-400' : 'border-rose-500/30 text-rose-400'
              }`}>
                <span>Conflict Resolution</span>
                {isReady ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              </div>
              <div className={`p-3 bg-slate-900 rounded-xl border flex items-center justify-between ${
                isReady ? 'border-emerald-500/30 text-emerald-400' : 'border-rose-500/30 text-rose-400'
              }`}>
                <span>Human Approval</span>
                {isReady ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-emerald-500/30 text-emerald-400 flex items-center justify-between">
                <span>PIM Export Payload</span>
                <Check className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* OTHER SUBTABS */}
      {activeSubTab === 'specs' && (
        <div className="space-y-3 font-sans text-xs">
          <table className="w-full text-left border-collapse border border-slate-800">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-900 font-mono">
                <th className="py-2.5 px-3">Attribute Name</th>
                <th className="py-2.5 px-3">Value</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Source Lineage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {specRows.map((r, i) => (
                <tr key={i} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-bold text-slate-200 font-mono">{r.attribute}</td>
                  <td className="py-2.5 px-3 text-white font-bold">{r.value}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      r.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {r.symbol}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px] font-mono">{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === 'issues' && (
        <SpecForensics forensicData={FORENSICS_CASE} onSelectForReview={() => setShowConflictModal(true)} />
      )}

      {activeSubTab === 'evidence' && (
        <EvidenceGraph product={product} />
      )}

      {activeSubTab === 'risk' && (
        <div className="space-y-6">
          <TrustScoreCard product={product} />
          <WhatIfSimulator onToast={onToast} />
        </div>
      )}

      {activeSubTab === 'history' && (
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs space-y-2">
          <div className="text-amber-400 font-bold">Product Audit Lineage Timeline:</div>
          <p className="text-slate-400">Ingested on 2026-08-15 14:20:12 • Multimodal AI Extraction • Unit Normalization Complete {isConflictResolved ? '• Human Approved 415V by Domain Expert' : '• Flagged for Conflict Resolution'}.</p>
        </div>
      )}

      {/* INTERACTIVE CONFLICT RESOLUTION MODAL */}
      {showConflictModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-2xl w-full p-6 rounded-3xl border border-slate-800 space-y-6 font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2 font-mono text-xs text-rose-400 font-bold">
                <AlertOctagon className="w-5 h-5" />
                <span>SPECFORENSICS CONFLICT INVESTIGATION</span>
              </div>
              <button onClick={() => setShowConflictModal(false)} className="text-slate-400 hover:text-white text-xs font-bold">✕ Close</button>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">Nominal Voltage Discrepancy (415 V vs 380 V)</h3>
              
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-emerald-500/30">
                  <div className="text-[10px] text-slate-500">Source A (Datasheet)</div>
                  <div className="text-emerald-400 font-bold mt-1">415 V</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-rose-500/30">
                  <div className="text-[10px] text-slate-500">Source B (Supplier Web)</div>
                  <div className="text-rose-400 font-bold mt-1">380 V</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-cyan-500/30">
                  <div className="text-[10px] text-slate-500">Source C (Nameplate)</div>
                  <div className="text-cyan-400 font-bold mt-1">415 V</div>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl text-xs space-y-1">
                <div className="font-bold text-amber-400 font-mono">SpecForge AI Challenger & Authority Analysis:</div>
                <p className="text-slate-300">
                  Manufacturer Datasheet PDF (Weight: 1.0) and Physical Nameplate Image (Weight: 0.9) both verify 415 V. The 380 V value comes from an unverified distributor portal text block. Engineering Rule EV-002 verifies 415 V matches standard 5HP 3-phase motor configurations.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2 font-mono text-xs">
              <button
                onClick={() => setShowConflictModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl border border-slate-700"
              >
                Escalate for Deep Review
              </button>
              <button
                onClick={handleApproveConflict}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl shadow-lg shadow-amber-500/20 flex items-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>ACCEPT 415 V (APPROVE)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
