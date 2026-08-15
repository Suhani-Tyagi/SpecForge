import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw, CheckCircle2, AlertTriangle, ShieldCheck, Zap, Cpu, ArrowRight, Award, FileText, ArrowLeft, BarChart3, Database, ShieldAlert, Scale, Lock } from 'lucide-react';

export default function JudgeMode({ onClose, onSelectProductForReview }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const steps = [
    {
      title: "01. INGEST SUPPLIER DATA",
      criterion: "Technical Implementation",
      badge: "Multimodal Ingestion",
      summary: "Ingesting raw supplier inputs across PDF datasheets, distributor text, and REST API snippets.",
      details: {
        sourceA: "Manufacturer Datasheet (ED-MTR-2026.pdf): '5 HP, 415V, 3-Phase, 1440 RPM, IP55 Enclosure'",
        sourceB: "Distributor Web Portal (JSON): '5 HP, 380V, 3-Phase, 1450 RPM, IP54 Enclosure'"
      },
      nextGuide: "Click 'Next Step' to launch Gemini 2.0 Multimodal Spec Extraction →",
      explanation: "Real industrial supply chains present contradictory specs across datasheets, web listings, and ERP exports. SpecForge unifies these raw streams."
    },
    {
      title: "02. AI EXTRACTS SPECIFICATIONS",
      criterion: "Innovation",
      badge: "Gemini 2.0 Flash",
      summary: "AI Engine extracts technical attributes with per-field confidence scoring and spatial source text offsets.",
      extracted: [
        { key: "Power", valA: "3.7 kW (5 HP)", valB: "3.7 kW (5 HP)", conf: 99 },
        { key: "Voltage", valA: "415 V", valB: "380 V", conf: 68, alert: true },
        { key: "Speed", valA: "1440 RPM", valB: "1450 RPM", conf: 74, alert: true },
        { key: "Enclosure", valA: "IP55", valB: "IP54", conf: 70, alert: true }
      ],
      nextGuide: "Click 'Next Step' to apply RAG Domain Vector Taxonomy check →",
      explanation: "Gemini multimodal models extract technical values alongside contextual spatial evidence from PDF pages and tables."
    },
    {
      title: "03. RAG ENRICHMENT",
      criterion: "Technical Implementation",
      badge: "Domain Vector Taxonomy",
      summary: "Matching extracted product against UNSPSC Category 23-15-16 (Electric Motors & Drives) schema & baseline standards.",
      kbMatch: "Category Schema 23-15-16 matched with 98.4% taxonomy fit. Nominal voltage standard: 415V/50Hz (IEC 60034).",
      nextGuide: "Click 'Next Step' to run Automated Unit Normalization →",
      explanation: "RAG ground truth prevents AI hallucinations by binding extractions to authoritative domain standards."
    },
    {
      title: "04. UNIT NORMALIZATION",
      criterion: "Technical Implementation",
      badge: "Deterministic Normalizer",
      summary: "Converting non-standard units (e.g. 5 HP -> 3.7 kW, 1440 r/min -> 1440 RPM, 600 PSI -> 41.3 bar).",
      normalizations: [
        "5 HP → 3.7 kW (ISO Standard SI Unit)",
        "415 Volts AC → 415 V (Normalized String)",
        "3 Phase → 3 Phase"
      ],
      nextGuide: "Click 'Next Step' to run Conflict Detection Engine →",
      explanation: "Ensures catalog uniformity so industrial buyers can filter and compare products seamlessly."
    },
    {
      title: "05. CONFLICT DETECTION",
      criterion: "Innovation",
      badge: "Source Discrepancy Engine",
      summary: "Detecting primary voltage conflict: Manufacturer Datasheet (415V) vs Distributor Web API (380V).",
      conflict: "CRITICAL CONFLICT: Voltage field has opposing values from 2 valid sources.",
      nextGuide: "Click 'Next Step' to launch AI Challenger critique →",
      explanation: "Flagging contradictions automatically prevents incorrect spec listing in buyer procurement catalogs."
    },
    {
      title: "06. AI CHALLENGER STAGE",
      criterion: "Innovation",
      badge: "AI Challenger Critique",
      summary: "AI Challenger actively looks for reasons the extracted value could be wrong or conflicting.",
      critique: "ALERT: Distributor API (380V) contradicts Manufacturer PDF (415V). Invoking Source Authority SA-02.",
      nextGuide: "Click 'Next Step' to run Engineering Physics Validation →",
      explanation: "AI Challenger acts as a devil's advocate, challenging raw extractions against physics and authority matrix."
    },
    {
      title: "07. ENGINEERING VALIDATION",
      criterion: "Technical Implementation",
      badge: "Physics Rule Engine EV-002",
      summary: "Running deterministic engineering validation rules to detect physical and electrical impossibilities.",
      checks: [
        "EV-001: 5 HP motor power matches 3.7 kW rating ✓ PASSED",
        "EV-002: Nominal voltage 415V within standard 400-440V industrial range ✓ PASSED",
        "EV-003: Slip speed check (1440 RPM for 4-pole 50Hz motor) ✓ PASSED"
      ],
      nextGuide: "Click 'Next Step' to inspect SpecForensics Evidence Graph →",
      explanation: "AI recommendations are gated by deterministic engineering physics validation before catalog publication."
    },
    {
      title: "08. EVIDENCE GRAPH & SPECFORENSICS",
      criterion: "Innovation",
      badge: "SpecForensics Engine",
      summary: "Generating audit drawer explanation: Why was 415V chosen over 380V?",
      trace: "Evidence Chain: Datasheet PDF pg 3 [415V] (Weight: 1.0) overrides Distributor Web API [380V] (Weight: 0.6). Factual Trust: 91/100.",
      nextGuide: "Click 'Next Step' to evaluate Risk & Commerce Gate Decision →",
      explanation: "Every value carries transparent lineage showing source text, confidence, RAG rule, and decision logic."
    },
    {
      title: "09. RISK DECISION & TRUST SCORE",
      criterion: "Overall Impact",
      badge: "Factual Trust: 91/100",
      summary: "Calculating dynamic Risk Score (68/100 HIGH RISK) and Factual Trust Score (91/100).",
      riskNote: "AI CONFIDENCE ≠ FACTUAL TRUST. Item flagged for single-click human confirmation.",
      nextGuide: "Click 'Next Step' to route to Human Exception Review Queue →",
      explanation: "Differentiates token probability from empirical domain trust."
    },
    {
      title: "10. HUMAN APPROVAL (HITL)",
      criterion: "Overall Impact",
      badge: "Human Governance",
      summary: "High-confidence fields auto-approved. Voltage discrepancy routed to HITL Attention Queue for final sign-off.",
      hitlStatus: "Item queued in HITL Attention Queue under 'Needs Review' with pre-filled AI suggestion (415 V).",
      nextGuide: "Click 'Next Step' to check Commerce Readiness Gate →",
      explanation: "Human experts spend time ONLY on true edge cases, cutting review workload by up to 85%."
    },
    {
      title: "11. COMMERCE READINESS GATING",
      criterion: "Business Relevance",
      badge: "Catalog Gatekeeper",
      summary: "Calculating overall readiness metrics: Completeness 100%, Confidence 88%, Consistency 95%.",
      gateResult: "BLOCKED FROM CATALOG pending single-click human confirmation of 415V voltage resolution.",
      nextGuide: "Click 'Next Step' to confirm approval and export PIM payload →",
      explanation: "Zero bad data enters the PIM. Catalog integrity is protected at scale."
    },
    {
      title: "12. EXPORT & BUSINESS ROI IMPACT",
      criterion: "Overall Impact",
      badge: "Competition Summary",
      summary: "Transforming 3 days of manual spreadsheet cleanup into 1.4 seconds of automated AI governance.",
      impact: [
        "90%+ Reduction in Manual Catalog Onboarding Time",
        "100% Elimination of Invalid Voltage/Power Catalog Records",
        "Full Audit Lineage & Defense against Buyer Returns",
        "Scale Ready for 100,000+ Supplier SKUs"
      ],
      nextGuide: "Walkthrough Complete! Click 'Finish Walkthrough' to return to Control Center →",
      explanation: "SpecForge turns messy industrial supplier data into a trusted competitive asset."
    }
  ];

  useEffect(() => {
    let timer;
    if (autoPlay && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 4000);
    } else if (currentStep === steps.length - 1) {
      setAutoPlay(false);
    }
    return () => clearTimeout(timer);
  }, [autoPlay, currentStep]);

  const stepData = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-[#070A10]/95 backdrop-blur-xl flex flex-col justify-between overflow-y-auto p-4 sm:p-6 lg:p-8 font-mono">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
            <Award className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg text-white tracking-tight">▶ RUN WINNING DEMO</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                Operational Competition Walkthrough
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans">Industrial Motor (Conflicting Specs Scenario)</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              autoPlay 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{autoPlay ? 'Pause Walkthrough' : 'Auto Play'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700"
          >
            Exit Demo
          </button>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="max-w-6xl mx-auto w-full my-3">
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => { setCurrentStep(idx); setAutoPlay(false); }}
              className={`h-2 rounded-full transition-all ${
                idx === currentStep
                  ? 'bg-amber-400 shadow-md shadow-amber-500/50 scale-105'
                  : idx < currentStep
                  ? 'bg-emerald-500'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title={s.title}
            />
          ))}
        </div>
        <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span className="text-amber-400 font-extrabold">{stepData.title}</span>
          <span className="text-cyan-400 font-bold">Judging: {stepData.criterion}</span>
        </div>
      </div>

      {/* Central Content Card */}
      <div className="max-w-6xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start my-2">
        
        {/* Left Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold uppercase tracking-wider">
                {stepData.badge}
              </span>
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                {stepData.criterion}
              </span>
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight">{stepData.title}</h2>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{stepData.summary}</p>

            {/* Next Step Guidance Banner */}
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 text-amber-300 text-xs font-bold">
              {stepData.nextGuide}
            </div>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <span className="text-amber-400 font-semibold flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Technical & Business Value</span>
              </span>
              <p className="text-slate-300 leading-normal text-[11px] font-sans">{stepData.explanation}</p>
            </div>
          </div>
        </div>

        {/* Right Column Visual Artifacts */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 min-h-[360px] flex flex-col justify-center text-xs">
            
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="p-3 bg-slate-900 rounded-xl border border-amber-500/30">
                  <div className="text-amber-400 font-bold mb-1">Source A (Manufacturer PDF Datasheet)</div>
                  <div className="text-slate-300">{stepData.details.sourceA}</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-rose-500/30">
                  <div className="text-rose-400 font-bold mb-1">Source B (Distributor Web Portal API)</div>
                  <div className="text-slate-300">{stepData.details.sourceB}</div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-2">
                <div className="text-slate-400 mb-2">Gemini Multimodal Extracted Attributes:</div>
                {stepData.extracted.map((item, i) => (
                  <div key={i} className={`p-2.5 rounded-xl border flex items-center justify-between ${item.alert ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-900 border-slate-800'}`}>
                    <div>
                      <span className="text-slate-400 font-bold">{item.key}: </span>
                      <span className="text-slate-100">{item.valA}</span>
                      {item.alert && <span className="text-rose-400 ml-2">(vs {item.valB})</span>}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${item.alert ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                      Confidence {item.conf}%
                    </span>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 2 && (
              <div className="p-4 bg-slate-900 rounded-xl border border-cyan-500/30 space-y-3">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                  <Database className="w-4 h-4" />
                  <span>RAG Vector Match & Taxonomy Check</span>
                </div>
                <p className="text-slate-200">{stepData.kbMatch}</p>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-3">
                <div className="text-slate-300 font-semibold">Unit Normalization Output:</div>
                {stepData.normalizations.map((n, i) => (
                  <div key={i} className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-emerald-400 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{n}</span>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 4 && (
              <div className="p-4 bg-rose-500/10 rounded-xl border border-rose-500/40 space-y-3 text-rose-200">
                <div className="flex items-center space-x-2 text-rose-400 font-bold">
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                  <span>CONFLICT DETECTED BY SPECFORGE</span>
                </div>
                <p>{stepData.conflict}</p>
              </div>
            )}

            {currentStep === 5 && (
              <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/40 space-y-3 text-amber-200">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <ShieldAlert className="w-5 h-5" />
                  <span>AI CHALLENGER CRITIQUE</span>
                </div>
                <p>{stepData.critique}</p>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-2">
                <div className="text-slate-300 font-semibold">Engineering Physics Verification:</div>
                {stepData.checks.map((c, i) => (
                  <div key={i} className="p-2.5 bg-slate-900 rounded-xl border border-emerald-500/30 text-emerald-300 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 7 && (
              <div className="p-4 bg-slate-900 rounded-xl border border-cyan-500/40 space-y-3">
                <div className="text-cyan-400 font-bold flex items-center space-x-2">
                  <Cpu className="w-4 h-4" />
                  <span>SpecForensics Evidence Chain</span>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800 text-slate-200">
                  {stepData.trace}
                </div>
              </div>
            )}

            {currentStep === 8 && (
              <div className="p-4 bg-slate-900 rounded-xl border border-amber-500/40 space-y-3">
                <div className="text-amber-400 font-bold">Factual Trust & Risk Score:</div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800 text-slate-300">
                  {stepData.riskNote}
                </div>
              </div>
            )}

            {currentStep === 9 && (
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                <div className="text-amber-400 font-bold">HITL Attention Queue Routing:</div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800 text-slate-300">
                  {stepData.hitlStatus}
                </div>
              </div>
            )}

            {currentStep === 10 && (
              <div className="p-4 bg-rose-500/10 rounded-xl border border-rose-500/30 space-y-3">
                <div className="text-rose-400 font-bold">Commerce Readiness Gate Status:</div>
                <div className="p-3 bg-slate-950 rounded border border-rose-500/30 text-rose-200">
                  {stepData.gateResult}
                </div>
              </div>
            )}

            {currentStep === 11 && (
              <div className="space-y-3">
                <div className="text-amber-400 font-bold text-sm">SpecForge Business ROI Impact:</div>
                {stepData.impact.map((imp, i) => (
                  <div key={i} className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/30 text-emerald-300 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{imp}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Footer Navigation Bar */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-4 max-w-6xl mx-auto w-full">
        <button
          onClick={() => { setCurrentStep(prev => Math.max(0, prev - 1)); setAutoPlay(false); }}
          disabled={currentStep === 0}
          className="flex items-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Step</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => { setCurrentStep(0); setAutoPlay(false); }}
            className="flex items-center space-x-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Walkthrough</span>
          </button>
        </div>

        <button
          onClick={() => {
            if (currentStep < steps.length - 1) {
              setCurrentStep(prev => prev + 1);
              setAutoPlay(false);
            } else {
              onClose();
            }
          }}
          className="flex items-center space-x-1.5 px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold shadow-lg shadow-amber-500/20"
        >
          <span>{currentStep === steps.length - 1 ? 'Finish Walkthrough' : 'Next Step'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
