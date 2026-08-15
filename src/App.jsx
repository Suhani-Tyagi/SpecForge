import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import HomeIntentPage from './components/HomeIntentPage.jsx';
import ProcessDataWizard from './components/ProcessDataWizard.jsx';
import ProductDetail from './components/ProductDetail.jsx';
import NeedsYourAttention from './components/NeedsYourAttention.jsx';
import CatalogHealth from './components/CatalogHealth.jsx';
import ProductsExplorer from './components/ProductsExplorer.jsx';
import CommerceOutputCenter from './components/CommerceOutputCenter.jsx';
import SupplierIntelligence from './components/SupplierIntelligence.jsx';
import KnowledgeBaseExplorer from './components/KnowledgeBaseExplorer.jsx';
import CategoryIntelligence from './components/CategoryIntelligence.jsx';
import AnalyticsDashboard from './components/AnalyticsDashboard.jsx';
import AuditTrail from './components/AuditTrail.jsx';
import TrustAndSecurity from './components/TrustAndSecurity.jsx';
import SettingsAndIntegrations from './components/SettingsAndIntegrations.jsx';
import SpecForgeAssistant from './components/SpecForgeAssistant.jsx';
import ReviewUI from './components/ReviewUI.jsx';
import ToastContainer from './components/Toast.jsx';

