import React, { useState } from 'react';
import { Download, FileJson, FileSpreadsheet, Code, CheckCircle2, ShieldCheck, Copy } from 'lucide-react';

export default function CommerceOutputCenter({ product, onToast }) {
  const [activeFormat, setActiveFormat] = useState('JSON'); // JSON, CSV, API_PAYLOAD

  const pimPayload = {
    pim_record_id: product?.id || "PIM-REC-2026-001",
    sku: product?.sku || "SF-MTR-415V-5HP",
    product_name: product?.name || "Industrial 3-Phase Induction Motor 5HP",
    category_code: product?.categoryCode || "23-15-16",
    category_path: product?.category || "Electric Motors & Drives",
    governance: {
      status: product?.commerceStatus || "READY",
      mean_confidence: product?.confidence || 0.98,
      risk_score: product?.riskScore || 12,
      validated_by: "SpecForge AI Engine + RAG Knowledge Base"
    },
    specifications: product?.attributes || {}
  };

  const jsonStr = JSON.stringify(pimPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonStr);
    if (onToast) onToast("PIM JSON payload copied to clipboard!", "success");
  };

  const handleDownload = () => {
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PIM_Ready_Record_${product?.sku || 'export'}.json`;
    a.click();
    if (onToast) onToast("PIM-ready record downloaded!", "success");
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
            Export validated, PIM-ready product records in standard enterprise schemas.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs border border-slate-700 font-mono"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy JSON</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-emerald-500/20 font-mono"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PIM Payload</span>
          </button>
        </div>
      </div>

      {/* Format Selector Tabs */}
      <div className="flex items-center space-x-2 font-mono text-xs">
        {[
          { id: 'JSON', label: 'PIM-Ready JSON Payload', icon: FileJson },
          { id: 'CSV', label: 'Catalog CSV Export', icon: FileSpreadsheet },
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

      {/* Payload Display Box */}
      <div className="p-4 bg-slate-950/90 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto max-h-[350px]">
        <pre className="text-slate-300 leading-relaxed">
          {activeFormat === 'JSON' && jsonStr}
          {activeFormat === 'CSV' && `SKU,Product_Name,Category_Code,Power,Voltage,Phase,Speed,Protection,Status
${product?.sku || 'SF-MTR-415V-5HP'},"${product?.name || 'Industrial 3-Phase Motor'}","${product?.categoryCode || '23-15-16'}","3.7 kW","415 V","3 Phase","1440 RPM","IP55","${product?.commerceStatus || 'READY'}"`}
          {activeFormat === 'API_PAYLOAD' && `// POST /api/v1/pim/catalog/ingest
{
  "header": {
    "source": "SpecForge AI Engine",
    "timestamp": "${new Date().toISOString()}",
    "auth_token": "Bearer sf_live_ext_884920"
  },
  "payload": ${jsonStr}
}`}
        </pre>
      </div>

    </div>
  );
}
