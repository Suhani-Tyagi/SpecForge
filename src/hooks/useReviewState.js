import { useState, useEffect, useCallback } from 'react';

export function useReviewState(initialRecord = null) {
  const [record, setRecord] = useState(initialRecord);
  const [attributesState, setAttributesState] = useState({});
  const [historyStack, setHistoryStack] = useState([]);
  const [recordStatus, setRecordStatus] = useState('PENDING_REVIEW'); // 'PENDING_REVIEW', 'NEEDS_ATTENTION', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'EXPORTED'
  const [filterText, setFilterText] = useState('');
  const [filterConfidence, setFilterConfidence] = useState('ALL');

  useEffect(() => {
    if (initialRecord) {
      setRecord(initialRecord);
      const attrs = initialRecord.attributes || initialRecord.enriched_attributes || {};
      const initialStates = {};

      Object.entries(attrs).forEach(([key, item]) => {
        initialStates[key] = {
          value: typeof item === 'object' ? item.value : item,
          originalValue: typeof item === 'object' ? (item.original_value || item.value) : item,
          normalizedValue: typeof item === 'object' ? item.normalized_value : null,
          normalizedUnit: typeof item === 'object' ? item.normalized_unit : null,
          confidence: typeof item === 'object' ? (item.confidence || 'medium') : 'high',
          source: typeof item === 'object' ? (item.source || 'extracted') : 'extracted',
          reasoning: typeof item === 'object' ? (item.reasoning || 'Extracted attribute') : 'Extracted',
          status: 'pending' // 'accepted', 'rejected', 'edited', 'pending'
        };
      });

      setAttributesState(initialStates);
      setHistoryStack([]);

      const hasViolations = initialRecord.validation?.rule_violations?.length > 0;
      setRecordStatus(hasViolations ? 'NEEDS_ATTENTION' : 'PENDING_REVIEW');
    }
  }, [initialRecord]);

  // Save currentState to history stack before mutating
  const pushHistory = useCallback(() => {
    setHistoryStack(prev => [...prev, JSON.parse(JSON.stringify(attributesState))]);
  }, [attributesState]);

  const undo = useCallback(() => {
    if (historyStack.length === 0) return;
    const previousState = historyStack[historyStack.length - 1];
    setAttributesState(previousState);
    setHistoryStack(prev => prev.slice(0, -1));
  }, [historyStack]);

  const setAttributeStatus = useCallback((key, action) => {
    pushHistory();
    setAttributesState(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        status: action
      }
    }));
    setRecordStatus('IN_REVIEW');
  }, [pushHistory]);

  const editAttributeValue = useCallback((key, newValue) => {
    pushHistory();
    setAttributesState(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        value: newValue,
        status: 'edited',
        reasoning: `Human override: Value updated from "${prev[key].value}" to "${newValue}"`
      }
    }));
    setRecordStatus('IN_REVIEW');
  }, [pushHistory]);

  const bulkAcceptHighConfidence = useCallback(() => {
    pushHistory();
    setAttributesState(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(k => {
        if (updated[k].confidence === 'high') {
          updated[k].status = 'accepted';
        }
      });
      return updated;
    });
    setRecordStatus('IN_REVIEW');
  }, [pushHistory]);

  const bulkAcceptAll = useCallback(() => {
    pushHistory();
    setAttributesState(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(k => {
        updated[k].status = 'accepted';
      });
      return updated;
    });
    setRecordStatus('APPROVED');
  }, [pushHistory]);

  const bulkRejectLowConfidence = useCallback(() => {
    pushHistory();
    setAttributesState(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(k => {
        if (updated[k].confidence === 'low') {
          updated[k].status = 'rejected';
        }
      });
      return updated;
    });
    setRecordStatus('IN_REVIEW');
  }, [pushHistory]);

  // Export Data Builder
  const getExportData = useCallback((exportApprovedOnly = false) => {
    if (!record) return null;
    const cleanAttributes = {};

    Object.entries(attributesState).forEach(([key, item]) => {
      if (item.status !== 'rejected') {
        if (!exportApprovedOnly || item.status === 'accepted' || item.status === 'edited') {
          cleanAttributes[key] = item.value;
        }
      }
    });

    return {
      specforge_id: `SF-PROD-${Date.now().toString().slice(-6)}`,
      product_name: record.product_name,
      category_code: record.category_code,
      category_name: record.category_name,
      quality_score: record.validation?.quality_score || 90,
      validation_status: record.validation?.status || 'valid',
      record_status: recordStatus,
      attributes: cleanAttributes,
      audit_traceability: attributesState,
      exported_at: new Date().toISOString()
    };
  }, [record, attributesState, recordStatus]);

  return {
    record,
    attributesState,
    recordStatus,
    setRecordStatus,
    filterText,
    setFilterText,
    filterConfidence,
    setFilterConfidence,
    canUndo: historyStack.length > 0,
    undo,
    setAttributeStatus,
    editAttributeValue,
    bulkAcceptHighConfidence,
    bulkAcceptAll,
    bulkRejectLowConfidence,
    getExportData
  };
}
