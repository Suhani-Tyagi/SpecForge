import React, { useState } from 'react';
import { Cpu, Home, Package, Building2, AlertTriangle, Database, BarChart3, History, Settings, Upload, Search, ChevronRight, Layers } from 'lucide-react';

export default function Header({
  activeTab,
  setActiveTab,
  activeProductCount = 0,
  onStartProcessData,
  searchQuery = '',
  setSearchQuery,
  breadcrumbs = [],
  onSelectSearchResult
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navStructure = [
    { id: 'home', label: 'HOME', icon: Home },
    {
      group: 'WORK',
      items: [
        { id: 'products', label: 'Products', icon: Package },
        { id: 'review', label: 'Needs Attention', icon: AlertTriangle, count: activeProductCount },
        { id: 'suppliers', label: 'Suppliers', icon: Building2 }
      ]
    },
    {
      group: 'KNOWLEDGE',
      items: [
        { id: 'knowledge', label: 'Knowledge & Rules', icon: Database }
      ]
    },
    {
      group: 'INSIGHTS',
      items: [
        { id: 'catalog_health', label: 'Catalog Health', icon: Layers },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 }
      ]
    },
    { id: 'audit', label: 'AUDIT', icon: History },
    { id: 'settings', label: 'SETTINGS', icon: Settings }
  ];

  const sampleSearchItems = [
    { sku: 'MTR-204', name: 'Industrial Heavy-Duty Motor 5HP 415V', supplier: 'ACME Industrial', status: 'NEEDS REVIEW', tab: 'product_detail' },
    { sku: 'PMP-118', name: 'Submersible Chemical Pump 10HP', supplier: 'Apex Flow Systems', status: 'READY', tab: 'products' },
    { sku: 'VLV-302', name: 'High-Pressure Hydraulic Valve 600 PSI', supplier: 'Vortex Controls', status: 'BLOCKED', tab: 'review' }
  ];

  const filteredSearchResults = searchQuery.trim()
    ? sampleSearchItems.filter(item => 
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-[#070A10]/95 backdrop-blur-xl font-sans">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Branding & Search & CTA */}
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
            </div>
          </div>

          {/* Global Search Bar with Functional Results Dropdown */}
          <div className="flex-1 max-w-md relative hidden sm:block">
            <div className="relative">
              <label htmlFor="global-search-input" className="sr-only">Global Search</label>
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" aria-hidden="true" />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                aria-label="Search products, suppliers, SKUs or issues"
                onChange={(e) => {
                  if (setSearchQuery) setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search products, suppliers, SKUs or issues (e.g. MTR-204)..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/80 font-mono transition-all"
              />
            </div>

            {/* Search Dropdown */}
            {isSearchOpen && filteredSearchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 font-mono text-xs divide-y divide-slate-800">
                {filteredSearchResults.map((res, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setIsSearchOpen(false);
                      if (onSelectSearchResult) onSelectSearchResult(res);
                      else setActiveTab(res.tab);
                    }}
                    className="p-3 hover:bg-slate-800/80 cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-white text-xs">{res.name}</div>
                      <div className="text-[10px] text-slate-400">SKU: <strong className="text-amber-400">{res.sku}</strong> • Supplier: {res.supplier}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400">
                      {res.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Global Primary CTA Button */}
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

        {/* Primary Navigation Hierarchy */}
        <div className="flex items-center py-2 overflow-x-auto text-xs space-x-3">
          
          {/* HOME */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'home'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-mono'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>HOME</span>
          </button>

          <span className="text-slate-800">|</span>

          {/* WORK GROUP */}
          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider px-1 hidden md:inline">
              WORK:
            </span>
            {[
              { id: 'products', label: 'Products', icon: Package },
              { id: 'review', label: 'Needs Attention', icon: AlertTriangle, count: activeProductCount },
              { id: 'suppliers', label: 'Suppliers', icon: Building2 }
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-mono'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[9px] rounded-full bg-slate-950 text-amber-400 font-bold font-mono">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <span className="text-slate-800">|</span>

          {/* KNOWLEDGE GROUP */}
          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider px-1 hidden md:inline">
              KNOWLEDGE:
            </span>
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                activeTab === 'knowledge'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-mono'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Knowledge & Rules</span>
            </button>
          </div>

          <span className="text-slate-800">|</span>

          {/* INSIGHTS GROUP */}
          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider px-1 hidden md:inline">
              INSIGHTS:
            </span>
            {[
              { id: 'catalog_health', label: 'Catalog Health', icon: Layers },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-mono'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <span className="text-slate-800">|</span>

          {/* AUDIT */}
          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'audit'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-mono'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>AUDIT</span>
          </button>

          {/* SETTINGS */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-mono'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>SETTINGS</span>
          </button>

        </div>

        {/* Breadcrumbs Navigation Bar */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center space-x-1 py-1 text-[11px] text-slate-400 border-t border-slate-800/60 font-mono">
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
