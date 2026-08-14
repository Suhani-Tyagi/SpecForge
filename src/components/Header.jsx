import React from 'react';
import { Cpu, Layers, ShieldCheck, Database, Rocket, Sparkles, Activity } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, activeProductCount = 0 }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0B0F17]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-100">
                  SpecForge
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold tracking-wide">
                  v1.0 Hackathon Edition
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Industrial Product Intelligence & RAG Enrichment System
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center space-x-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'studio'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Pipeline Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('review')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'review'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>HITL Review UI</span>
              {activeProductCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-slate-900 text-amber-400 font-mono">
                  {activeProductCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('batch')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'batch'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Batch Scalability Demo</span>
            </button>

            <button
              onClick={() => setActiveTab('kb')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'kb'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Knowledge Base</span>
            </button>
          </nav>

          {/* Model Status & API Badge */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-xs font-mono text-slate-300">
                Gemini 2.0 Flash
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            
            <div className="flex items-center space-x-1 text-xs text-slate-400 font-mono">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>RAG Engine: <strong className="text-emerald-400">ACTIVE</strong></span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
