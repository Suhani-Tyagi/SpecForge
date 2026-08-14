import React, { useState } from 'react';
import { Layers, Database, ShieldCheck, UserCheck, ChevronRight, Clock, AlertTriangle, CheckCircle, Code, Info } from 'lucide-react';

export default function PipelineVisualizer({ pipelineState, activeStage, onSelectStageForReview }) {
  const [inspectedStage, setInspectedStage] = useState(1);

  const stages = [
    {
      id: 1,
      name: 'Stage 1: AI Raw Extraction',
      subtext: 'Gemini 2.0 Flash (Multimodal)',
      icon: Layers,
      color: 'amber',
      data: pipelineState.stages?.intake,
      latency: pipelineState.stages?.intake?.latencyMs
    },
    {
      id: 2,
      name: 'Stage 2: RAG Enrichment Engine',
      subtext: 'Knowledge Base Retrieval & Inference',
      icon: Database,
      color: 'cyan',
      data: pipelineState.stages?.enrichment,
      latency: pipelineState.stages?.enrichment?.latencyMs
    },
    {
      id: 3,
      name: 'Stage 3: Engineering Validation',
      subtext: 'Consistency Rules & Unit Normalizer',
      icon: ShieldCheck,
      color: 'emerald',
      data: pipelineState.stages?.validation,
      latency: pipelineState.stages?.validation?.latencyMs
    },
    {
      id: 4,
      name: 'Stage 4: Human Approval & Governance',
      subtext: 'HITL Review & Catalog Export',
      icon: UserCheck,
      color: 'purple',
      data: pipelineState.finalRecord,
      latency: pipelineState.totalLatencyMs
    }
  ];

  const getStageStatus = (stageId) => {
    if (pipelineState.isProcessing && activeStage === stageId) return 'running';
    if (pipelineState.completedStages?.includes(stageId)) return 'completed';
    if (pipelineState.error && activeStage === stageId) return 'error';
    return 'idle';
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-5 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-2">
            <span>Architecture Stepper: 3-Stage AI Processing + Human Approval</span>
          </h3>
          <p className="text-[11px] text-slate-400 font-sans mt-0.5">
            Gemini AI executes Stages 1-3. Stage 4 provides Human-In-The-Loop catalog governance.
          </p>
        </div>
        {pipelineState.totalLatencyMs > 0 && (
          <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 font-bold self-start sm:self-auto">
            Total Latency: {pipelineState.totalLatencyMs}ms
          </span>
        )}
      </div>

      {/* Stepper Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stages.map((stg) => {
          const status = getStageStatus(stg.id);
          const Icon = stg.icon;
          const isInspected = inspectedStage === stg.id;

          return (
            <button
              key={stg.id}
              type="button"
              onClick={() => setInspectedStage(stg.id)}
              className={`text-left relative p-3.5 rounded-xl border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                status === 'running'
                  ? 'bg-amber-500/10 border-amber-500 shadow-lg animate-pulse'
                  : status === 'completed'
                  ? 'bg-slate-800/80 border-emerald-500/40 hover:border-emerald-500'
                  : status === 'error'
                  ? 'bg-rose-500/10 border-rose-500'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              } ${isInspected ? 'ring-2 ring-amber-500/50' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-lg ${
                    status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                    status === 'running' ? 'bg-amber-500/20 text-amber-400' :
                    status === 'error' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">
                    {stg.id <= 3 ? `AI Stage ${stg.id}` : 'HITL Stage 4'}
                  </span>
                </div>

                {status === 'running' && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>}
                {status === 'completed' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                {status === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
              </div>

              <h4 className="text-xs font-semibold text-slate-100 line-clamp-1 font-sans">
                {stg.name}
              </h4>
              <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-sans">
                {stg.subtext}
              </p>

              {stg.latency && (
                <div className="mt-2 text-[10px] text-slate-400 flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>{stg.latency}ms</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Stage Data Inspector Drawer */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-4">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase text-slate-200">
              Stage {inspectedStage} Inspector: {stages[inspectedStage - 1].name}
            </h4>
          </div>
          {inspectedStage === 4 && pipelineState.finalRecord && (
            <button
              type="button"
              onClick={() => onSelectStageForReview && onSelectStageForReview()}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-sans"
            >
              <span>Open in HITL Review UI</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {inspectedStage === 1 && (
          <div>
            {pipelineState.stages?.intake ? (
              <div className="space-y-3">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">EXTRACTED PRODUCT NAME</span>
                    <span className="font-bold text-amber-300">
                      {pipelineState.stages.intake.data?.product_name || 'N/A'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">DETECTED CATEGORY</span>
                    <span className="text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                      [{pipelineState.stages.intake.data?.category_code}] {pipelineState.stages.intake.data?.category_name}
                    </span>
                  </div>
                </div>

                <div>
                  <h5 className="text-[11px] font-bold text-slate-400 mb-1.5 flex items-center space-x-1">
                    <Info className="w-3 h-3 text-amber-400" />
                    <span>Raw Extracted Attributes (Sparse fields output as "unknown"):</span>
                  </h5>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(pipelineState.stages.intake.data?.raw_attributes || {}).map(([key, val]) => (
                      <div
                        key={key}
                        className={`p-2 rounded-lg border text-xs ${
                          val === 'unknown'
                            ? 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                            : 'bg-slate-900 border-slate-800 text-slate-200'
                        }`}
                      >
                        <span className="text-[10px] text-slate-400 block">{key}</span>
                        <span className="font-semibold">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">
                Execute pipeline to view raw Gemini extraction output.
              </p>
            )}
          </div>
        )}

        {inspectedStage === 2 && (
          <div>
            {pipelineState.stages?.enrichment ? (
              <div className="space-y-3">
                <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-lg flex items-center justify-between text-xs">
                  <span className="text-cyan-300">
                    RAG Knowledge Base Context Applied: {pipelineState.stages.enrichment.ragContextUsed?.referenceProductsCount || 0} Reference Products & Taxonomy Defaults
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Latency: {pipelineState.stages.enrichment.latencyMs}ms
                  </span>
                </div>

                <div className="space-y-2">
                  {Object.entries(pipelineState.stages.enrichment.data?.enriched_attributes || {}).map(([key, attr]) => (
                    <div key={key} className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-200">{key}</span>
                        <span className="block text-amber-300">
                          Value: {String(attr.value)} {attr.normalized_value && attr.normalized_unit ? `(${attr.normalized_value} ${attr.normalized_unit})` : ''}
                        </span>
                        <p className="text-[10px] text-slate-400 italic">
                          Reasoning: "{attr.reasoning}"
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          attr.confidence === 'high' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          attr.confidence === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {attr.confidence} confidence
                        </span>
                        <span className="text-[9px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                          {attr.source}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">
                Stage 2 RAG enrichment will infer missing attributes using knowledge base context.
              </p>
            )}
          </div>
        )}

        {inspectedStage === 3 && (
          <div>
            {pipelineState.stages?.validation ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-1 rounded-md font-bold uppercase ${
                      pipelineState.stages.validation.data?.validation?.status === 'valid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      pipelineState.stages.validation.data?.validation?.status === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      Status: {pipelineState.stages.validation.data?.validation?.status}
                    </span>
                    <span className="text-slate-300">
                      Quality Score: <strong>{pipelineState.stages.validation.data?.validation?.quality_score}/100</strong>
                    </span>
                  </div>
                </div>

                {pipelineState.stages.validation.data?.validation?.rule_violations?.length > 0 ? (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-rose-400 block">
                      Consistency Rule Violations / Warnings Detected:
                    </span>
                    {pipelineState.stages.validation.data.validation.rule_violations.map((v, i) => (
                      <div key={i} className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-lg text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-rose-300">[{v.severity?.toUpperCase()}] Field: {v.field}</span>
                          <span className="text-[10px] text-slate-400">{v.rule}</span>
                        </div>
                        <p className="text-slate-300 text-[11px]">{v.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg text-xs text-emerald-300 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>All consistency rules passed cleanly with 0 physical dimension violations!</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">
                Stage 3 validates attributes against consistency rules from specforge-knowledge-base.json.
              </p>
            )}
          </div>
        )}

        {inspectedStage === 4 && (
          <div>
            {pipelineState.finalRecord ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-300 font-sans">
                  Final Traceable Product Intelligence Record ready for Human-In-The-Loop Review and Catalog export.
                </p>
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-[11px] text-emerald-300 max-h-60 overflow-y-auto">
                  <pre>{JSON.stringify(pipelineState.finalRecord, null, 2)}</pre>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">
                Run pipeline to generate complete traceable record.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
