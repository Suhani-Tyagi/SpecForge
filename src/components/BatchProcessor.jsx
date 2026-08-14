import React, { useState } from 'react';
import { Rocket, Play, CheckCircle, Clock, Layers, ShieldCheck, ArrowRight, RefreshCw, BarChart2 } from 'lucide-react';

const SAMPLE_BATCH = [
  {
    id: 'BATCH-001',
    name: 'Heavy Duty Casters 100mm',
    categoryCode: '24-10-20',
    textContent: 'Swivel casters with total lock brake, 100mm wheel diameter, polyurethane wheel, plate mount.'
  },
  {
    id: 'BATCH-002',
    name: 'Industrial Control Cable',
    categoryCode: '39-12-10',
    textContent: 'Control cable 4-core 1.5mm2 copper conductor PVC insulation 450V.'
  },
  {
    id: 'BATCH-003',
    name: 'Inductive Proximity Sensor',
    categoryCode: '41-11-10',
    textContent: 'Proximity sensor M12 PNP NO output 24V DC 4mm sensing range IP67 rating.'
  },
  {
    id: 'BATCH-004',
    name: 'Single Pole MCB Circuit Breaker',
    categoryCode: '39-12-15',
    textContent: 'MCB circuit breaker 32A 240V 1-pole DIN rail mount Type C curve.'
  }
];

export default function BatchProcessor({ onSelectProductForReview }) {
  const [batchItems, setBatchItems] = useState(SAMPLE_BATCH);
  const [processingState, setProcessingState] = useState({
    isProcessing: false,
    currentIndex: -1,
    results: {},
    totalTimeMs: 0
  });

  const handleStartBatch = async () => {
    setProcessingState({
      isProcessing: true,
      currentIndex: 0,
      results: {},
      totalTimeMs: 0
    });

    const startOverall = Date.now();
    const resultsMap = {};

    for (let i = 0; i < batchItems.length; i++) {
      const item = batchItems[i];
      setProcessingState(prev => ({ ...prev, currentIndex: i }));

      try {
        const response = await fetch('/api/pipeline/full', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            inputType: 'text',
            textContent: item.textContent,
            categoryCode: item.categoryCode
          })
        });

        const data = await response.json();
        resultsMap[item.id] = {
          status: 'completed',
          data: data.finalRecord || data,
          latencyMs: data.totalLatencyMs || 1200
        };
      } catch (err) {
        resultsMap[item.id] = {
          status: 'error',
          error: err.message
        };
      }

      setProcessingState(prev => ({
        ...prev,
        results: { ...resultsMap }
      }));
    }

    setProcessingState(prev => ({
      ...prev,
      isProcessing: false,
      currentIndex: -1,
      totalTimeMs: Date.now() - startOverall
    }));
  };

  const completedCount = Object.values(processingState.results).filter(r => r.status === 'completed').length;
  const avgLatency = completedCount > 0 
    ? Math.round(Object.values(processingState.results).reduce((acc, r) => acc + (r.latencyMs || 0), 0) / completedCount) 
    : 0;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-6">
      
      {/* Title & Scalability Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Rocket className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100 font-mono">
              Scalability Demo: Parallel Industrial Catalog Processing
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Simulate high-throughput catalog onboarding across fragmented supplier spec feeds.
          </p>
        </div>

        <button
          onClick={handleStartBatch}
          disabled={processingState.isProcessing}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs font-mono shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          {processingState.isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Processing Batch Queue...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Launch Batch Processing ({batchItems.length} Products)</span>
            </>
          )}
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono">
          <span className="text-[10px] text-slate-400 uppercase">Batch Size</span>
          <p className="text-lg font-bold text-amber-400 mt-0.5">{batchItems.length} Products</p>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono">
          <span className="text-[10px] text-slate-400 uppercase">Completed</span>
          <p className="text-lg font-bold text-emerald-400 mt-0.5">{completedCount} / {batchItems.length}</p>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono">
          <span className="text-[10px] text-slate-400 uppercase">Avg Latency / Item</span>
          <p className="text-lg font-bold text-cyan-400 mt-0.5">{avgLatency > 0 ? `${avgLatency}ms` : '—'}</p>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono">
          <span className="text-[10px] text-slate-400 uppercase">Total Execution Time</span>
          <p className="text-lg font-bold text-purple-400 mt-0.5">{processingState.totalTimeMs > 0 ? `${(processingState.totalTimeMs / 1000).toFixed(2)}s` : '—'}</p>
        </div>
      </div>

      {/* Queue Items List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-300 font-mono uppercase">
          Batch Queue Processing Monitor
        </h3>

        <div className="space-y-2">
          {batchItems.map((item, idx) => {
            const result = processingState.results[item.id];
            const isCurrent = processingState.currentIndex === idx;

            return (
              <div
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-amber-500/10 border-amber-500 shadow-md animate-pulse-glow'
                    : result?.status === 'completed'
                    ? 'bg-slate-950/80 border-emerald-500/40 hover:border-emerald-500'
                    : 'bg-slate-950/40 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold font-mono text-slate-200">{item.id}</span>
                      <span className="text-xs font-bold text-amber-300">{item.name}</span>
                      <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                        Code: {item.categoryCode}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono line-clamp-1">
                      "{item.textContent}"
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Status Badge */}
                    {isCurrent && (
                      <span className="inline-flex items-center space-x-1 text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Processing AI Stage 1-3...</span>
                      </span>
                    )}

                    {result?.status === 'completed' && (
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center space-x-1 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Done ({result.latencyMs}ms)</span>
                        </span>
                        <button
                          onClick={() => onSelectProductForReview && onSelectProductForReview(result.data)}
                          className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-mono rounded-lg border border-amber-500/30 flex items-center space-x-1"
                        >
                          <span>Review</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {!isCurrent && !result && (
                      <span className="text-xs font-mono text-slate-500">
                        Queued
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
