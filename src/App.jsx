import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Overview from './components/Overview.jsx';
import IntakeModule from './components/IntakeModule.jsx';
import DemoScenarios from './components/DemoScenarios.jsx';
import PipelineVisualizer from './components/PipelineVisualizer.jsx';
import ReviewUI from './components/ReviewUI.jsx';
import BatchProcessor from './components/BatchProcessor.jsx';
import SpecForensics from './components/SpecForensics.jsx';
import AIChallenger from './components/AIChallenger.jsx';
import DecisionTrace from './components/DecisionTrace.jsx';
import AIAttentionQueue from './components/AIAttentionQueue.jsx';
import RiskIntelligence from './components/RiskIntelligence.jsx';
import CommerceReadinessCenter from './components/CommerceReadinessCenter.jsx';
import ProductsExplorer from './components/ProductsExplorer.jsx';
import CommerceOutputCenter from './components/CommerceOutputCenter.jsx';
import SupplierIntelligence from './components/SupplierIntelligence.jsx';
import KnowledgeBaseExplorer from './components/KnowledgeBaseExplorer.jsx';
import CategoryIntelligence from './components/CategoryIntelligence.jsx';
import AnalyticsDashboard from './components/AnalyticsDashboard.jsx';
import AuditTrail from './components/AuditTrail.jsx';
import EvidenceGraph from './components/EvidenceGraph.jsx';
import TrustAndSecurity from './components/TrustAndSecurity.jsx';
import SettingsAndIntegrations from './components/SettingsAndIntegrations.jsx';
import AICopilot from './components/AICopilot.jsx';
import JudgeMode from './components/JudgeMode.jsx';
import ToastContainer from './components/Toast.jsx';

