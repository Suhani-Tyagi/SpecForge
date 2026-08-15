import React, { useState } from 'react';
import { HelpCircle, AlertTriangle, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { WHAT_IF_SIMULATION } from '../data/demoDataset.js';

export default function WhatIfSimulator({ onToast }) {
  const [selectedDecision, setSelectedDecision] = useState('A'); // A: 415V, B: 380V

  const scn = selectedDecision === 'A' ? WHAT_IF_SIMULATION.scenarioA : WHAT_IF_SIMULATION.scenarioB;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 font-mono text-xs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-extrabold text-white tracking-tight">WHAT-IF DECISION SIMULATOR</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulate downstream business, catalog, and compatibility consequences before approving conflicting attributes.
          </p>
        </div>

        {/* Choice Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedDecision('A')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all border ${
              selectedDecision === 'A'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-md'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            Simulate 415 V (Recommended)
          </button>
          <button
            onClick={() => setSelectedDecision('B')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all border ${
              selectedDecision === 'B'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-md'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            Simulate 380 V (Web Listing)
          </button>
        </div>
      </div>

      {/* Decision Impact Card */}
      <div className={`p-5 rounded-2xl border space-y-4 ${
        selectedDecision === 'A' ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-rose-500/5 border-rose-500/30'
      }`}>
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-sm text-white">{scn.label}</span>
          <span className={`px-3 py-1 rounded text-xs font-bold ${
            selectedDecision === 'A' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
          }`}>
            {scn.publicationStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Affected SKUs</div>
            <div className="text-lg font-bold text-white mt-0.5">{scn.affectedSkus} Catalog Items</div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Compatibility Impact</div>
            <div className="text-xs text-slate-200 mt-0.5">{scn.compatibilityImpact}</div>
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-500 uppercase">Risk Level</div>
            <div className={`text-lg font-bold mt-0.5 ${selectedDecision === 'A' ? 'text-emerald-400' : 'text-rose-400'}`}>
              Risk {scn.riskScore}/100
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => onToast && onToast(`Decision ${scn.voltage} confirmed in simulator.`, selectedDecision === 'A' ? 'success' : 'warning')}
            className={`px-4 py-2 font-bold rounded-xl text-xs flex items-center space-x-1.5 ${
              selectedDecision === 'A'
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-rose-500 hover:bg-rose-400 text-white shadow-md shadow-rose-500/20'
            }`}
          >
            <span>Confirm Choice: Approve {scn.voltage}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
