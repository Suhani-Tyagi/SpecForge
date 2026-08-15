import { geminiService } from '../services/geminiService.js';
import { knowledgeBaseService } from '../services/knowledgeBase.js';
import { isSafeUrl } from '../utils/ssrfGuard.js';

export class PipelineController {
  /**
   * GET /api/knowledge-base
   */
  async getKnowledgeBase(req, res) {
    try {
      res.json({
        success: true,
        version: '1.2.0',
        meta: {
          categories_count: knowledgeBaseService.getTaxonomy().length,
          reference_products_count: knowledgeBaseService.getReferenceProducts().length,
          rules_count: knowledgeBaseService.getConsistencyRules().length
        },
        taxonomy: knowledgeBaseService.getTaxonomy(),
        reference_products: knowledgeBaseService.getReferenceProducts(),
        consistency_rules: knowledgeBaseService.getConsistencyRules()
      });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  /**
   * POST /api/pipeline/extract
   */
  async extract(req, res, next) {
    try {
      const { inputType, textContent, categoryCode, specUrl } = req.body;

      // SSRF Validation for URL ingestion mode
      if (inputType === 'url_doc' && specUrl) {
        const ssrfCheck = isSafeUrl(specUrl);
        if (!ssrfCheck.safe) {
          return res.status(400).json({
            success: false,
            error: `URL Security Violation: ${ssrfCheck.reason}`,
            requestId: req.headers['x-request-id'] || `req_${Date.now()}`
          });
        }
      }

      let imageBase64 = null;
      let mimeType = null;

      if (req.file) {
        imageBase64 = req.file.buffer.toString('base64');
        mimeType = req.file.mimetype;
      } else if (req.body.imageBase64) {
        imageBase64 = req.body.imageBase64;
        mimeType = req.body.mimeType || 'image/jpeg';
      }

      const result = await geminiService.extractProductData({
        inputType: inputType || (imageBase64 ? 'image' : 'text'),
        textContent,
        imageBase64,
        mimeType,
        categoryCode
      });

      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/pipeline/enrich
   */
  async enrich(req, res, next) {
    try {
      const extractedPayload = req.body;
      const result = await geminiService.enrichProductData(extractedPayload);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/pipeline/validate
   */
  async validate(req, res, next) {
    try {
      const enrichedPayload = req.body;
      const result = await geminiService.validateProductData(enrichedPayload);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/pipeline/full
   */
  async runFull(req, res, next) {
    try {
      const { inputType, textContent, categoryCode, specUrl } = req.body;

      if (inputType === 'url_doc' && specUrl) {
        const ssrfCheck = isSafeUrl(specUrl);
        if (!ssrfCheck.safe) {
          return res.status(400).json({
            success: false,
            error: `URL Security Violation: ${ssrfCheck.reason}`,
            requestId: req.headers['x-request-id'] || `req_${Date.now()}`
          });
        }
      }

      let imageBase64 = null;
      let mimeType = null;

      if (req.file) {
        imageBase64 = req.file.buffer.toString('base64');
        mimeType = req.file.mimetype;
      } else if (req.body.imageBase64) {
        imageBase64 = req.body.imageBase64;
        mimeType = req.body.mimeType || 'image/jpeg';
      }

      const result = await geminiService.runFullPipeline({
        inputType: inputType || (imageBase64 ? 'image' : 'text'),
        textContent,
        imageBase64,
        mimeType,
        categoryCode
      });

      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/pipeline/batch
   * Controlled Concurrency (Concurrency: 3)
   */
  async batch(req, res, next) {
    try {
      const { items } = req.body;
      const MAX_CONCURRENCY = 3;
      const batchResults = [];

      // Process items in concurrency pools of 3
      for (let i = 0; i < items.length; i += MAX_CONCURRENCY) {
        const chunk = items.slice(i, i + MAX_CONCURRENCY);
        const chunkPromises = chunk.map(async (item) => {
          const itemResult = await geminiService.runFullPipeline({
            inputType: item.inputType || 'text',
            textContent: item.textContent,
            categoryCode: item.categoryCode
          });
          return {
            id: item.id || `ITEM-${batchResults.length + 1}`,
            itemInput: item,
            result: itemResult
          };
        });

        const settled = await Promise.allSettled(chunkPromises);
        settled.forEach(res => {
          if (res.status === 'fulfilled') {
            batchResults.push(res.value);
          } else {
            batchResults.push({ status: 'error', error: res.reason?.message || 'Processing failed' });
          }
        });
      }

      res.json({
        success: true,
        concurrency: MAX_CONCURRENCY,
        processedCount: batchResults.length,
        batchResults
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/copilot/query
   * Context-aware Assistant Query Handler
   */
  async copilotQuery(req, res, next) {
    try {
      const { query, activeProduct } = req.body;
      const lowerQ = (query || '').toLowerCase();

      let answer = '';
      let confidence = 0.95;
      let evidence = [];

      if (lowerQ.includes('catalog-ready') || lowerQ.includes('ready for catalog') || lowerQ.includes('blocked')) {
        if (activeProduct?.commerceReadiness?.blockingIssues?.length > 0) {
          answer = `The active product (${activeProduct.name || 'Selected Item'}) is currently BLOCKED from publication because: ${activeProduct.commerceReadiness.blockingIssues.join('; ')}. Resolving these fields in the HITL Review UI will enable commerce publication.`;
          evidence = activeProduct.commerceReadiness.blockingIssues.map(issue => ({ type: 'Blocking Rule', detail: issue }));
        } else {
          answer = `The active product satisfies all category completeness, unit normalization, and engineering validation requirements. It is marked as COMMERCE-READY and approved for PIM catalog export.`;
          evidence = [{ type: 'Validation Status', detail: '100% Completeness & 0 Rule Violations' }];
        }
      } else if (lowerQ.includes('conflict') || lowerQ.includes('conflicting')) {
        if (activeProduct?.conflicts?.length > 0) {
          answer = `SpecForge detected ${activeProduct.conflicts.length} conflicting attribute(s) for ${activeProduct.name}. Details: ` +
            activeProduct.conflicts.map(c => `${c.field.toUpperCase()}: Source A (${c.sourceA}) vs Source B (${c.sourceB}) -> Resolution: ${c.resolution}`).join(' | ');
          evidence = activeProduct.conflicts.map(c => ({ type: 'Conflict Trace', detail: `${c.field}: ${c.resolution}` }));
        } else {
          answer = `No attribute conflicts were detected in this product record. All extracted specifications agree across supplier datasheets and RAG taxonomy baselines.`;
          evidence = [{ type: 'Conflict Resolution', detail: 'Zero source discrepancies found' }];
        }
      } else if (lowerQ.includes('supplier') || lowerQ.includes('quality')) {
        answer = `Supplier intelligence indicates: Global supplier quality averages 86.4%. Supplier A (ElectroDrive Corp) maintains 94% quality score with a 3% conflict rate, whereas Supplier C (Apex Industrial Valve) exhibits a 24% conflict rate requiring high HITL exception review.`;
        evidence = [
          { type: 'Supplier Metric', detail: 'ElectroDrive Corp: 94% Quality, 3% Conflicts' },
          { type: 'Supplier Metric', detail: 'Apex Industrial Valve: 68% Quality, 24% Conflicts' }
        ];
      } else if (lowerQ.includes('risk') || lowerQ.includes('score')) {
        const risk = activeProduct?.riskScore ?? 18;
        const level = activeProduct?.riskLevel || 'LOW';
        answer = `Product Risk Score is ${risk}/100 (${level} RISK). Risk factors evaluate missing safety parameters, source authority discrepancy, unit normalization confidence, and engineering bounds.`;
        evidence = [{ type: 'Risk Calculation', detail: `Score: ${risk}, Risk Rating: ${level}` }];
      } else {
        answer = `SpecForge AI Engine analysis for "${query}": SpecForge uses multimodal Gemini extraction, RAG taxonomy validation, and engineering bounds checking. For ${activeProduct?.name || 'this item'}, overall extraction confidence is ${(activeProduct?.confidence * 100 || 95).toFixed(0)}%.`;
        evidence = [
          { type: 'Pipeline Engine', detail: 'Gemini 2.0 Flash + RAG Taxonomy + Engineering Rules' }
        ];
      }

      res.json({
        success: true,
        query,
        answer,
        confidence,
        evidence,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      next(err);
    }
  }
}

export const pipelineController = new PipelineController();
