import React, { useState } from 'react';
import { Download, Copy, FileJson, FileSpreadsheet, X, Check } from 'lucide-react';

export default function ExportModal({ exportData, onClose, onToast }) {
  const [exportFormat, setExportFormat] = useState('json'); // 'json', 'csv', 'pim'
  const [exportApprovedOnly, setExportApprovedOnly] = useState(true);
  const [copied, setCopied] = useState(false);

  if (!exportData) return null;

  const handleCopy = () => {
    let content = '';
    if (exportFormat === 'csv') {
      const headers = ['specforge_id', 'product_name', 'category_code', 'quality_score', 'attribute', 'value'];
      const rows = [headers.join(',')];
      Object.entries(exportData.attributes || {}).forEach(([k, v]) => {
        rows.push(`"${exportData.specforge_id}","${exportData.product_name}","${exportData.category_code}",${exportData.quality_score},"${k}","${v}"`);
      });
      content = rows.join('\n');
    } else {
      content = JSON.stringify(exportData, null, 2);
    }

    navigator.clipboard.writeText(content);
    setCopied(true);
    if (onToast) onToast('Export content copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    let content = '';
    let mime = 'application/json';
    let ext = 'json';

    if (exportFormat === 'csv') {
      const headers = ['specforge_id', 'product_name', 'category_code', 'quality_score', 'attribute', 'value'];
      const rows = [headers.join(',')];
      Object.entries(exportData.attributes || {}).forEach(([k, v]) => {
        rows.push(`"${exportData.specforge_id}","${exportData.product_name}","${exportData.category_code}",${exportData.quality_score},"${k}","${v}"`);
      });
      content = rows.join('\n');
      mime = 'text/csv';
      ext = 'csv';
    } else {
      content = JSON.stringify(exportData, null, 2);
    }

    const dataStr = `data:${mime};charset=utf-8,` + encodeURIComponent(content);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `specforge-catalog-${exportData.category_code}.${ext}`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    if (onToast) onToast(`Catalog exported successfully as .${ext}`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl font-mono">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <FileJson className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase">
              Export Commerce-Ready Catalog Feed
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-300">Select Export Format:</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setExportFormat('json')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center space-y-1 ${
                exportFormat === 'json' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <FileJson className="w-4 h-4" />
              <span>Catalog JSON</span>
            </button>

            <button
              type="button"
              onClick={() => setExportFormat('csv')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center space-y-1 ${
                exportFormat === 'csv' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>CSV Matrix</span>
            </button>

            <button
              type="button"
              onClick={() => setExportFormat('pim')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center space-y-1 ${
                exportFormat === 'pim' ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <FileJson className="w-4 h-4 text-cyan-400" />
              <span>PIM / Akeneo Feed</span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={exportApprovedOnly}
              onChange={(e) => setExportApprovedOnly(e.target.checked)}
              className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0"
            />
            <span>Export human-approved and accepted fields only (Excludes rejected attributes)</span>
          </label>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 bg-slate-800 text-slate-200 text-xs rounded-xl hover:bg-slate-700 flex items-center space-x-1"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs rounded-xl flex items-center space-x-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Catalog Export</span>
          </button>
        </div>
      </div>
    </div>
  );
}
