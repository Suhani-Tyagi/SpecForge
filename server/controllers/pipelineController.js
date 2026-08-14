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
}

export const pipelineController = new PipelineController();