import { usePipeline } from './hooks/usePipeline.js';
import { useToast } from './hooks/useToast.js';
import { DEMO_PRODUCTS, FORENSICS_CASE } from './data/demoDataset.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); // overview, studio, products, suppliers, forensics, queue, audit, analytics, kb, security, settings
  const [isJudgeModeOpen, setIsJudgeModeOpen] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);
  
  const [knowledgeBase, setKnowledgeBase] = useState({
    taxonomy: [],
    reference_products: [],
    consistency_rules: []
  });

  const { pipelineState, runPipeline } = usePipeline();
  const { toasts, addToast, removeToast } = useToast();
  
  // Default active product set to conflicting motor demo item for instant rich viewing
  const [reviewProduct, setReviewProduct] = useState(DEMO_PRODUCTS[1]);

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

  const handleRunDemo = () => {
    const demoPayload = {
      inputType: 'text',
      categoryCode: '23-15-16',
      textContent: 'Industrial motor 5 HP, 415V, 3 phase, 1440 RPM, IP55 protection class.'
    };
    handleRunPipeline(demoPayload);
  };

  const handleSelectProductForReview = (productData) => {
    setReviewProduct(productData);
    setActiveTab('queue');
    addToast(`Loaded ${productData.name || 'product'} into Review Queue.`, 'info');
  };

  return (
    <div className="min-h-screen bg-[#070A10] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Winning Demo Walkthrough Modal */}
      {isJudgeModeOpen && (
        <JudgeMode
          onClose={() => setIsJudgeModeOpen(false)}
          onSelectProductForReview={handleSelectProductForReview}
        />
      )}

      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeProductCount={DEMO_PRODUCTS.filter(p => p.riskScore > 50).length}
        onRunDemo={handleRunDemo}
        onStartJudgeMode={() => setIsJudgeModeOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1450px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* TAB 1: SPECFORGE CONTROL CENTER */}
        {activeTab === 'overview' && (
          <Overview
            onLaunchStudio={() => setActiveTab('studio')}
            onStartJudgeMode={() => setIsJudgeModeOpen(true)}
            onRunDemo={handleRunDemo}
            onSelectProductForReview={handleSelectProductForReview}
            onOpenForensics={() => setActiveTab('forensics')}
          />
        )}

        {/* TAB 2: INGESTION STUDIO */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            <IntakeModule
              categories={knowledgeBase.taxonomy}
              onRunPipeline={handleRunPipeline}
              isLoading={pipelineState.isProcessing}
              onRunDemo={handleRunDemo}
            />

            <DemoScenarios
              onSelectScenario={handleRunPipeline}
              isLoading={pipelineState.isProcessing}
            />

            <PipelineVisualizer
              pipelineState={pipelineState}
              activeStage={pipelineState.activeStage}
              onSelectStageForReview={() => setActiveTab('queue')}
            />

            <BatchProcessor
              onSelectProductForReview={handleSelectProductForReview}
              onToast={addToast}
            />
          </div>
        )}

        {/* TAB 3: PRODUCTS CATALOG */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <ProductsExplorer onSelectProductForReview={handleSelectProductForReview} />
            <CommerceOutputCenter product={reviewProduct} onToast={addToast} />
          </div>
        )}

        {/* TAB 4: SUPPLIER SCORES */}
        {activeTab === 'suppliers' && (
          <SupplierIntelligence onToast={addToast} />
        )}

        {/* TAB 5: SPECFORENSICS CONFLICT INVESTIGATION */}
        {activeTab === 'forensics' && (
          <div className="space-y-6">
            <SpecForensics forensicData={FORENSICS_CASE} onSelectForReview={() => setActiveTab('queue')} />
            <AIChallenger />
            <DecisionTrace product={reviewProduct} />
          </div>
        )}

        {/* TAB 6: REVIEW QUEUE (AI Attention Queue + HITL Review UI) */}
        {activeTab === 'queue' && (
          <div className="space-y-6">
            <AIAttentionQueue
              onSelectProductForReview={(p) => setReviewProduct(p)}
              onToast={addToast}
            />

            <ReviewUI
              initialRecord={reviewProduct || pipelineState.finalRecord || DEMO_PRODUCTS[1]}
              referenceProducts={knowledgeBase.reference_products}
              stagesData={pipelineState.stages}
              onToast={addToast}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RiskIntelligence product={reviewProduct} />
              <CommerceReadinessCenter product={reviewProduct} onSelectForReview={() => setActiveTab('queue')} onToast={addToast} />
            </div>
          </div>
        )}

        {/* TAB 7: AUDIT TRAIL & LINEAGE */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <AuditTrail onToast={addToast} />
            <EvidenceGraph product={reviewProduct} />
          </div>
        )}

        {/* TAB 8: ANALYTICS */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}

        {/* TAB 9: KNOWLEDGE BASE */}
        {activeTab === 'kb' && (
          <div className="space-y-6">
            <KnowledgeBaseExplorer
              taxonomy={knowledgeBase.taxonomy}
              referenceProducts={knowledgeBase.reference_products}
              consistencyRules={knowledgeBase.consistency_rules}
            />
            <CategoryIntelligence taxonomy={knowledgeBase.taxonomy} />
          </div>
        )}

        {/* TAB 10: TRUST & SECURITY CENTER */}
        {activeTab === 'security' && (
          <TrustAndSecurity />
        )}

        {/* TAB 11: SETTINGS */}
        {activeTab === 'settings' && (
          <SettingsAndIntegrations />
        )}

      </main>

      {/* Floating SpecForge Decision Copilot Toggle */}
      <div className="fixed bottom-6 right-6 z-30 font-mono">
        {!showCopilot ? (
          <button
            onClick={() => setShowCopilot(true)}
            className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-extrabold rounded-full shadow-2xl hover:scale-105 transition-all text-xs border border-amber-300"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-950 animate-ping"></span>
            <span>SpecForge Decision Copilot</span>
          </button>
        ) : (
          <div className="w-[380px] sm:w-[480px] shadow-2xl rounded-2xl overflow-hidden border border-amber-500/40">
            <div className="flex justify-end bg-slate-900 px-3 py-1 text-xs text-slate-400 border-b border-slate-800">
              <button onClick={() => setShowCopilot(false)} className="hover:text-white font-bold">✕ Close Copilot</button>
            </div>
            <AICopilot activeProduct={reviewProduct} onSelectTab={(t) => setActiveTab(t)} onToast={addToast} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#05080E] py-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-[1450px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SpecForge — Industrial Product Intelligence & Governance Layer</span>
          <span className="text-amber-400 font-semibold">Multimodal AI + RAG + Engineering Rules + HITL Governance</span>
          <span>Competition Edition v2.0</span>
        </div>
      </footer>

    </div>
  );
}
