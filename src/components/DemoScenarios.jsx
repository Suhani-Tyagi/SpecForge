import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, XCircle, ShieldAlert, Layers } from 'lucide-react';

const SCENARIOS = [
  {
    id: 'clean',
    title: '1. Clean Product',
    badge: '100% Valid',
    categoryCode: '23-15-16',
    desc: 'Complete specification deep groove ball bearing with zero physical violations.',
    payload: {
      inputType: 'text',
      categoryCode: '23-15-16',
      textContent: 'Deep groove ball bearing 6205-2RS, 25mm bore diameter, 52mm outer diameter, 15mm width, chrome steel material, rubber sealed.'
    }
  },
  {
    id: 'missing',
    title: '2. Missing Attributes',
    badge: 'RAG Auto-Inferred',
    categoryCode: '26-10-15',
    desc: 'Sparse input with missing voltage and RPM. Stage 2 RAG automatically infers baseline.',
    payload: {
      inputType: 'text',
      categoryCode: '26-10-15',
      textContent: '3-Phase AC induction motor, 5.5 kW rated power, TEFC enclosure.'
    }
  },
  {
    id: 'conflicting',
    title: '3. Conflicting Specs',
    badge: 'Source Conflict',
    categoryCode: '31-16-15',
    desc: 'Conflicting diameter dimensions between supplier text (30mm) and spec sheet (10mm).',
    payload: {
      inputType: 'text',
      categoryCode: '31-16-15',
      textContent: 'Hex head bolt M10 x 50mm, Grade 8.8 steel. Note: text mentions 30mm diameter.'
    }
  },
  {
    id: 'low_conf',
    title: '4. Low Confidence',
    badge: 'Needs Review',
    categoryCode: '40-10-15',
    desc: 'Minimal pump fragment triggering low confidence flags and human review requirement.',
    payload: {
      inputType: 'text',
      categoryCode: '40-10-15',
      textContent: 'Small cast iron water pump.'
    }
  },
  {
    id: 'invalid',
    title: '5. Invalid Specification',
    badge: 'Rules Violation',
    categoryCode: '40-14-16',
    desc: 'PVC ball valve with stated max temp 120°C (exceeds PVC thermal limit of 60°C).',
    payload: {
      inputType: 'text',
      categoryCode: '40-14-16',
      textContent: 'Industrial PVC ball valve, 50mm port size, max temperature 120°C.'
    }
  }
];

export default function DemoScenarios({ onSelectScenario, isLoading }) {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-slate-100 font-sans">
            Interactive Judge Demo Scenarios (Click to Execute Live)
          </h3>
        </div>
        <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20 font-bold">
          5 Guided Tests
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {SCENARIOS.map((sc) => (
          <button
            key={sc.id}
            type="button"
            disabled={isLoading}
            onClick={() => onSelectScenario(sc.payload)}
            className="p-3.5 bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left transition-all space-y-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:opacity-50 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300">
                  {sc.title}
                </span>
              </div>
              <span className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-1">
                {sc.badge}
              </span>
              <p className="text-[10px] text-slate-400 font-sans line-clamp-2">
                {sc.desc}
              </p>
            </div>
            <span className="text-[10px] font-bold text-amber-400 group-hover:underline block pt-1">
              Execute Scenario →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
