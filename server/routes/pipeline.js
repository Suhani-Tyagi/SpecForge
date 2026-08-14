import express from 'express';
import multer from 'multer';
import { geminiService } from '../services/geminiService.js';
import { knowledgeBaseService } from '../services/knowledgeBase.js';
import { rateLimiter, batchRateLimiter, apiKeyAuth } from '../middleware/security.js';
import { validateBody, extractInputSchema, enrichInputSchema, validateInputSchema, batchInputSchema } from '../middleware/validation.js';

const router = express.Router();

// Hardened Multer Configuration (Size limit + Mimetype allowlist)
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image format. Allowed formats: JPEG, PNG, WEBP.'));
    }
  }
});

// Multer Error Handling Wrapper
const handleUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: `File upload error: ${err.message}`,
        requestId: req.headers['x-request-id'] || `req_${Date.now()}`
      });
    }
    next();
  });
};

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
router.post('/pipeline/extract', rateLimiter, apiKeyAuth, handleUpload, validateBody(extractInputSchema), async (req, res, next) => {
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
    next(err);
  }
});

/**
 * POST /api/pipeline/enrich
 * Stage 2: RAG Enrichment against specforge-knowledge-base.json
 */
router.post('/pipeline/enrich', rateLimiter, apiKeyAuth, validateBody(enrichInputSchema), async (req, res, next) => {
  try {
    const extractedPayload = req.body;
    const result = await geminiService.enrichProductData(extractedPayload);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/pipeline/validate
 * Stage 3: Validation & Traceability
 */
router.post('/pipeline/validate', rateLimiter, apiKeyAuth, validateBody(validateInputSchema), async (req, res, next) => {
  try {
    const enrichedPayload = req.body;
    const result = await geminiService.validateProductData(enrichedPayload);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/pipeline/full
 * End-to-end full pipeline processing (Stage 1 -> Stage 2 -> Stage 3)
 */
router.post('/pipeline/full', rateLimiter, apiKeyAuth, handleUpload, validateBody(extractInputSchema), async (req, res, next) => {
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
    next(err);
  }
});

/**
 * POST /api/pipeline/batch
 * Scalability Demo: Processes 3-10 items through the pipeline
 */
router.post('/pipeline/batch', batchRateLimiter, apiKeyAuth, validateBody(batchInputSchema), async (req, res, next) => {
  try {
    const { items } = req.body;

    const batchResults = [];
    for (const item of items) {
      const itemResult = await geminiService.runFullPipeline({
        inputType: item.inputType || 'text',
        textContent: item.textContent,
        categoryCode: item.categoryCode
      });
      batchResults.push({
        id: item.id || `ITEM-${batchResults.length + 1}`,
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
    next(err);
  }
});

export default router;
