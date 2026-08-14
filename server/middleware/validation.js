import { z } from 'zod';
import { knowledgeBaseService } from '../services/knowledgeBase.js';

// Input Type Enum
const inputTypeEnum = z.enum(['text', 'name_category', 'image', 'url_doc']);

// Stage 1 Extraction Schema
export const extractInputSchema = z.object({
  inputType: inputTypeEnum.optional().default('text'),
  textContent: z.string().max(5000, 'Text content exceeds maximum limit of 5000 characters').optional(),
  categoryCode: z.string().optional().refine(val => {
    if (!val) return true;
    const knownCodes = knowledgeBaseService.getTaxonomy().map(t => t.code);
    return knownCodes.includes(val) || /^\d{2}-\d{2}-\d{2}$/.test(val);
  }, { message: 'Invalid UNSPSC/ETIM category code format' }),
  imageBase64: z.string().optional()
});

// Stage 2 Enrichment Schema
export const enrichInputSchema = z.object({
  product_name: z.string().optional(),
  category_code: z.string().optional(),
  category_name: z.string().optional(),
  raw_attributes: z.record(z.any()).optional(),
  data: z.object({
    product_name: z.string().optional(),
    category_code: z.string().optional(),
    category_name: z.string().optional(),
    raw_attributes: z.record(z.any()).optional()
  }).optional()
});

// Stage 3 Validation Schema
export const validateInputSchema = z.object({
  product_name: z.string().optional(),
  category_code: z.string().optional(),
  category_name: z.string().optional(),
  enriched_attributes: z.record(z.any()).optional(),
  data: z.object({
    product_name: z.string().optional(),
    category_code: z.string().optional(),
    category_name: z.string().optional(),
    enriched_attributes: z.record(z.any()).optional()
  }).optional()
});

// Batch Pipeline Processing Schema
export const batchInputSchema = z.object({
  items: z.array(z.object({
    id: z.string().optional(),
    inputType: inputTypeEnum.optional().default('text'),
    textContent: z.string().max(5000, 'Text content exceeds 5000 characters').optional(),
    categoryCode: z.string().optional()
  })).min(1, 'Batch must contain at least 1 item').max(10, 'Batch size limit is 10 items per request')
});

/**
 * Validation Middleware Factory for Zod Schemas
 */
export const validateBody = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed: Invalid request payload',
        details: err.errors.map(e => ({ field: e.path.join('.'), message: e.message })),
        requestId: req.headers['x-request-id'] || `req_${Date.now()}`
      });
    }
    next(err);
  }
};
