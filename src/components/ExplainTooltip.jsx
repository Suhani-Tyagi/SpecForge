import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export default function ExplainTooltip({ title, text }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="ml-1 text-slate-400 hover:text-amber-400 transition-colors focus:outline-none"
        title="Click or hover to explain"
        aria-label={`Explain ${title || 'term'}`}
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-slate-200 text-xs rounded-xl shadow-2xl border border-amber-500/40 z-50 font-sans leading-relaxed">
          {title && <div className="font-bold text-amber-400 mb-1 border-b border-slate-800 pb-1">{title}</div>}
          <p>{text}</p>
        </div>
      )}
    </div>
  );
}
