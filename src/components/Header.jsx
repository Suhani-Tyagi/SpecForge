import React from 'react';
import { Cpu, Layers, ShieldCheck, Database, Rocket, Sparkles, Activity } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, activeProductCount = 0 }) {
  const tabs = [
    { id: 'studio', label: 'Pipeline Studio', icon: Layers },
    { id: 'review', label: 'HITL Review UI', icon: ShieldCheck, count: activeProductCount },
    { id: 'batch', label: 'Batch Scalability Demo', icon: Rocket },
    { id: 'kb', label: 'Knowledge Base RAG', icon: Database }
  ];

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowRight') {
      const nextIndex = (index + 1) % tabs.length;
      setActiveTab(tabs[nextIndex].id);
    } else if (e.key === 'ArrowLeft') {
      const prevIndex = (index - 1 + tabs.length) % tabs.length;
      setActiveTab(tabs[prevIndex].id);
    }
  };

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
                  Enterprise AI Platform
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Industrial Product Intelligence & Commerce Catalog Engine
              </p>
            </div>
          </div>

          {/* Accessible WCAG 2.2 Navigation Tabs */}
          <nav
            role="tablist"
            aria-label="SpecForge Main Navigation"
            className="flex items-center space-x-1 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800"
          >
            {tabs.map((tab, idx) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  role="tab"
                  id={`tab-${tab.id}`}
                  aria-selected={isSelected}
                  aria-controls={`tabpanel-${tab.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] rounded-full bg-slate-900 text-amber-400 font-mono">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Model Status & API Badge */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} aria-hidden="true" />
              <span>Gemini 2.0 Flash</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true"></span>
            </div>
            
            <div className="flex items-center space-x-1 text-xs text-slate-400 font-mono">
              <Activity className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>RAG Engine: <strong className="text-emerald-400">ACTIVE</strong></span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
