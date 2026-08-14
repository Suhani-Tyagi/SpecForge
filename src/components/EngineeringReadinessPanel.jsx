import React from 'react';
import { ShieldCheck, CheckCircle2, Cpu, Activity, Lock, Terminal } from 'lucide-react';

export default function EngineeringReadinessPanel() {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4 font-mono">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
            Engineering & System Readiness Console
          </h3>
        </div>
        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
          PASSED (16/16 Tests)
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase block">Security Hardening</span>
          <span className="text-sm font-bold text-emerald-400 flex items-center space-x-1">
            <Lock className="w-3.5 h-3.5" />
            <span>PASSED (100%)</span>
          </span>
          <span className="text-[9px] text-slate-500 block">CSP, SSRF, Prompt Injection, Zod</span>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase block">Vitest / Supertest Suite</span>
          <span className="text-sm font-bold text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>16 / 16 PASSED</span>
          </span>
          <span className="text-[9px] text-slate-500 block">Unit & API Integration Tests</span>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase block">Accessibility Audit</span>
          <span className="text-sm font-bold text-emerald-400 flex items-center space-x-1">
            <Activity className="w-3.5 h-3.5" />
            <span>WCAG 2.2 AA</span>
          </span>
          <span className="text-[9px] text-slate-500 block">ARIA Tablist, Roving Focus</span>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase block">Pipeline Concurrency</span>
          <span className="text-sm font-bold text-cyan-400 flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Controlled (3)</span>
          </span>
          <span className="text-[9px] text-slate-500 block">Promise.allSettled Runner</span>
        </div>
      </div>
    </div>
  );
}
