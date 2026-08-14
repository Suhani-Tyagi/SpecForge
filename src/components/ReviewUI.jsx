import React, { useState, useEffect } from 'react';
import { useReviewState } from '../hooks/useReviewState.js';
import ConfidenceHeatmap from './ConfidenceHeatmap.jsx';
import DataDiffView from './DataDiffView.jsx';
import AuditTimeline from './AuditTimeline.jsx';
import DuplicateDetector from './DuplicateDetector.jsx';
import ExportModal from './ExportModal.jsx';
import EvidenceDrawer from './EvidenceDrawer.jsx';
import ConflictResolver from './ConflictResolver.jsx';
import CommerceReadinessGate from './CommerceReadinessGate.jsx';
import ValidationExplorer from './ValidationExplorer.jsx';
import SupplierScorecard from './SupplierScorecard.jsx';
import PipelineDiagnostics from './PipelineDiagnostics.jsx';
import { resolveAttributeConflicts } from '../../server/utils/conflictResolver.js';
import { Check, X, Edit2, Download, Undo, ShieldCheck, HelpCircle, Filter, Search, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ReviewUI({ initialRecord, referenceProducts = [], stagesData = null, onToast }) {
  const {
    record,
    attributesState,
    recordStatus,
    setRecordStatus,
    filterText,
    setFilterText,
    filterConfidence,
    setFilterConfidence,
    canUndo,
    undo,
    setAttributeStatus,
    editAttributeValue,
    bulkAcceptHighConfidence,
    bulkAcceptAll,
    bulkRejectLowConfidence,
    getExportData
  } = useReviewState(initialRecord);

  const [activeViewMode, setActiveViewMode] = useState('table'); // 'table', 'heatmap', 'diff', 'timeline', 'rules', 'readiness'
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedEvidenceKey, setSelectedEvidenceKey] = useState(null);
  const [editKey, setEditKey] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [keyboardFocusedKey, setKeyboardFocusedKey] = useState(null);
  const [liveAnnouncement, setLiveAnnouncement] = useState('');

  // Source Authority Conflict Analysis
  const conflictAnalysis = resolveAttributeConflicts(attributesState, record?.rawText || '');

  // Keyboard Review Shortcuts (Enter = approve, E = edit, R = reject)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!keyboardFocusedKey || editKey) return;

      if (e.key === 'Enter') {
        setAttributeStatus(keyboardFocusedKey, 'accepted');
        announce(`Approved attribute ${keyboardFocusedKey}`);
      } else if (e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setEditKey(keyboardFocusedKey);
        setEditValue(String(attributesState[keyboardFocusedKey]?.value || ''));
      } else if (e.key.toLowerCase() === 'r') {
        setAttributeStatus(keyboardFocusedKey, 'rejected');
        announce(`Rejected attribute ${keyboardFocusedKey}`);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keyboardFocusedKey, editKey, attributesState, setAttributeStatus]);

  const announce = (msg) => {
    setLiveAnnouncement(msg);
    if (onToast) onToast(msg, 'info');
  };

  if (!record) {
    return (
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-12 text-center shadow-xl font-mono">
        <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-300">No Product Selected for Review</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Process a product through the Pipeline Studio or launch an item from the Batch Scalability Demo to open the Human-In-The-Loop catalog governance interface.
        </p>
      </div>
    );
  }

  // Filtered Attributes
  const filteredAttributes = Object.entries(attributesState).filter(([key, attr]) => {
    const matchesText = key.toLowerCase().includes(filterText.toLowerCase()) || String(attr.value).toLowerCase().includes(filterText.toLowerCase());
    const matchesConf = filterConfidence === 'ALL' || attr.confidence.toUpperCase() === filterConfidence.toUpperCase();
    return matchesText && matchesConf;
  });

  const handleSaveEdit = (key) => {
    editAttributeValue(key, editValue);
    setEditKey(null);
    announce(`Updated ${key} to "${editValue}"`);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
      
      {/* Screen Reader Live Region */}
      <div aria-live="polite" className="sr-only">
        {liveAnnouncement}
      </div>

      {/* Record Header & Status Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-100 font-mono">
                  {record.product_name || 'Industrial Product Record'}
                </h2>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase ${
                  recordStatus === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                  recordStatus === 'NEEDS_ATTENTION' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                  recordStatus === 'IN_REVIEW' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                  'bg-slate-800 text-slate-300 border-slate-700'
                }`}>
                  {recordStatus.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Category: <strong className="text-cyan-300">[{record.category_code}] {record.category_name}</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Global Record Actions */}
        <div className="flex flex-wrap items-center gap-2 font-mono">
          {canUndo && (
            <button
              type="button"
              onClick={undo}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition-all flex items-center space-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <Undo className="w-3.5 h-3.5" />
              <span>Undo Action</span>
            </button>
          )}

          <button
            type="button"
            onClick={bulkAcceptHighConfidence}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition-all flex items-center space-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Accept High Conf</span>
          </button>

          <button
            type="button"
            onClick={() => {
              bulkAcceptAll();
              setRecordStatus('APPROVED');
              announce('Product catalog record approved!');
            }}
            className="px-3.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-500/30 transition-all flex items-center space-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Approve & Accept All</span>
          </button>

          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all flex items-center space-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Catalog Feed</span>
          </button>
        </div>
      </div>

      {/* Commerce Readiness Gate */}
      <CommerceReadinessGate
        record={record}
        attributes={attributesState}
        validationResults={stagesData?.validation?.data?.validation || {}}
      />

      {/* Source Authority Conflict Resolver */}
      {conflictAnalysis.conflictsDetected > 0 && (
        <ConflictResolver
          conflicts={conflictAnalysis.conflictsList}
          onResolveConflict={(field, val) => editAttributeValue(field, val)}
        />
      )}

      {/* Duplicate Product Detector */}
      <DuplicateDetector record={record} referenceProducts={referenceProducts} />

      {/* View Switcher Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-2 rounded-xl border border-slate-800 font-mono">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveViewMode('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeViewMode === 'table' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Attribute Review Table
          </button>
          <button
            type="button"
            onClick={() => setActiveViewMode('heatmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeViewMode === 'heatmap' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Confidence Heatmap
          </button>
          <button
            type="button"
            onClick={() => setActiveViewMode('diff')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeViewMode === 'diff' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Data Diff View
          </button>
          <button
            type="button"
            onClick={() => setActiveViewMode('rules')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeViewMode === 'rules' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Validation Explorer
          </button>
          <button
            type="button"
            onClick={() => setActiveViewMode('scorecard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeViewMode === 'scorecard' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Supplier Scorecard
          </button>
          <button
            type="button"
            onClick={() => setActiveViewMode('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeViewMode === 'timeline' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Audit Timeline
          </button>
        </div>

        {/* Table Search & Filter controls */}
        {activeViewMode === 'table' && (
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Search attribute..."
                className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <select
              value={filterConfidence}
              onChange={(e) => setFilterConfidence(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Confidence</option>
              <option value="HIGH">High Only</option>
              <option value="MEDIUM">Medium Only</option>
              <option value="LOW">Low Only</option>
            </select>
          </div>
        )}
      </div>

      {/* VIEW 1: Interactive Table with Keyboard Shortcuts */}
      {activeViewMode === 'table' && (
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="p-3">Attribute</th>
                <th className="p-3">Value</th>
                <th className="p-3">Confidence</th>
                <th className="p-3">Source & Evidence</th>
                <th className="p-3 text-right">Governance & Explainability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/40">
              {filteredAttributes.map(([key, attr]) => {
                const isEditing = editKey === key;
                const isFocused = keyboardFocusedKey === key;

                return (
                  <tr
                    key={key}
                    tabIndex={0}
                    onFocus={() => setKeyboardFocusedKey(key)}
                    className={`transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      isFocused ? 'bg-amber-500/10' :
                      attr.status === 'accepted' ? 'bg-emerald-950/10' :
                      attr.status === 'rejected' ? 'bg-rose-950/20 opacity-60' :
                      attr.status === 'edited' ? 'bg-amber-950/20' : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="p-3 font-bold text-slate-200">
                      <div className="flex items-center space-x-1.5">
                        <span>{key}</span>
                        {attr.conflict?.detected && (
                          <span className="text-[9px] bg-rose-500/20 text-rose-400 px-1.5 py-0.2 rounded font-bold">
                            Conflict
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3">
                      {isEditing ? (
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="bg-slate-950 border border-amber-500 rounded px-2 py-1 text-xs text-slate-100 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(key)}
                            aria-label={`Save ${key}`}
                            className="p-1 bg-amber-500 text-slate-950 rounded hover:bg-amber-400"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className={`font-semibold ${
                          attr.status === 'rejected' ? 'line-through text-slate-500' : 'text-amber-300'
                        }`}>
                          {String(attr.value)} {attr.normalized_unit ? `(${attr.normalized_unit})` : ''}
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        attr.confidence === 'high' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        attr.confidence === 'medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        <span>{attr.confidence === 'high' ? '✓' : attr.confidence === 'medium' ? '⚠️' : '!'}</span>
                        <span>{attr.confidence}</span>
                      </span>
                    </td>

                    <td className="p-3 space-y-0.5">
                      <span className="inline-block text-[9px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                        {attr.source || 'extracted'}
                      </span>
                      <p className="text-[10px] text-slate-400 italic line-clamp-1 font-sans">
                        {attr.reasoning}
                      </p>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedEvidenceKey(key)}
                          aria-label={`Why this value for ${key}`}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] rounded-lg border border-slate-700 flex items-center space-x-1"
                        >
                          <HelpCircle className="w-3 h-3" />
                          <span>Why this value?</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAttributeStatus(key, 'accepted');
                            announce(`Accepted ${key}`);
                          }}
                          aria-label={`Accept ${key}`}
                          className={`p-1.5 rounded-lg transition-all ${
                            attr.status === 'accepted'
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-slate-700'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditKey(key);
                            setEditValue(String(attr.value));
                          }}
                          aria-label={`Edit ${key}`}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setAttributeStatus(key, 'rejected');
                            announce(`Rejected ${key}`);
                          }}
                          aria-label={`Reject ${key}`}
                          className={`p-1.5 rounded-lg transition-all ${
                            attr.status === 'rejected'
                              ? 'bg-rose-500 text-slate-950'
                              : 'bg-slate-800 text-slate-400 hover:text-rose-400 hover:bg-slate-700'
                          }`}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* VIEW 2: Confidence Heatmap */}
      {activeViewMode === 'heatmap' && <ConfidenceHeatmap attributes={attributesState} />}

      {/* VIEW 3: Data Diff View */}
      {activeViewMode === 'diff' && <DataDiffView stagesData={stagesData} attributesState={attributesState} />}

      {/* VIEW 4: Validation Explorer */}
      {activeViewMode === 'rules' && <ValidationExplorer validationData={stagesData?.validation?.data?.validation || {}} />}

      {/* VIEW 5: Supplier Scorecard */}
      {activeViewMode === 'scorecard' && <SupplierScorecard record={record} attributes={attributesState} />}

      {/* VIEW 6: Audit Timeline */}
      {activeViewMode === 'timeline' && <AuditTimeline stagesData={stagesData} recordStatus={recordStatus} />}

      {/* Pipeline Diagnostics Panel */}
      <PipelineDiagnostics pipelineState={{ stages: stagesData }} />

      {/* Explainable AI Evidence Drawer */}
      {selectedEvidenceKey && (
        <EvidenceDrawer
          attributeKey={selectedEvidenceKey}
          attributeData={attributesState[selectedEvidenceKey]}
          onClose={() => setSelectedEvidenceKey(null)}
        />
      )}

      {/* Multi-Format Export Modal */}
      {showExportModal && (
        <ExportModal
          exportData={getExportData(true)}
          onClose={() => setShowExportModal(false)}
          onToast={onToast}
        />
      )}

    </div>
  );
}
