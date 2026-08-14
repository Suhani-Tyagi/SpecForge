import React from 'react';
import { Copy, AlertTriangle, Eye, CheckCircle2, X } from 'lucide-react';

export default function DuplicateDetector({ record, referenceProducts = [] }) {
  if (!record || !record.product_name) return null;

  const currentName = record.product_name.toLowerCase();
  let bestMatch = null;
  let highestSimilarity = 0;

  referenceProducts.forEach(ref => {
    const refName = ref.name.toLowerCase();
    let score = 0;

    if (currentName.includes(refName) || refName.includes(currentName)) {
      score += 70;
    }

    if (ref.category_code === record.category_code) {
      score += 25;
    }

    if (score > highestSimilarity) {
      highestSimilarity = score;
      bestMatch = ref;
    }
  });

  if (highestSimilarity < 50 || !bestMatch) {
    return null; // No duplicate candidate detected
  }

  return (
    <div className="p-4 bg-amber-950/20 border border-amber-500/40 rounded-xl font-mono text-xs space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-amber-400 font-bold">
          <AlertTriangle className="w-4 h-4" />
          <span>Possible Duplicate Catalog Product Detected ({highestSimilarity}% Similarity)</span>
        </div>
        <span className="text-[10px] text-slate-400">Match ID: {bestMatch.id}</span>
      </div>

      <p className="text-slate-300">
        Product <strong>"{record.product_name}"</strong> matches existing reference product <strong>"{bestMatch.name}"</strong> in category <strong>[{bestMatch.category_code}]</strong>.
      </p>

      <div className="flex items-center space-x-2 pt-1">
        <button
          type="button"
          onClick={() => alert(`Existing Reference Product ${bestMatch.id}:\nName: ${bestMatch.name}\nAttributes: ${JSON.stringify(bestMatch.attributes, null, 2)}`)}
          className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-lg border border-amber-500/30 flex items-center space-x-1"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Existing Candidate</span>
        </button>
        <span className="text-[10px] text-slate-500 italic">Duplicate check is advisory; records will not merge automatically.</span>
      </div>
    </div>
  );
}
