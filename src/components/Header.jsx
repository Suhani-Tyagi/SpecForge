import React, { useState } from 'react';
import { Cpu, Home, Package, Building2, AlertTriangle, Database, BarChart3, History, Settings, Upload, Search, ChevronRight } from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  activeProductCount = 0,
  onStartProcessData,
  searchQuery = '',
  setSearchQuery,
  breadcrumbs = []
}) {
  const navItems = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'products', label: 'PRODUCTS', icon: Package },
    { id: 'suppliers', label: 'SUPPLIERS', icon: Building2 },
    { id: 'review', label: 'REVIEW', icon: AlertTriangle, count: activeProductCount },
    { id: 'knowledge', label: 'KNOWLEDGE', icon: Database },
    { id: 'analytics', label: 'ANALYTICS', icon: BarChart3 },
    { id: 'audit', label: 'AUDIT', icon: History },
    { id: 'settings', label: 'SETTINGS', icon: Settings }
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#070A10]/95 backdrop-blur-xl font-mono">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Branding, Global Search, and Global Action */}
        <div className="flex items-center justify-between h-16 border-b border-slate-800/60 gap-4">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer shrink-0" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-100 font-sans">
                  SPECForge
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold tracking-wide hidden sm:inline">
                  AI Product Intelligence & Governance
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium font-sans hidden md:block">
                Turn messy supplier information into trusted, commerce-ready product data.
              </p>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                placeholder="Search products, suppliers, SKUs or issues..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/80 transition-all"
              />
            </div>
          </div>

          {/* Global Action Button: + PROCESS DATA */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={onStartProcessData}
              className="flex items-center space-x-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all font-mono"
            >
              <Upload className="w-4 h-4" />
              <span>+ PROCESS DATA</span>
            </button>
          </div>

        </div>

        {/* Primary Navigation Bar */}
        <div className="flex items-center py-2 overflow-x-auto text-xs space-x-2">
          {navItems.map(tab => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
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

        {/* Optional Breadcrumbs Navigation */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center space-x-1 py-1.5 text-[11px] text-slate-400 border-t border-slate-800/60 font-mono">
            {breadcrumbs.map((bc, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-600" />}
                <span
                  onClick={bc.onClick}
                  className={`hover:text-amber-400 cursor-pointer ${idx === breadcrumbs.length - 1 ? 'text-amber-400 font-bold' : ''}`}
                >
                  {bc.label}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}

      </div>
    </header>
  );
}
