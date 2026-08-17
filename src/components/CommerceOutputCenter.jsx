import React, { useState } from 'react';
import { Download, FileJson, FileSpreadsheet, Code, ShieldCheck, Copy } from 'lucide-react';
import { OFFICIAL_EXPECTED_OUTPUT_HEADERS, serializeToOfficialCSV, mapProductToOfficialRow } from '../../server/schemas/officialOutputSchema.js';

export default function CommerceOutputCenter({ product, onToast }) {
  const [activeFormat, setActiveFormat] = useState('JSON'); // JSON, CSV, API_PAYLOAD

  const officialMapped = mapProductToOfficialRow(product || {});

  const pimPayload = {
    part_number: product?.sku || product?.partNumber || product?.id || "N/A",
    product_name: product?.name || product?.productName || "N/A",
    category_code: product?.categoryCode || product?.UNSPSC || "N/A",
    category_path: product?.category || product?.Classpath || "N/A",
    governance: {
      status: product?.commerceStatus || product?.validation?.status || "READY",
      confidence: product?.confidence || 0.95,
      risk_score: product?.riskScore || 0,
      validated_by: "SpecForge Pipeline Engine"
    },
    official_252_mapped_fields: officialMapped
  };

  const jsonStr = JSON.stringify(pimPayload, null, 2);
  const csvStr = serializeToOfficialCSV(product ? [product] : []);

  const apiPayloadStr = JSON.stringify({
    header: {
      system: "SpecForge Product Intelligence Platform",
      timestamp: new Date().toISOString(),
      schema_version: "2.0-OFFICIAL-252-CONTRACT"
    },
    record: officialMapped
  }, null, 2);

  const getCurrentText = () => {
    if (activeFormat === 'CSV') return csvStr;
    if (activeFormat === 'API_PAYLOAD') return apiPayloadStr;
    return jsonStr;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getCurrentText());
    if (onToast) onToast(`${activeFormat} export payload copied to clipboard!`, 'success');
  };

  const handleDownload = () => {
    const isCsv = activeFormat === 'CSV';
    const content = getCurrentText();
    const mimeType = isCsv ? 'text/csv;charset=utf-8;' : 'application/json';
    const extension = isCsv ? 'csv' : 'json';

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SpecForge_Official_Output_${product?.sku || 'export'}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);

    if (onToast) onToast(`Export downloaded cleanly (${extension.toUpperCase()})!`, 'success');
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-extrabold text-white tracking-tight">COMMERCE OUTPUT & PUBLISH CENTER</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Export validated, catalog-ready product records in the official 252-column competition schema.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700 font-mono"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Payload</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 font-mono"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Official CSV / JSON</span>
          </button>
        </div>
      </div>

      {/* Format Selector Tabs */}
      <div className="flex items-center space-x-2 font-mono text-xs">
        {[
          { id: 'JSON', label: 'PIM-Ready JSON Payload', icon: FileJson },
          { id: 'CSV', label: 'Official 252-Header CSV Export', icon: FileSpreadsheet },
          { id: 'API_PAYLOAD', label: 'REST API Payload Spec', icon: Code }
        ].map(fmt => {
          const Icon = fmt.icon;
          return (
            <button
              key={fmt.id}
              onClick={() => setActiveFormat(fmt.id)}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl font-bold transition-all border ${
                activeFormat === fmt.id
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{fmt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contract Verification Banner */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900/80 rounded-xl border border-slate-800 text-xs font-mono">
        <span className="text-slate-400">Schema Standard:</span>
        <span className="text-emerald-400 font-bold">252 Immutable Competition Output Headers (RFC 4180 Escaped)</span>
      </div>

      {/* Payload Display Box */}
      <div className="p-4 bg-slate-950/90 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto max-h-[350px]">
        <pre className="text-slate-300 leading-relaxed whitespace-pre">
          {getCurrentText()}
        </pre>
      </div>

    </div>
  );
}
