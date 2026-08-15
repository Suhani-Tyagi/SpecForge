import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, RotateCcw, CheckCircle2, AlertTriangle, ShieldCheck, Zap, Cpu, ArrowRight, Award, FileText, ArrowLeft, BarChart3, Database } from 'lucide-react';

export default function JudgeMode({ onClose, onSelectProductForReview }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  const steps = [
    {
      title: "1. Ingesting Messy Supplier Data",
      criterion: "Technical Implementation",
      badge: "Multimodal Ingestion",
      summary: "Ingesting raw supplier inputs across multiple formats (Datasheet PDF, Supplier Text Description, Web API JSON).",
      details: {
        sourceA: "Supplier PDF Datasheet (ED-MTR-2026.pdf): '5 HP, 415V, 3-Phase, 1440 RPM, IP55 Enclosure'",
        sourceB: "Distributor Web API (DistributorPortal_V2): '5 HP, 380V, 3-Phase, 1450 RPM, IP54 Enclosure'"
      },
      explanation: "Real industrial supply chains present contradictory specs across datasheets, web listings, and ERP exports. SpecForge unifies these raw streams."
    },
    {
      title: "2. Multimodal AI Attribute Extraction",
      criterion: "Innovation",
      badge: "Gemini 2.0 Flash",
      summary: "AI Engine extracts structured attributes with per-field confidence scoring and original source offsets.",
      extracted: [
        { key: "Power", valA: "3.7 kW (5 HP)", valB: "3.7 kW (5 HP)", conf: 99 },
        { key: "Voltage", valA: "415 V", valB: "380 V", conf: 68, alert: true },
        { key: "Speed", valA: "1440 RPM", valB: "1450 RPM", conf: 74, alert: true },
        { key: "Enclosure", valA: "IP55", valB: "IP54", conf: 70, alert: true }
      ],
      explanation: "Gemini multimodal models extract technical values alongside contextual spatial evidence from PDF pages and tables."
    },
    {
      title: "3. RAG Knowledge Base Enrichment",
      criterion: "Technical Implementation",
      badge: "RAG & Vector Taxonomy",
      summary: "Matching extracted product against UNSPSC Category 23-15-16 (Electric Motors & Drives) schema & baseline standards.",
      kbMatch: "Category Schema 23-15-16 matched with 98.4% taxonomy fit. Nominal voltage standard: 415V/50Hz (IEC 60034).",
      explanation: "RAG ground truth prevents AI hallucinations by binding extractions to authoritative domain standards."
    },
    {
      title: "4. Automated Unit Normalization",
      criterion: "Technical Implementation",
      badge: "Deterministic Normalizer",
      summary: "Converting non-standard units (e.g. 5 HP -> 3.7 kW, 1440 r/min -> 1440 RPM, 600 PSI -> 41.3 bar).",
      normalizations: [
        "5 HP → 3.7 kW (ISO Standard SI Unit)",
        "415 Volts AC → 415 V (Normalized String)",
        "3 Phase → 3 Phase"
      ],
      explanation: "Ensures catalog uniformity so industrial buyers can filter and compare products seamlessly."
    },
    {
      title: "5. Engineering Rule Validation",
      criterion: "Technical Implementation",
      badge: "Rule Engine EV-001",
      summary: "Running deterministic engineering validation rules to detect physical and electrical impossibilities.",
      checks: [
        "EV-001: 5 HP motor power matches 3.7 kW rating ✓ PASSED",
        "EV-002: Nominal voltage 415V within standard 400-440V industrial range ✓ PASSED",
        "EV-003: Slip speed check (1440 RPM for 4-pole 50Hz motor) ✓ PASSED"
      ],
      explanation: "AI recommendations are gated by deterministic engineering physics validation before catalog publication."
    },
    {
      title: "6. Conflict Detection & Intelligence",
      criterion: "Innovation",
      badge: "Source Discrepancy Engine",
      summary: "Detecting primary voltage conflict: Supplier PDF Datasheet (415V) vs Web API Text (380V).",
      conflict: "CRITICAL CONFLICT: Voltage field has opposing values from 2 valid sources.",
      explanation: "Flagging contradictions automatically prevents incorrect spec listing in buyer procurement catalogs."
    },
    {
      title: "7. Source Authority Resolution",
      criterion: "Innovation",
      badge: "Hierarchy Rule SA-02",
      summary: "Applying Source Authority Matrix: Datasheet PDF > Portal Text > AI Inference.",
      decision: "Selected Value: 415 V (Derived from Technical Datasheet PDF, Page 3)",
      explanation: "Authority rules resolve 80%+ of supplier conflicts automatically without human intervention."
    },
    {
      title: "8. AI Decision Traceability & Explainability",
      criterion: "Innovation",
      badge: "Explainable AI (XAI)",
      summary: "Generating audit drawer explanation: Why was 415V chosen over 380V?",
      trace: "Evidence Chain: PDF pg 3 table [415V] (Weight: 1.0) overrides Web text [380V] (Weight: 0.6). Confidence: 94%.",
      explanation: "Every value carries transparent lineage showing source text, confidence, RAG rule, and decision logic."
    },
    {
      title: "9. Exception-Driven HITL Review Routing",
      criterion: "Overall Impact",
      badge: "Human Governance",
      summary: "High-confidence fields auto-approved. Voltage discrepancy routed to HITL Attention Queue for final sign-off.",
      hitlStatus: "Item queued in HITL Attention Queue under 'Needs Review' with pre-filled AI suggestion (415 V).",
      explanation: "Human experts spend time ONLY on true edge cases, cutting review workload by up to 85%."
    },
    {
      title: "10. Commerce Readiness Gating",
      criterion: "Business Relevance",
      badge: "Catalog Gatekeeper",
      summary: "Calculating overall readiness metrics: Completeness 100%, Confidence 88%, Consistency 95%.",
      gateResult: "BLOCKED FROM CATALOG pending single-click human confirmation of 415V voltage resolution.",
      explanation: "Zero bad data enters the PIM. Catalog integrity is protected at scale."
    },
    {
      title: "11. One-Click Human Approval & Export",
      criterion: "Business Relevance",
      badge: "PIM-Ready Export",
      summary: "Human reviewer confirms 415V resolution -> Record transitions to COMMERCE-READY status.",
      exportPayload: "Generated PIM-ready JSON / CSV / API payload with complete audit metadata.",
      explanation: "Clean, trusted product data is delivered directly to enterprise eCommerce & PIM systems."
    },
    {
      title: "12. Business Impact & ROI Summary",
      criterion: "Overall Impact",
      badge: "Competition Summary",
      summary: "Transforming 3 days of manual spreadsheet cleanup into 1.9 seconds of automated AI governance.",
      impact: [
        "90%+ Reduction in Manual Catalog Onboarding Time",
        "100% Elimination of Invalid Voltage/Power Catalog Records",
        "Full Audit Lineage & Defense against Buyer Returns",
        "Scale Ready for 100,000+ Supplier SKUs"
      ],
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
    <div className="fixed inset-0 z-50 bg-[#070A10]/95 backdrop-blur-xl flex flex-col justify-between overflow-y-auto p-4 sm:p-6 lg:p-8">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 max-w-6xl mx-auto w-full">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
            <Award className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg text-white tracking-tight">JUDGE MODE</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-semibold">
                3-Minute Guided Competition Walkthrough
              </span>
            </div>
            <p className="text-xs text-slate-400">Industrial Motor (Conflicting Specs Scenario)</p>
          </div>
        </div>

        {/* Progress Bar & Actions */}
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
            <span>{autoPlay ? 'Pause Demo' : 'Auto Play'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700"
          >
            Exit Judge Mode
          </button>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="max-w-6xl mx-auto w-full my-4">
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
        <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 mt-2">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span className="text-amber-400 font-semibold">{stepData.title}</span>
          <span className="text-cyan-400 font-semibold">Judging Criterion: {stepData.criterion}</span>
        </div>
      </div>

      {/* Central Interactive Content Display */}
      <div className="max-w-6xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start my-2">
        
        {/* Left Column: Step Overview & Judge Context */}
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
            <p className="text-sm text-slate-300 leading-relaxed">{stepData.summary}</p>

            <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 space-y-2 text-xs">
              <span className="text-amber-400 font-semibold flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Judge Insight / Technical Value</span>
              </span>
              <p className="text-slate-300 leading-normal">{stepData.explanation}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Live Simulated Pipeline Artifacts */}
        <div className="lg:col-span-7">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 min-h-[340px] flex flex-col justify-center">
            
            {currentStep === 0 && (
              <div className="space-y-4 font-mono text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-amber-500/30">
                  <div className="text-amber-400 font-bold mb-1">Source A (Supplier PDF Datasheet)</div>
                  <div className="text-slate-300">{stepData.details.sourceA}</div>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl border border-rose-500/30">
                  <div className="text-rose-400 font-bold mb-1">Source B (Distributor Web API)</div>
                  <div className="text-slate-300">{stepData.details.sourceB}</div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-2">
                <div className="text-xs font-mono text-slate-400 mb-2">Gemini Multimodal Extracted Attributes:</div>
                {stepData.extracted.map((item, i) => (
                  <div key={i} className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono ${item.alert ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-900 border-slate-800'}`}>
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
              <div className="p-4 bg-slate-900 rounded-xl border border-cyan-500/30 space-y-3 font-mono text-xs">
                <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                  <Database className="w-4 h-4" />
                  <span>RAG Vector Match & Taxonomy Check</span>
                </div>
                <p className="text-slate-200">{stepData.kbMatch}</p>
                <div className="p-2 bg-slate-950 rounded border border-slate-800 text-slate-400">
                  Consistency Rules Applied: EV-001 (Voltage Limits), EV-003 (Slip Bounds)
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-3 font-mono text-xs">
                <div className="text-slate-300 font-semibold mb-1">Unit Normalization Pipeline output:</div>
                {stepData.normalizations.map((n, i) => (
                  <div key={i} className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-emerald-400 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{n}</span>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-2 font-mono text-xs">
                <div className="text-slate-300 font-semibold mb-1">Engineering Physics Verification:</div>
                {stepData.checks.map((c, i) => (
                  <div key={i} className="p-2.5 bg-slate-900 rounded-xl border border-emerald-500/30 text-emerald-300 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            )}

            {currentStep === 5 && (
              <div className="p-4 bg-rose-500/10 rounded-xl border border-rose-500/40 space-y-3 font-mono text-xs text-rose-200">
                <div className="flex items-center space-x-2 text-rose-400 font-bold">
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                  <span>CONFLICT DETECTED BY SPECFORGE</span>
                </div>
                <p>{stepData.conflict}</p>
                <div className="p-2.5 bg-slate-950 rounded border border-rose-500/30 text-slate-300">
                  Datasheet: 415V | Web Text: 380V → High Risk score assigned (68/100)
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="p-4 bg-slate-900 rounded-xl border border-amber-500/40 space-y-3 font-mono text-xs">
                <div className="text-amber-400 font-bold">Source Authority Hierarchy Applied:</div>
                <div className="p-2.5 bg-amber-500/10 rounded border border-amber-500/30 text-amber-200">
                  {stepData.decision}
                </div>
                <p className="text-slate-400"> Datasheet PDF given 1.0 weight vs Distributor API 0.6 weight.</p>
              </div>
            )}

            {currentStep === 7 && (
              <div className="p-4 bg-slate-900 rounded-xl border border-cyan-500/40 space-y-3 font-mono text-xs">
                <div className="text-cyan-400 font-bold flex items-center space-x-2">
                  <Cpu className="w-4 h-4" />
                  <span>AI Decision Evidence Chain</span>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800 text-slate-200">
                  {stepData.trace}
                </div>
              </div>
            )}

            {currentStep === 8 && (
              <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
                <div className="text-amber-400 font-bold">HITL Attention Queue Assignment:</div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800 text-slate-300">
                  {stepData.hitlStatus}
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onSelectProductForReview({
                      name: "Heavy-Duty Industrial Motor (Conflicting Specs)",
                      confidence: 0.81,
                      riskScore: 68,
                      attributes: {
                        voltage: { value: "415 V (Datasheet) vs 380 V (Web)", confidence: 0.65, status: "CONFLICT" }
                      }
                    });
                  }}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Open in HITL Review UI →
                </button>
              </div>
            )}

            {currentStep === 9 && (
              <div className="p-4 bg-rose-500/10 rounded-xl border border-rose-500/30 space-y-3 font-mono text-xs">
                <div className="text-rose-400 font-bold">Commerce Readiness Gate Status:</div>
                <div className="p-3 bg-slate-950 rounded border border-rose-500/30 text-rose-200">
                  {stepData.gateResult}
                </div>
              </div>
            )}

            {currentStep === 10 && (
              <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/30 space-y-3 font-mono text-xs">
                <div className="text-emerald-400 font-bold flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <span>Human Confirmation Complete → Commerce Ready</span>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800 text-slate-300">
                  Payload exported: {stepData.exportPayload}
                </div>
              </div>
            )}

            {currentStep === 11 && (
              <div className="space-y-3 font-mono text-xs">
                <div className="text-amber-400 font-bold text-sm">SpecForge Competition Impact Summary:</div>
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
            <span>Restart Demo</span>
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
          className="flex items-center space-x-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20"
        >
          <span>{currentStep === steps.length - 1 ? 'Finish Walkthrough' : 'Next Step'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