import { usePipeline } from './hooks/usePipeline.js';
import { useToast } from './hooks/useToast.js';
import { DEMO_PRODUCTS } from './data/demoDataset.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // home, products, suppliers, review, knowledge, analytics, audit, settings, wizard, product_detail, catalog_health
  const [showAssistant, setShowAssistant] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [knowledgeBase, setKnowledgeBase] = useState({
    taxonomy: [],
    reference_products: [],
    consistency_rules: []
  });

  const { pipelineState, runPipeline } = usePipeline();
  const { toasts, addToast, removeToast } = useToast();
  
  // Default active product set to conflicting motor demo item for instant rich viewing
  const [selectedProduct, setSelectedProduct] = useState(DEMO_PRODUCTS[1]);

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
      setSelectedProduct(finalProduct);
      addToast('Product Data Processed Successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Processing failed.', 'error');
    }
  };

  const handleTrySampleProduct = async () => {
    const sampleMotorPayload = {
      inputType: 'text',
      categoryCode: '23-15-16',
      textContent: 'Manufacturer Datasheet (ED-MTR-2026.pdf): 5 HP (3.7 kW), 415V, 3-Phase, 1440 RPM, IP55 Enclosure. Distributor Web Listing (JSON): 5 HP, 380V, 3-Phase, 1450 RPM, IP54 Enclosure.'
    };
    await handleRunPipeline(sampleMotorPayload);
    setActiveTab('product_detail');
  };

  const handleSelectProductForDetail = (productData) => {
    setSelectedProduct(productData);
    setActiveTab('product_detail');
  };

  // Breadcrumbs calculation based on activeTab
  const getBreadcrumbs = () => {
    if (activeTab === 'home') return [{ label: 'Home' }];
    if (activeTab === 'wizard') return [{ label: 'Home', onClick: () => setActiveTab('home') }, { label: 'Process Data' }];
    if (activeTab === 'product_detail') return [{ label: 'Products', onClick: () => setActiveTab('products') }, { label: selectedProduct?.sku || 'Product Analysis' }];
    if (activeTab === 'catalog_health') return [{ label: 'Home', onClick: () => setActiveTab('home') }, { label: 'Catalog Health' }];
    if (activeTab === 'products') return [{ label: 'Products' }];
    if (activeTab === 'suppliers') return [{ label: 'Suppliers' }];
    if (activeTab === 'review') return [{ label: 'Needs Attention' }];
    if (activeTab === 'knowledge') return [{ label: 'Knowledge & Rules' }];
    if (activeTab === 'analytics') return [{ label: 'Analytics' }];
    if (activeTab === 'audit') return [{ label: 'Audit' }];
    if (activeTab === 'settings') return [{ label: 'Settings' }];
    return [];
  };

  return (
    <div className="min-h-screen bg-[#070A10] text-slate-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Task Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeProductCount={DEMO_PRODUCTS.filter(p => p.riskScore > 50).length}
        onStartProcessData={() => setActiveTab('wizard')}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        breadcrumbs={getBreadcrumbs()}
        onSelectSearchResult={(res) => {
          setSelectedProduct(DEMO_PRODUCTS[1]);
          setActiveTab('product_detail');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1450px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* ROUTE 1: HOME (Single Clean Landing View - No Overview Duplication) */}
        {activeTab === 'home' && (
          <HomeIntentPage
            onStartProcessData={() => setActiveTab('wizard')}
            onTrySampleProduct={handleTrySampleProduct}
            onReviewIssues={() => setActiveTab('review')}
            onCheckSuppliers={() => setActiveTab('suppliers')}
            onViewCatalog={() => setActiveTab('catalog_health')}
            onManageKnowledge={() => setActiveTab('knowledge')}
          />
        )}

        {/* ROUTE 2: PROCESS DATA WIZARD */}
        {activeTab === 'wizard' && (
          <ProcessDataWizard
            onRunPipeline={handleRunPipeline}
            onCompleteViewProduct={() => setActiveTab('product_detail')}
          />
        )}

        {/* ROUTE 3: PRODUCTS CATALOG */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <ProductsExplorer onSelectProductForReview={handleSelectProductForDetail} />
            <CommerceOutputCenter product={selectedProduct} onToast={addToast} />
          </div>
        )}

        {/* ROUTE 4: UNIFIED PRODUCT DETAIL (The Central Star View) */}
        {activeTab === 'product_detail' && (
          <ProductDetail
            product={selectedProduct}
            onToast={addToast}
          />
        )}

        {/* ROUTE 5: CATALOG HEALTH */}
        {activeTab === 'catalog_health' && (
          <CatalogHealth
            onSelectSupplier={() => setActiveTab('suppliers')}
            onReviewIssues={() => setActiveTab('review')}
          />
        )}

        {/* ROUTE 6: SUPPLIERS */}
        {activeTab === 'suppliers' && (
          <SupplierIntelligence onToast={addToast} />
        )}

        {/* ROUTE 7: NEEDS ATTENTION (Inbox + Review UI) */}
        {activeTab === 'review' && (
          <div className="space-y-6">
            <NeedsYourAttention
              onSelectProductForReview={handleSelectProductForDetail}
              onToast={addToast}
            />
            <ReviewUI
              initialRecord={selectedProduct}
              referenceProducts={knowledgeBase.reference_products}
              stagesData={pipelineState.stages}
              onToast={addToast}
            />
          </div>
        )}

        {/* ROUTE 8: KNOWLEDGE & RULES */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            <KnowledgeBaseExplorer
              taxonomy={knowledgeBase.taxonomy}
              referenceProducts={knowledgeBase.reference_products}
              consistencyRules={knowledgeBase.consistency_rules}
            />
            <CategoryIntelligence taxonomy={knowledgeBase.taxonomy} />
          </div>
        )}

        {/* ROUTE 9: ANALYTICS */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}

        {/* ROUTE 10: AUDIT */}
        {activeTab === 'audit' && (
          <AuditTrail onToast={addToast} />
        )}

        {/* ROUTE 11: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <TrustAndSecurity />
            <SettingsAndIntegrations />
          </div>
        )}

      </main>

      {/* Context-Aware SpecForge Assistant */}
      <div className="fixed bottom-6 right-6 z-30 font-sans">
        {!showAssistant ? (
          <button
            onClick={() => setShowAssistant(true)}
            className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-extrabold rounded-full shadow-2xl hover:scale-105 transition-all text-xs border border-amber-300 font-mono"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-950 animate-ping"></span>
            <span>SpecForge Assistant</span>
          </button>
        ) : (
          <div className="w-[380px] sm:w-[480px] shadow-2xl rounded-2xl overflow-hidden border border-amber-500/40">
            <div className="flex justify-end bg-slate-900 px-3 py-1 text-xs text-slate-400 border-b border-slate-800 font-mono">
              <button onClick={() => setShowAssistant(false)} className="hover:text-white font-bold">✕ Close Assistant</button>
            </div>
            <SpecForgeAssistant activeProduct={selectedProduct} onSelectTab={(t) => setActiveTab(t)} onToast={addToast} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#05080E] py-6 text-center text-xs font-sans text-slate-500">
        <div className="max-w-[1450px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SPECForge — AI Product Intelligence & Governance</span>
          <span className="text-amber-400 font-semibold font-mono">Turn messy supplier information into trusted, commerce-ready product data.</span>
          <span>Enterprise SaaS v2.0</span>
        </div>
      </footer>

    </div>
  );
}
