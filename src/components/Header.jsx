import React from 'react';
import { Cpu, LayoutDashboard, Layers, ShieldCheck, Package, Building2, Database, BarChart3, History, Settings, Award, Play, Sparkles, ShieldAlert, Lock, Key } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, activeProductCount = 0, onRunDemo, onStartJudgeMode }) {
  
  const navGroups = [
    {
      group: "CONTROL CENTER",
      items: [
        { id: 'overview', label: 'Control Center', icon: LayoutDashboard }
      ]
    },
    {
      group: "INTELLIGENCE",
      items: [
        { id: 'studio', label: 'Ingestion Studio', icon: Layers },
        { id: 'products', label: 'Products Catalog', icon: Package },
        { id: 'suppliers', label: 'Supplier Scores', icon: Building2 }
      ]
    },
    {
      group: "GOVERNANCE",
      items: [
        { id: 'forensics', label: 'SpecForensics', icon: ShieldAlert },
        { id: 'queue', label: 'Review Queue', icon: ShieldCheck, count: activeProductCount },
        { id: 'audit', label: 'Audit Trail', icon: History }
      ]
    },
    {
      group: "INSIGHTS",
      items: [
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'kb', label: 'Knowledge Base', icon: Database }
      ]
    },
    {
      group: "SYSTEM",
      items: [
        { id: 'security', label: 'Trust & Security', icon: Lock },
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#070A10]/95 backdrop-blur-xl font-mono">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Branding & Primary Actions */}
        <div className="flex items-center justify-between h-16 border-b border-slate-800/60">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-100 font-sans">
                  SpecForge
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold tracking-wide">
                  Enterprise AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium font-sans">
                Stop bad product data before it reaches your catalog.
              </p>
            </div>
          </div>

          {/* Persistent Action Buttons */}
          <div className="flex items-center space-x-3">
            
            {/* RUN DEMO Button */}
            <button
              onClick={onRunDemo}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-extrabold rounded-xl text-xs border border-amber-500/30 transition-all font-mono shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-amber-400" />
              <span>RUN DEMO</span>
            </button>

            {/* Persistent Primary WINNING DEMO Button */}
            <button
              onClick={onStartJudgeMode}
              className="flex items-center space-x-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-amber-500/25 transition-all font-mono"
            >
              <Award className="w-4 h-4" />
              <span>▶ RUN WINNING DEMO</span>
            </button>

          </div>
        </div>

        {/* Grouped Enterprise Navigation Bar */}
        <div className="flex items-center py-2 overflow-x-auto text-xs space-x-4">
          {navGroups.map((grp, idx) => (
            <div key={idx} className="flex items-center space-x-1">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-1 hidden lg:inline">
                {grp.group}:
              </span>
              <div className="flex items-center space-x-1">
                {grp.items.map(tab => {
                  const Icon = tab.icon;
                  const isSelected = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap focus:outline-none ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{tab.label}</span>
                      {tab.count > 0 && (
                        <span className="ml-1 px-1.5 py-0.2 text-[9px] rounded-full bg-slate-950 text-amber-400 font-bold">
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {idx < navGroups.length - 1 && <span className="text-slate-800 ml-2 hidden sm:inline">|</span>}
            </div>
          ))}
        </div>

      </div>
    </header>
  );
}
