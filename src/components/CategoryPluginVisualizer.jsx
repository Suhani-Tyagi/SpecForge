import React from 'react';
import { Layers, ArrowDown, Cpu, Database, CheckCircle2, PlusCircle, ShieldCheck } from 'lucide-react';
import { CATEGORY_PLUGINS } from '../data/demoDataset.js';

export default function CategoryPluginVisualizer() {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 font-mono text-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-extrabold text-white tracking-tight">SCALABLE CATEGORY PLUGIN ARCHITECTURE</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            SpecForge scales across industrial verticals by registering domain category plugins without modifying core AI engine code.
          </p>
        </div>

        <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl font-bold">
          Domain Modular Engine
        </span>
      </div>

      {/* Core Platform Node */}
      <div className="p-4 bg-gradient-to-r from-amber-500/20 via-slate-900 to-yellow-500/20 rounded-2xl border border-amber-500/40 text-center space-y-1 glow-amber">
        <div className="text-amber-400 font-extrabold text-sm uppercase tracking-wider flex items-center justify-center space-x-2">
          <Cpu className="w-4 h-4" />
          <span>SPECFORGE AI CORE PIPELINE ENGINE</span>
        </div>
        <p className="text-slate-300 text-xs">
          Multimodal Gemini Extraction + Deterministic Unit Normalizer + Source Authority Matrix + HITL Review Queue
        </p>
      </div>

      <div className="flex justify-center">
        <ArrowDown className="w-5 h-5 text-amber-400 animate-bounce" />
      </div>

      {/* Plugins Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {CATEGORY_PLUGINS.map(plugin => (
          <div key={plugin.id} className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3 hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-xs truncate">{plugin.name}</span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                plugin.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-400'
              }`}>
                {plugin.status}
              </span>
            </div>

            <div className="text-[10px] text-slate-400">
              Code: <strong className="text-amber-400">{plugin.code}</strong>
            </div>

            <div className="space-y-1 pt-1 border-t border-slate-800/80 text-[10px]">
              <div className="text-slate-500 font-bold uppercase">Required Attributes:</div>
              {plugin.requiredFields.map((f, idx) => (
                <div key={idx} className="text-slate-300 truncate">• {f}</div>
              ))}
            </div>

            <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 flex justify-between">
              <span>Rules: <strong className="text-white">{plugin.rulesCount}</strong></span>
              <span>SKUs: <strong className="text-emerald-400">{plugin.referenceSkus}</strong></span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
