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
      // Execute 3-stage AI processing pipeline server-side via /api/pipeline/full
      const fullResponse = await apiRequest('/api/pipeline/full', {
        method: 'POST',
        body: JSON.stringify(inputPayload)
      });

      const endTotal = Date.now() - startTotal;
      const finalProduct = fullResponse.finalRecord || fullResponse.stages?.validation?.data || fullResponse;

      setPipelineState({
        isProcessing: false,
        activeStage: 4, // Stage 4: Ready for Human-In-The-Loop Review & Governance
        completedStages: [1, 2, 3],
        stages: fullResponse.stages || {
          intake: { stage: 1, success: true, data: finalProduct },
          enrichment: { stage: 2, success: true, data: finalProduct },
          validation: { stage: 3, success: true, data: finalProduct }
        },
        finalRecord: finalProduct,
        totalLatencyMs: fullResponse.totalLatencyMs || endTotal,
        error: null
      });

      return finalProduct;
    } catch (err) {
      console.error('[usePipeline] Pipeline Execution Error:', err);
      const userMessage = err.message || 'SpecForge could not complete processing. Please check backend connection.';
      setPipelineState(prev => ({
        ...prev,
        isProcessing: false,
        error: userMessage
      }));
      throw err;
    }
  }, []);

  return { pipelineState, runPipeline, setPipelineState };
}
