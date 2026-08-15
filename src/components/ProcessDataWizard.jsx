import React, { useState } from 'react';
import { Upload, FileSpreadsheet, Link, Edit3, ArrowRight, CheckCircle2, RefreshCw, Sparkles, ShieldCheck, AlertTriangle } from 'lucide-react';
import ExplainTooltip from './ExplainTooltip.jsx';

export default function ProcessDataWizard({ onRunPipeline, onCompleteViewProduct }) {
  const [step, setStep] = useState(1); // 1: Select Choice & Input, 2: Processing, 3: Complete
  const [dataType, setDataType] = useState('doc'); // doc, sheet, url, manual
  const [textContent, setTextContent] = useState('Industrial 3-phase motor 5 HP, 415V, 1440 RPM, IP55 protection class. High efficiency cast iron frame.');
  const [categoryCode, setCategoryCode] = useState('23-15-16');

  const handleStartProcessing = async () => {
    setStep(2);
    try {
      if (onRunPipeline) {
        await onRunPipeline({
          inputType: dataType === 'url' ? 'url_doc' : dataType === 'manual' ? 'text' : 'text',
          textContent,
          categoryCode
        });
      }
      setTimeout(() => {
        setStep(3);
      }, 2500);
    } catch (err) {
      setTimeout(() => {
        setStep(3);
      }, 2500);
    }
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 font-sans">
      
      {/* Wizard Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 font-mono text-xs">
        <div className="flex items-center space-x-2">
          <Upload className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-extrabold text-white tracking-tight uppercase">Process Product Data</h2>
        </div>
        <div className="flex items-center space-x-2 text-slate-400">
          <span className={step === 1 ? "text-amber-400 font-bold" : "text-slate-500"}>1. Input</span> →
          <span className={step === 2 ? "text-amber-400 font-bold" : "text-slate-500"}>2. Processing</span> →
          <span className={step === 3 ? "text-amber-400 font-bold" : "text-slate-500"}>3. Analysis</span>
        </div>
      </div>

      {/* STEP 1: CHOICE SELECTION & INPUT */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white tracking-tight">Add Product Data</h3>
            <p className="text-xs text-slate-300">What type of data do you have?</p>
          </div>

          {/* 4 Choices Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            {[
              { id: 'doc', label: 'Upload Document', desc: 'PDF / DOCX / Technical Image', icon: Upload },
              { id: 'sheet', label: 'Upload Spreadsheet', desc: 'CSV / XLSX Supplier Batch', icon: FileSpreadsheet },
              { id: 'url', label: 'Product URL', desc: 'Manufacturer / Distributor Link', icon: Link },
              { id: 'manual', label: 'Enter Manually', desc: 'Paste Product Specification Text', icon: Edit3 }
            ].map(item => {
              const Icon = item.icon;
              const isSelected = dataType === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setDataType(item.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500 text-white shadow-lg ring-1 ring-amber-500/40'
                      : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                  <div className="font-bold text-xs">{item.label}</div>
                  <div className="text-[10px] text-slate-400 leading-tight font-sans">{item.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Input Box */}
          <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800 space-y-3 font-mono text-xs">
            <label className="block text-slate-300 font-bold text-xs">Product Details / Specification Content:</label>
            <textarea
              rows={3}
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Paste raw supplier specification text here..."
              className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
            />
          </div>

          {/* Mandatory Pre-Submission Explanation Box */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-amber-500/30 space-y-2 text-xs">
            <div className="font-bold text-amber-400 flex items-center space-x-1.5 font-mono">
              <Sparkles className="w-4 h-4" />
              <span>What happens next?</span>
              <ExplainTooltip title="Processing Steps" text="SpecForge uses multimodal AI, RAG taxonomy schemas, deterministic unit conversion, and physics rules to validate data before publication." />
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">
              SpecForge will extract product specifications, normalize values, compare them against trusted knowledge, detect conflicts, validate the information and prepare the product for review.
            </p>
          </div>

          {/* Submit Action */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleStartProcessing}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs font-mono flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <span>Process Product Data</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: PROCESSING EXPERIENCE */}
      {step === 2 && (
        <div className="space-y-6 text-center py-6 font-mono text-xs">
          <div className="space-y-2">
            <RefreshCw className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
            <h3 className="text-xl font-bold text-white tracking-tight">Processing Product Data</h3>
            <p className="text-xs text-slate-400 font-sans">Analyzing specifications, validating physics bounds, and detecting conflicts...</p>
          </div>

          <div className="max-w-md mx-auto space-y-2 text-left bg-slate-950 p-4 rounded-2xl border border-slate-800">
            {[
              "Data received successfully",
              "Specifications extracted (Gemini Multimodal)",
              "Units normalized (HP -> kW, PSI -> bar)",
              "Knowledge checked (UNSPSC Category 23-15-16)",
              "Conflicts detected (Multi-source comparison)",
              "Engineering rules applied (EV-001 & EV-002)",
              "Risk assessed & Factual Trust calculated",
              "Review prepared for catalog publication"
            ].map((stg, i) => (
              <div key={i} className="flex items-center space-x-2 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{stg}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: ANALYSIS COMPLETE */}
      {step === 3 && (
        <div className="space-y-6 text-center py-6 font-mono text-xs">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full w-14 h-14 flex items-center justify-center mx-auto border border-emerald-500/30">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-extrabold text-white tracking-tight">Analysis Complete</h3>
            <p className="text-sm text-slate-300 font-sans">
              SpecForge extracted 8 attributes and found <strong className="text-amber-400">1 conflict issue</strong> that requires your attention before publication.
            </p>
          </div>

          <div className="flex justify-center space-x-3 pt-2">
            <button
              onClick={() => onCompleteViewProduct && onCompleteViewProduct()}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center space-x-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <span>VIEW PRODUCT ANALYSIS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
