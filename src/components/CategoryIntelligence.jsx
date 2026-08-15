import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, Layers, FileCode } from 'lucide-react';

export default function CategoryIntelligence({ taxonomy = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('23-15-16');

  const categorySchemas = {
    '23-15-16': {
      name: "Electric Motors & Drives",
      completeness: 87,
      required: ["Power (kW/HP)", "Voltage (V)", "Phase (1Ph/3Ph)", "Speed (RPM)"],
      recommended: ["Protection Class (IP)", "Efficiency Class (IE)", "Frame Material", "Mounting (B3/B5)"],
      optional: ["Bearing Type", "Insulation Class (F/H)", "Operating Temp Range", "Warranty (Months)"]
    },
    '24-10-12': {
      name: "Pumps & Fluid Handling",
      completeness: 79,
      required: ["Power (kW/HP)", "Maximum Head (m)", "Flow Rate (L/min)", "Operating Temperature"],
      recommended: ["Casing Material (SS316/Cast Iron)", "Inlet Diameter (DN)", "Outlet Diameter (DN)"],
      optional: ["Impeller Material", "Seal Type", "Viscosity Rating"]
    },
    '18-12-05': {
      name: "Sensors & Instrumentation",
      completeness: 94,
      required: ["Pressure Range", "Output Signal (4-20mA)", "Supply Voltage"],
      recommended: ["Process Connection", "Certification (ATEX/IECEx)", "Ingress Protection (IP68)"],
      optional: ["Display Type", "Wetted Materials", "Accuracy Rating (%)"]
    }
  };

  const schema = categorySchemas[selectedCategory] || categorySchemas['23-15-16'];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-extrabold text-white tracking-tight">CATEGORY SCHEMA INTELLIGENCE</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            RAG-driven expected specification schemas for industrial product taxonomy.
          </p>
        </div>

        {/* Category Selector */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-slate-900 text-slate-200 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="23-15-16">Category 23-15-16 (Electric Motors)</option>
          <option value="24-10-12">Category 24-10-12 (Pumps & Fluid Handling)</option>
          <option value="18-12-05">Category 18-12-05 (Sensors & Instruments)</option>
        </select>
      </div>

      {/* Overview completeness bar */}
      <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between font-mono text-xs">
        <div>
          <span className="text-slate-400">Category Schema: </span>
          <strong className="text-white">{schema.name} ({selectedCategory})</strong>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-slate-400">Baseline Completeness:</span>
          <span className="text-emerald-400 font-extrabold text-sm">{schema.completeness}%</span>
        </div>
      </div>

      {/* Schema Requirement Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        
        {/* Required Attributes */}
        <div className="p-4 bg-slate-950/80 rounded-xl border border-rose-500/30 space-y-3">
          <div className="text-rose-400 font-bold uppercase text-[11px] flex items-center space-x-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Required Attributes (Blocking)</span>
          </div>
          <div className="space-y-1.5">
            {schema.required.map((req, i) => (
              <div key={i} className="p-2 bg-slate-900 rounded border border-rose-500/20 text-rose-200">
                • {req}
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Attributes */}
        <div className="p-4 bg-slate-950/80 rounded-xl border border-amber-500/30 space-y-3">
          <div className="text-amber-400 font-bold uppercase text-[11px] flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Recommended Attributes</span>
          </div>
          <div className="space-y-1.5">
            {schema.recommended.map((rec, i) => (
              <div key={i} className="p-2 bg-slate-900 rounded border border-amber-500/20 text-amber-200">
                • {rec}
              </div>
            ))}
          </div>
        </div>

        {/* Optional Attributes */}
        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3">
          <div className="text-slate-400 font-bold uppercase text-[11px] flex items-center space-x-1.5">
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>Optional Attributes</span>
          </div>
          <div className="space-y-1.5">
            {schema.optional.map((opt, i) => (
              <div key={i} className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300">
                • {opt}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
