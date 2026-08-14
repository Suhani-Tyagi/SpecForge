import { useState, useCallback } from 'react';
import { apiRequest } from '../services/apiClient.js';

export function usePipeline() {
  const [pipelineState, setPipelineState] = useState({
    isProcessing: false,
    activeStage: 0, // 1: Intake, 2: RAG, 3: Validation, 4: Human Review
    completedStages: [],
    stages: {},
    finalRecord: null,
    totalLatencyMs: 0,
    error: null
  });

  const runPipeline = useCallback(async (inputPayload) => {
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
      // Stage 1: Intake & Extraction
      setPipelineState(prev => ({ ...prev, activeStage: 1 }));
      const extractData = await apiRequest('/api/pipeline/extract', {
        method: 'POST',
        body: JSON.stringify(inputPayload)
      });

      setPipelineState(prev => ({
        ...prev,
        completedStages: [...prev.completedStages, 1],
        stages: { ...prev.stages, intake: extractData },
        activeStage: 2
      }));

      // Stage 2: RAG Enrichment Engine
      const enrichData = await apiRequest('/api/pipeline/enrich', {
        method: 'POST',
        body: JSON.stringify(extractData)
      });

      setPipelineState(prev => ({
        ...prev,
        completedStages: [...prev.completedStages, 2],
        stages: { ...prev.stages, enrichment: enrichData },
        activeStage: 3
      }));

      // Stage 3: Engineering & Consistency Validation
      const validateData = await apiRequest('/api/pipeline/validate', {
        method: 'POST',
        body: JSON.stringify(enrichData)
      });

      const endTotal = Date.now() - startTotal;
      const finalProduct = validateData.data || validateData;

      setPipelineState(prev => ({
        ...prev,
        isProcessing: false,
        activeStage: 4, // Ready for Stage 4 Human Review
        completedStages: [1, 2, 3],
        stages: { ...prev.stages, validation: validateData },
        finalRecord: finalProduct,
        totalLatencyMs: endTotal
      }));

      return finalProduct;
    } catch (err) {
      console.error('[usePipeline] Pipeline Error:', err);
      setPipelineState(prev => ({
        ...prev,
        isProcessing: false,
        error: err.message || 'Pipeline execution failed.'
      }));
      throw err;
    }
  }, []);

  return { pipelineState, runPipeline, setPipelineState };
}
