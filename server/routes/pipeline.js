import express from 'express';
import multer from 'multer';
import { pipelineController } from '../controllers/pipelineController.js';
import { rateLimiter, batchRateLimiter, apiKeyAuth } from '../middleware/security.js';
import { validateBody, extractInputSchema, enrichInputSchema, validateInputSchema, batchInputSchema } from '../middleware/validation.js';

const router = express.Router();

// Hardened Multer Configuration
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image format. Allowed formats: JPEG, PNG, WEBP.'));
    }
  }
});

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
 */
router.get('/knowledge-base', (req, res) => pipelineController.getKnowledgeBase(req, res));

/**
 * POST /api/pipeline/extract
 */
router.post('/pipeline/extract', rateLimiter, apiKeyAuth, handleUpload, validateBody(extractInputSchema), (req, res, next) => pipelineController.extract(req, res, next));

/**
 * POST /api/pipeline/enrich
 */
router.post('/pipeline/enrich', rateLimiter, apiKeyAuth, validateBody(enrichInputSchema), (req, res, next) => pipelineController.enrich(req, res, next));

/**
 * POST /api/pipeline/validate
 */
router.post('/pipeline/validate', rateLimiter, apiKeyAuth, validateBody(validateInputSchema), (req, res, next) => pipelineController.validate(req, res, next));

/**
 * POST /api/pipeline/full
 */
router.post('/pipeline/full', rateLimiter, apiKeyAuth, handleUpload, validateBody(extractInputSchema), (req, res, next) => pipelineController.runFull(req, res, next));

/**
 * POST /api/pipeline/batch
 */
router.post('/pipeline/batch', batchRateLimiter, apiKeyAuth, validateBody(batchInputSchema), (req, res, next) => pipelineController.batch(req, res, next));

/**
 * POST /api/copilot/query
 */
router.post('/copilot/query', rateLimiter, apiKeyAuth, (req, res, next) => pipelineController.copilotQuery(req, res, next));

export default router;
