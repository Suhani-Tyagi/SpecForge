import express from 'express';
import multer from 'multer';
import { geminiService } from '../services/geminiService.js';
import { knowledgeBaseService } from '../services/knowledgeBase.js';

const router = express.Router();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

/**
 * GET /api/knowledge-base
 * Serves taxonomy, reference products, and consistency rules
 */
router.get('/knowledge-base', (req, res) => {
  try {
    res.json({
      success: true,
      taxonomy: knowledgeBaseService.getTaxonomy(),
      reference_products: knowledgeBaseService.getReferenceProducts(),
      consistency_rules: knowledgeBaseService.getConsistencyRules()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/pipeline/extract
 * Stage 1: Intake & Raw Extraction
 */
router.post('/pipeline/extract', upload.single('image'), async (req, res) => {
  try {
    const { inputType, textContent, categoryCode } = req.body;
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
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/pipeline/enrich
 * Stage 2: RAG Enrichment against specforge-knowledge-base.json
 */
router.post('/pipeline/enrich', async (req, res) => {
  try {
    const extractedPayload = req.body;
    const result = await geminiService.enrichProductData(extractedPayload);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/pipeline/validate
 * Stage 3: Validation & Traceability
 */
router.post('/pipeline/validate', async (req, res) => {
  try {
    const enrichedPayload = req.body;
    const result = await geminiService.validateProductData(enrichedPayload);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/pipeline/full
 * End-to-end full pipeline processing (Stage 1 -> Stage 2 -> Stage 3)
 */
router.post('/pipeline/full', upload.single('image'), async (req, res) => {
  try {
    const { inputType, textContent, categoryCode } = req.body;
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
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/pipeline/batch
 * Scalability Demo: Processes 3-5 items through the pipeline
 */
router.post('/pipeline/batch', async (req, res) => {
  try {
    const { items } = req.body; // Array of { id, textContent, categoryCode, inputType }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Items array is required' });
    }

    const batchResults = [];
    for (const item of items) {
      console.log(`[BatchProcessor] Processing item ${item.id}: "${item.textContent?.slice(0, 30)}..."`);
      const itemResult = await geminiService.runFullPipeline({
        inputType: item.inputType || 'text',
        textContent: item.textContent,
        categoryCode: item.categoryCode
      });
      batchResults.push({
        id: item.id,
        itemInput: item,
        result: itemResult
      });
    }

    res.json({
      success: true,
      processedCount: batchResults.length,
      batchResults
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
