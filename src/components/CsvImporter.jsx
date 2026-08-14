import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertTriangle, X, Play } from 'lucide-react';

export default function CsvImporter({ onImportBatch, onClose }) {
  const [parsedRows, setParsedRows] = useState([]);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(l => l.trim());
      if (lines.length <= 1) return;

      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const rows = [];

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        if (cols.length >= 2) {
          const rowObj = {};
          headers.forEach((h, idx) => {
            rowObj[h] = cols[idx] || '';
          });

          const name = rowObj.product_name || rowObj.name || cols[0];
          const cat = rowObj.category_code || rowObj.category || cols[1] || '31-16-15';
          const content = rowObj.description || rowObj.specifications || cols.slice(2).join(' ') || name;

          rows.push({
            id: `CSV-${i}`,
            name,
            categoryCode: cat,
            textContent: content,
            isValid: Boolean(name && content)
          });
        }
      }

      setParsedRows(rows);
    };

    reader.readAsText(file);
  };

  const validCount = parsedRows.filter(r => r.isValid).length;

  const handleConfirmImport = () => {
    if (validCount === 0) return;
    const validItems = parsedRows.filter(r => r.isValid);
    onImportBatch(validItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl font-mono">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase">
              Batch CSV Catalog Importer
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {parsedRows.length === 0 ? (
          <div className="border-2 border-dashed border-slate-700 hover:border-amber-500 rounded-xl p-8 text-center bg-slate-950">
            <label className="cursor-pointer block">
              <Upload className="w-10 h-10 text-amber-400 mx-auto mb-2" />
              <span className="text-xs text-slate-200 font-bold block">Upload Supplier Catalog CSV</span>
              <span className="text-[10px] text-slate-500 block mt-1">
                Expected columns: product_name, category_code, description, manufacturer, sku
              </span>
              <input type="file" accept=".csv,text/csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <span>File: <strong>{fileName}</strong></span>
              <span className="text-emerald-400 font-bold">{validCount} Valid Rows Detected</span>
            </div>

            <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                  <tr>
                    <th className="p-2.5">ID</th>
                    <th className="p-2.5">Product Name</th>
                    <th className="p-2.5">Category</th>
                    <th className="p-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900">
                  {parsedRows.map(row => (
                    <tr key={row.id}>
                      <td className="p-2.5 text-slate-400">{row.id}</td>
                      <td className="p-2.5 text-slate-200">{row.name}</td>
                      <td className="p-2.5 text-cyan-400">{row.categoryCode}</td>
                      <td className="p-2.5">
                        {row.isValid ? (
                          <span className="text-emerald-400 text-[10px]">✓ Valid</span>
                        ) : (
                          <span className="text-rose-400 text-[10px]">⚠ Missing required fields</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center space-x-1"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Import {validCount} Products into Batch Queue</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
