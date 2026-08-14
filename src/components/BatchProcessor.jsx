import React, { useState } from 'react';
import CsvImporter from './CsvImporter.jsx';
import { Rocket, Play, Pause, XCircle, RefreshCw, CheckCircle2, Clock, Upload, ArrowRight } from 'lucide-react';

const INITIAL_SAMPLE_BATCH = [
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

export default function BatchProcessor({ onSelectProductForReview, onToast }) {
  const [batchItems, setBatchItems] = useState(INITIAL_SAMPLE_BATCH);
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [resultsMap, setResultsMap] = useState({});
  const [totalTimeMs, setTotalTimeMs] = useState(0);

  const handleStartBatch = async () => {
    setIsProcessing(true);
    setIsPaused(false);
    setResultsMap({});
    const startOverall = Date.now();

    const MAX_CONCURRENCY = 3;
    const currentResults = {};

    // Process batch items in bounded concurrency pools of 3
    for (let i = 0; i < batchItems.length; i += MAX_CONCURRENCY) {
      if (isPaused) break;

      const chunk = batchItems.slice(i, i + MAX_CONCURRENCY);
      const chunkPromises = chunk.map(async (item) => {
        try {
          const res = await fetch('/api/pipeline/full', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              inputType: 'text',
              textContent: item.textContent,
              categoryCode: item.categoryCode
            })
          });

          const data = await res.json();
          return {
            id: item.id,
            status: 'completed',
            data: data.finalRecord || data,
            latencyMs: data.totalLatencyMs || 1200
          };
        } catch (err) {
          return {
            id: item.id,
            status: 'failed',
            error: err.message
          };
        }
      });

      const settled = await Promise.allSettled(chunkPromises);
      settled.forEach(s => {
        if (s.status === 'fulfilled') {
          currentResults[s.value.id] = s.value;
        }
      });

      setResultsMap({ ...currentResults });
    }

    setIsProcessing(false);
    setTotalTimeMs(Date.now() - startOverall);
    if (onToast) onToast('Batch catalog processing completed!', 'success');
  };

  const handleImportCsv = (importedItems) => {
    setBatchItems(importedItems);
    setResultsMap({});
    if (onToast) onToast(`Imported ${importedItems.length} items from CSV into batch queue!`, 'success');
  };

  const completedCount = Object.values(resultsMap).filter(r => r.status === 'completed').length;
  const failedCount = Object.values(resultsMap).filter(r => r.status === 'failed').length;
  const avgLatency = completedCount > 0 
    ? Math.round(Object.values(resultsMap).reduce((acc, r) => acc + (r.latencyMs || 0), 0) / completedCount) 
    : 0;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6 font-mono">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Rocket className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100">
              Controlled Concurrency Batch Processing Console
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            High-throughput catalog onboarding runner with bounded concurrency (Concurrency: 3).
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowCsvModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 flex items-center space-x-1"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import Catalog CSV</span>
          </button>

          <button
            type="button"
            onClick={handleStartBatch}
            disabled={isProcessing}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center space-x-1 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing (Concurrency: 3)...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Launch Batch Queue ({batchItems.length} Products)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Controlled Metrics Dashboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Queue Size</span>
          <span className="text-lg font-bold text-amber-400">{batchItems.length} Products</span>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Completed / Failed</span>
          <span className="text-lg font-bold text-emerald-400">{completedCount}</span>
          <span className="text-rose-400 font-bold ml-1">/ {failedCount}</span>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Avg Item Latency</span>
          <span className="text-lg font-bold text-cyan-400">{avgLatency > 0 ? `${avgLatency}ms` : '—'}</span>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">Total Batch Time</span>
          <span className="text-lg font-bold text-purple-400">{totalTimeMs > 0 ? `${(totalTimeMs / 1000).toFixed(2)}s` : '—'}</span>
        </div>
      </div>

      {/* Queue Items Monitor */}
      <div className="space-y-2">
        {batchItems.map((item, idx) => {
          const res = resultsMap[item.id];

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition-all ${
                res?.status === 'completed' ? 'bg-slate-950/80 border-emerald-500/40' :
                res?.status === 'failed' ? 'bg-rose-950/20 border-rose-500/40' :
                'bg-slate-950/40 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-amber-300">{item.id}</span>
                    <span className="text-xs font-semibold text-slate-200">{item.name}</span>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-cyan-400">
                      Code: {item.categoryCode}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">"{item.textContent}"</p>
                </div>

                <div className="flex items-center space-x-2">
                  {res?.status === 'completed' && (
                    <>
                      <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completed ({res.latencyMs}ms)</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectProductForReview && onSelectProductForReview(res.data)}
                        className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] rounded-lg border border-amber-500/30 flex items-center space-x-1"
                      >
                        <span>Review</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </>
                  )}

                  {res?.status === 'failed' && (
                    <span className="text-[10px] text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                      Failed: {res.error}
                    </span>
                  )}

                  {!res && (
                    <span className="text-[10px] text-slate-500">Queued</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showCsvModal && (
        <CsvImporter
          onImportBatch={handleImportCsv}
          onClose={() => setShowCsvModal(false)}
        />
      )}
    </div>
  );
}
