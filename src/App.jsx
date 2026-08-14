import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import IntakeModule from './components/IntakeModule.jsx';
import PipelineVisualizer from './components/PipelineVisualizer.jsx';
import ReviewUI from './components/ReviewUI.jsx';
import BatchProcessor from './components/BatchProcessor.jsx';
import KnowledgeBaseExplorer from './components/KnowledgeBaseExplorer.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('studio'); // 'studio', 'review', 'batch', 'kb'
  const [knowledgeBase, setKnowledgeBase] = useState({
    taxonomy: [],
    reference_products: [],
    consistency_rules: []
  });

  const [pipelineState, setPipelineState] = useState({
    isProcessing: false,
    activeStage: 0,
    completedStages: [],
    stages: {},
    finalRecord: null,
    totalLatencyMs: 0,
    error: null
  });

  const [reviewProduct, setReviewProduct] = useState(null);

  // Fetch Knowledge Base on Mount
  useEffect(() => {
    fetch('/api/knowledge-base')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setKnowledgeBase({
            taxonomy: data.taxonomy || [],
            reference_products: data.reference_products || [],
            consistency_rules: data.consistency_rules || []
          });
        }
      })
      .catch(err => console.error('[SpecForge] Error loading knowledge base:', err));
  }, []);

  const getHeaders = () => {
    const headers = { 'Content-Type': 'application/json' };
    const apiKey = import.meta.env.VITE_APP_API_KEY;
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }
    return headers;
  };

  // Execute full 4-stage pipeline with live visualizer stage transitions
  const handleRunPipeline = async (inputPayload) => {
    setPipelineState({
      isProcessing: true,
      activeStage: 1,
      completedStages: [],
      stages: {},
      finalRecord: null,
      totalLatencyMs: 0,
      error: null
    });

    const startTotal = Date.now();

    try {
      // Stage 1: Extraction
      setPipelineState(prev => ({ ...prev, activeStage: 1 }));
      const extractRes = await fetch('/api/pipeline/extract', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(inputPayload)
      });
      const extractData = await extractRes.json();
      if (!extractData.success && extractData.error) {
        throw new Error(extractData.error);
      }

      setPipelineState(prev => ({
        ...prev,
        completedStages: [...prev.completedStages, 1],
        stages: { ...prev.stages, intake: extractData },
        activeStage: 2
      }));

      // Stage 2: RAG Enrichment
      const enrichRes = await fetch('/api/pipeline/enrich', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(extractData)
      });
      const enrichData = await enrichRes.json();
      if (!enrichData.success && enrichData.error) {
        throw new Error(enrichData.error);
      }

      setPipelineState(prev => ({
        ...prev,
        completedStages: [...prev.completedStages, 2],
        stages: { ...prev.stages, enrichment: enrichData },
        activeStage: 3
      }));

      // Stage 3: Validation & Traceability
      const validateRes = await fetch('/api/pipeline/validate', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(enrichData)
      });
      const validateData = await validateRes.json();
      if (!validateData.success && validateData.error) {
        throw new Error(validateData.error);
      }

      const endTotal = Date.now() - startTotal;
      const finalProduct = validateData.data || validateData;

      setPipelineState(prev => ({
        ...prev,
        isProcessing: false,
        activeStage: 4,
        completedStages: [1, 2, 3, 4],
        stages: { ...prev.stages, validation: validateData },
        finalRecord: finalProduct,
        totalLatencyMs: endTotal
      }));

      setReviewProduct(finalProduct);

    } catch (err) {
      console.error('[SpecForge] Pipeline Execution Error:', err);
      setPipelineState(prev => ({
        ...prev,
        isProcessing: false,
        error: err.message
      }));
    }
  };

  const handleSelectProductForReview = (productData) => {
    setReviewProduct(productData);
    setActiveTab('review');
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeProductCount={reviewProduct ? 1 : 0}
      />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* TAB 1: Pipeline Studio */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            <IntakeModule
              categories={knowledgeBase.taxonomy}
              onRunPipeline={handleRunPipeline}
              isLoading={pipelineState.isProcessing}
            />

            <PipelineVisualizer
              pipelineState={pipelineState}
              activeStage={pipelineState.activeStage}
              onSelectStageForReview={() => setActiveTab('review')}
            />
          </div>
        )}

        {/* TAB 2: Human-In-The-Loop Review UI */}
        {activeTab === 'review' && (
          <ReviewUI
            initialRecord={reviewProduct || pipelineState.finalRecord}
            onSaveRecord={(updated) => setReviewProduct(updated)}
          />
        )}

        {/* TAB 3: Batch Scalability Demo */}
        {activeTab === 'batch' && (
          <BatchProcessor
            onSelectProductForReview={handleSelectProductForReview}
          />
        )}

        {/* TAB 4: RAG Knowledge Base Explorer */}
        {activeTab === 'kb' && (
          <KnowledgeBaseExplorer
            taxonomy={knowledgeBase.taxonomy}
            referenceProducts={knowledgeBase.reference_products}
            consistencyRules={knowledgeBase.consistency_rules}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 text-center text-xs font-mono text-slate-500">
        SpecForge — Hackathon Edition | Powered by Gemini 2.0 Flash & Knowledge Base RAG Engine
      </footer>

    </div>
  );
}
