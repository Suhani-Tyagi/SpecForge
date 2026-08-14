import React, { useState, useEffect } from 'react';
import { Check, X, Edit2, Download, Copy, RefreshCw, ShieldCheck, AlertCircle, CheckCircle2, FileJson, Sparkles } from 'lucide-react';

export default function ReviewUI({ initialRecord, onSaveRecord }) {
  const [record, setRecord] = useState(initialRecord || null);
  const [attributesState, setAttributesState] = useState({});
  const [copied, setCopied] = useState(false);
  const [editModeKey, setEditModeKey] = useState(null);
  const [tempEditValue, setTempEditValue] = useState('');

  useEffect(() => {
    if (initialRecord) {
      setRecord(initialRecord);
      const attrs = initialRecord.attributes || initialRecord.enriched_attributes || {};
      const initialStates = {};

      Object.entries(attrs).forEach(([key, item]) => {
        initialStates[key] = {
          value: typeof item === 'object' ? item.value : item,
          confidence: typeof item === 'object' ? (item.confidence || 'medium') : 'high',
          source: typeof item === 'object' ? (item.source || 'extracted') : 'extracted',
          reasoning: typeof item === 'object' ? (item.reasoning || 'Extracted attribute') : 'Extracted',
          status: 'pending' // 'accepted', 'rejected', 'edited', 'pending'
        };
      });

      setAttributesState(initialStates);
    }
  }, [initialRecord]);

  if (!record) {
    return (
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-12 text-center shadow-xl">
        <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-300 font-mono">No Product Selected for Review</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Process a product through the Pipeline Studio or select an item from the Batch Scalability Demo to launch the Human-In-The-Loop review interface.
        </p>
      </div>
    );
  }

  const handleAction = (key, action) => {
    setAttributesState(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        status: action
      }
    }));
  };

  const handleSaveEdit = (key) => {
    setAttributesState(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: tempEditValue,
        status: 'edited',
        reasoning: `Human override: Updated value to "${tempEditValue}"`
      }
    }));
    setEditModeKey(null);
  };

  const handleBulkAcceptHighConfidence = () => {
    setAttributesState(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(k => {
        if (updated[k].confidence === 'high') {
          updated[k].status = 'accepted';
        }
      });
      return updated;
    });
  };

  const handleBulkAcceptAll = () => {
    setAttributesState(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(k => {
        updated[k].status = 'accepted';
      });
      return updated;
    });
  };

  // Generate clean PIM / Commerce Catalog JSON Feed
  const exportCleanJSON = () => {
    const cleanAttributes = {};
    Object.entries(attributesState).forEach(([key, item]) => {
      if (item.status !== 'rejected') {
        cleanAttributes[key] = item.value;
      }
    });

    return {
      specforge_id: `SF-PROD-${Date.now().toString().slice(-6)}`,
      product_name: record.product_name,
      category_code: record.category_code,
      category_name: record.category_name,
      quality_score: record.validation?.quality_score || 90,
      validation_status: record.validation?.status || 'valid',
      attributes: cleanAttributes,
      audit_traceability: attributesState,
      exported_at: new Date().toISOString()
    };
  };

  const handleCopyJSON = () => {
    const data = JSON.stringify(exportCleanJSON(), null, 2);
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportCleanJSON(), null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `specforge-catalog-${record.category_code}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const acceptedCount = Object.values(attributesState).filter(a => a.status === 'accepted' || a.status === 'edited').length;
  const rejectedCount = Object.values(attributesState).filter(a => a.status === 'rejected').length;
  const totalCount = Object.keys(attributesState).length;

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-slate-100 font-mono">
              {record.product_name || 'Industrial Product Record'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Category: <strong className="text-cyan-300">[{record.category_code}] {record.category_name}</strong>
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleBulkAcceptHighConfidence}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold font-mono border border-slate-700 transition-all flex items-center space-x-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Accept All High Conf</span>
          </button>
          <button
            onClick={handleBulkAcceptAll}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold font-mono border border-emerald-500/30 transition-all flex items-center space-x-1"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Accept All ({acceptedCount}/{totalCount})</span>
          </button>
        </div>
      </div>

      {/* Validation Alert Box if violations exist */}
      {record.validation?.rule_violations?.length > 0 && (
        <div className="p-3.5 bg-rose-950/20 border border-rose-900/40 rounded-xl space-y-2">
          <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs font-mono">
            <AlertCircle className="w-4 h-4" />
            <span>Knowledge Base Consistency Rules Flagged Concerns ({record.validation.rule_violations.length}):</span>
          </div>
          {record.validation.rule_violations.map((rule, idx) => (
            <p key={idx} className="text-xs text-slate-300 pl-6 font-mono">
              • <strong>[{rule.field}]</strong>: {rule.message}
            </p>
          ))}
        </div>
      )}

      {/* Interactive Attribute Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
            <tr>
              <th className="p-3">Attribute</th>
              <th className="p-3">Value</th>
              <th className="p-3">Confidence</th>
              <th className="p-3">Source & Reasoning</th>
              <th className="p-3 text-right">Human Review Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900/40">
            {Object.entries(attributesState).map(([key, attr]) => {
              const isEditing = editModeKey === key;

              return (
                <tr
                  key={key}
                  className={`transition-colors ${
                    attr.status === 'accepted' ? 'bg-emerald-950/10' :
                    attr.status === 'rejected' ? 'bg-rose-950/20 opacity-60' :
                    attr.status === 'edited' ? 'bg-amber-950/20' : 'hover:bg-slate-800/30'
                  }`}
                >
                  {/* Attribute Key */}
                  <td className="p-3 font-mono font-bold text-slate-200">
                    {key}
                  </td>

                  {/* Value / Edit Input */}
                  <td className="p-3 font-mono">
                    {isEditing ? (
                      <div className="flex items-center space-x-1">
                        <input
                          type="text"
                          value={tempEditValue}
                          onChange={(e) => setTempEditValue(e.target.value)}
                          className="bg-slate-950 border border-amber-500 rounded px-2 py-1 text-xs text-slate-100 focus:outline-none"
                        />
                        <button
                          onClick={() => handleSaveEdit(key)}
                          className="p-1 bg-amber-500 text-slate-950 rounded hover:bg-amber-400"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className={`font-semibold ${
                        attr.status === 'rejected' ? 'line-through text-slate-500' : 'text-amber-300'
                      }`}>
                        {String(attr.value)}
                      </span>
                    )}
                  </td>

                  {/* Confidence Badge */}
                  <td className="p-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      attr.confidence === 'high' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      attr.confidence === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {attr.confidence}
                    </span>
                  </td>

                  {/* Source & Reasoning */}
                  <td className="p-3 space-y-0.5">
                    <span className="inline-block text-[9px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {attr.source}
                    </span>
                    <p className="text-[10px] text-slate-400 italic line-clamp-2">
                      {attr.reasoning}
                    </p>
                  </td>

                  {/* Action Buttons */}
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => handleAction(key, 'accepted')}
                        title="Accept attribute"
                        className={`p-1.5 rounded-lg transition-all ${
                          attr.status === 'accepted'
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-slate-700'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          setEditModeKey(key);
                          setTempEditValue(String(attr.value));
                        }}
                        title="Edit value"
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleAction(key, 'rejected')}
                        title="Reject attribute"
                        className={`p-1.5 rounded-lg transition-all ${
                          attr.status === 'rejected'
                            ? 'bg-rose-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700'
                        }`}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Export Section */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileJson className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-slate-200 font-mono uppercase">
              Export Commerce-Ready PIM / Catalog Feed
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyJSON}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono rounded-lg border border-slate-700 transition-all flex items-center space-x-1"
            >
              <Copy className="w-3.5 h-3.5 text-cyan-400" />
              <span>{copied ? 'Copied to Clipboard!' : 'Copy PIM JSON'}</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs font-mono rounded-lg shadow-md shadow-amber-500/20 transition-all flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Catalog JSON</span>
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 font-mono">
          Exported record contains only human-validated and accepted fields with complete source traceability metadata.
        </p>
      </div>

    </div>
  );
}
