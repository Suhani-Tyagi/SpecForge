import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

export default function DataDiffView({ stagesData, attributesState = {} }) {
  if (!stagesData) return null;

  const rawInput = stagesData.intake?.data?.extraction_summary || 'Raw supplier content';
  const extractedAttrs = stagesData.intake?.data?.raw_attributes || {};
  const enrichedAttrs = stagesData.enrichment?.data?.enriched_attributes || {};

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold font-mono text-slate-100 uppercase tracking-wide">
            Before / After Transformation Data Diff
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Traceability progression from raw input to catalog ready
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
            <tr>
              <th className="p-3">Attribute</th>
              <th className="p-3">Stage 1: Raw Extracted</th>
              <th className="p-3">Stage 2: RAG Enriched</th>
              <th className="p-3">Normalized Value</th>
              <th className="p-3">Stage 4: Human Approved</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900/40">
            {Object.keys(enrichedAttrs).map(key => {
              const rawVal = extractedAttrs[key] || 'unknown';
              const enrichItem = enrichedAttrs[key] || {};
              const enrichVal = typeof enrichItem === 'object' ? enrichItem.value : enrichItem;
              const normVal = enrichItem.normalized_value;
              const normUnit = enrichItem.normalized_unit;

              const humanItem = attributesState[key] || {};
              const humanVal = humanItem.value !== undefined ? humanItem.value : enrichVal;

              const wasInferred = rawVal === 'unknown' && enrichVal !== 'unknown';
              const wasHumanEdited = humanItem.status === 'edited';

              return (
                <tr key={key} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-bold text-slate-200">{key}</td>

                  {/* Stage 1 Raw */}
                  <td className="p-3">
                    {rawVal === 'unknown' ? (
                      <span className="px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-900/40 text-[10px]">
                        unknown
                      </span>
                    ) : (
                      <span className="text-slate-300">{String(rawVal)}</span>
                    )}
                  </td>

                  {/* Stage 2 Enriched */}
                  <td className="p-3">
                    {wasInferred ? (
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold text-[11px] flex items-center space-x-1 w-fit">
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        <span>{String(enrichVal)}</span>
                      </span>
                    ) : (
                      <span className="text-slate-300">{String(enrichVal)}</span>
                    )}
                  </td>

                  {/* Normalized Unit */}
                  <td className="p-3">
                    {normVal && normUnit ? (
                      <span className="px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 border border-cyan-800/40 text-[10px]">
                        {normVal} {normUnit}
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>

                  {/* Stage 4 Human Approved */}
                  <td className="p-3">
                    {wasHumanEdited ? (
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold text-[11px]">
                        ✏️ {String(humanVal)}
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-semibold">{String(humanVal)}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
