import React, { useState } from 'react';
import { Settings, Key, Activity, Server, ShieldCheck, CheckCircle2, Lock, Cpu, Database } from 'lucide-react';

export default function SettingsAndIntegrations({ initialSubTab = 'settings' }) {
  const [subTab, setSubTab] = useState(initialSubTab); // settings, api, status

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-extrabold text-white tracking-tight">SYSTEM SETTINGS & INTEGRATIONS</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure pipeline thresholds, API keys, PIM webhook webhooks, and inspect real-time system health.
          </p>
        </div>

        {/* Sub-tab Selectors */}
        <div className="flex items-center space-x-1.5 font-mono text-xs bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {[
            { id: 'settings', label: 'Engine Thresholds', icon: Settings },
            { id: 'api', label: 'API & Integrations', icon: Key },
            { id: 'status', label: 'System Health Status', icon: Activity }
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setSubTab(t.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                  subTab === t.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtab 1: Engine Threshold Settings */}
      {subTab === 'settings' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
              <div className="text-amber-400 font-bold">Auto-Approval Confidence Threshold</div>
              <p className="text-slate-400 text-[11px]">Records exceeding this extraction confidence skip manual review.</p>
              <input type="range" min="70" max="99" defaultValue="85" className="w-full accent-amber-400" />
              <div className="flex justify-between text-slate-300 font-bold">
                <span>Threshold: 85%</span>
                <span className="text-emerald-400">Active</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
              <div className="text-cyan-400 font-bold">Source Authority Hierarchy Weights</div>
              <p className="text-slate-400 text-[11px]">Datasheet PDF (1.0) &gt; Web Description (0.6) &gt; AI Inference (0.4)</p>
              <div className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300">
                Rule SA-02: Datasheet overrides generic distributor text
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Subtab 2: API & Integrations */}
      {subTab === 'api' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 bg-slate-950/90 rounded-xl border border-slate-800 space-y-3">
            <div className="text-slate-200 font-bold flex items-center justify-between">
              <span>REST API Endpoints Overview</span>
              <span className="text-emerald-400">Authenticated (X-API-Key)</span>
            </div>
            <div className="space-y-2">
              <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex justify-between text-slate-300">
                <code>POST /api/pipeline/full</code>
                <span className="text-amber-400">3-Stage Multimodal AI Pipeline</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex justify-between text-slate-300">
                <code>POST /api/pipeline/batch</code>
                <span className="text-cyan-400">Controlled Batch Ingestion (Concurrency: 3)</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded border border-slate-800 flex justify-between text-slate-300">
                <code>POST /api/copilot/query</code>
                <span className="text-purple-400">Contextual Ask SpecForge Assistant</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: System Health Status */}
      {subTab === 'status' && (
        <div className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="p-4 bg-slate-950/80 rounded-xl border border-emerald-500/30 flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-[10px]">Gemini 2.0 Engine</div>
                <div className="text-emerald-400 font-bold text-sm">ONLINE</div>
              </div>
              <Cpu className="w-6 h-6 text-emerald-400" />
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-emerald-500/30 flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-[10px]">RAG Knowledge Base</div>
                <div className="text-emerald-400 font-bold text-sm">20 Categories Loaded</div>
              </div>
              <Database className="w-6 h-6 text-emerald-400" />
            </div>

            <div className="p-4 bg-slate-950/80 rounded-xl border border-emerald-500/30 flex items-center justify-between">
              <div>
                <div className="text-slate-400 text-[10px]">Security Guards</div>
                <div className="text-emerald-400 font-bold text-sm">SSRF & Helmet Active</div>
              </div>
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
