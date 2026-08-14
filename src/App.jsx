import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import IntakeModule from './components/IntakeModule.jsx';
import PipelineVisualizer from './components/PipelineVisualizer.jsx';
import ReviewUI from './components/ReviewUI.jsx';
import BatchProcessor from './components/BatchProcessor.jsx';
import KnowledgeBaseExplorer from './components/KnowledgeBaseExplorer.jsx';
import QualityDashboard from './components/QualityDashboard.jsx';
import EngineeringReadinessPanel from './components/EngineeringReadinessPanel.jsx';
import ToastContainer from './components/Toast.jsx';
import { usePipeline } from './hooks/usePipeline.js';
import { useToast } from './hooks/useToast.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('studio'); // 'studio', 'review', 'batch', 'kb'
  const [knowledgeBase, setKnowledgeBase] = useState({
    taxonomy: [],
    reference_products: [],
    consistency_rules: []
  });

  const { pipelineState, runPipeline } = usePipeline();
  const { toasts, addToast, removeToast } = useToast();
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

  const handleRunPipeline = async (inputPayload) => {
    try {
      const finalProduct = await runPipeline(inputPayload);
      setReviewProduct(finalProduct);
      addToast('3-Stage AI Processing Pipeline executed successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Pipeline execution failed.', 'error');
    }
  };

  // Instant Demo Mode execution for competition judges
  const handleRunDemo = () => {
    const demoPayload = {
      inputType: 'text',
      categoryCode: '23-15-16',
      textContent: 'Deep groove ball bearing 6205-2RS, rubber sealed, 25mm bore. High speed industrial application.'
    };
    handleRunPipeline(demoPayload);
  };

  const handleSelectProductForReview = (productData) => {
    setReviewProduct(productData);
    setActiveTab('review');
    addToast('Product loaded into HITL Review UI.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#0A0E17] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeProductCount={reviewProduct ? 1 : 0}
      />

      {/* Main Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Quality & Readiness Panels */}
        {pipelineState.finalRecord && (
          <QualityDashboard
            record={reviewProduct || pipelineState.finalRecord}
            attributesState={reviewProduct?.attributes || pipelineState.finalRecord?.attributes || {}}
          />
        )}

        {/* TAB 1: Pipeline Studio */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            <IntakeModule
              categories={knowledgeBase.taxonomy}
              onRunPipeline={handleRunPipeline}
              isLoading={pipelineState.isProcessing}
              onRunDemo={handleRunDemo}
            />

            <PipelineVisualizer
              pipelineState={pipelineState}
              activeStage={pipelineState.activeStage}
              onSelectStageForReview={() => setActiveTab('review')}
            />

            <EngineeringReadinessPanel />
          </div>
        )}

        {/* TAB 2: Human-In-The-Loop Review UI */}
        {activeTab === 'review' && (
          <ReviewUI
            initialRecord={reviewProduct || pipelineState.finalRecord}
            referenceProducts={knowledgeBase.reference_products}
            stagesData={pipelineState.stages}
            onToast={addToast}
          />
        )}

        {/* TAB 3: Batch Processing Demo */}
        {activeTab === 'batch' && (
          <BatchProcessor
            onSelectProductForReview={handleSelectProductForReview}
            onToast={addToast}
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
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs font-mono text-slate-500">
        SpecForge — Enterprise AI Platform | 3-Stage AI Pipeline + Stage 4 Human Approval & Commerce Output
      </footer>

    </div>
  );
}
