import { z } from 'zod';

// Stage 1 AI Extraction Response Schema
export const ExtractionResponseSchema = z.object({
  product_name: z.string().default('Industrial Product'),
  category_code: z.string().default('31-16-15'),
  category_name: z.string().default('Fasteners -> Hex Bolts'),
  raw_attributes: z.record(z.any()).default({}),
  extraction_summary: z.string().default('Raw attribute extraction complete.')
});

// Stage 2 AI Enrichment Response Schema
export const EnrichedAttributeSchema = z.object({
  value: z.any(),
  confidence: z.enum(['high', 'medium', 'low']).default('medium'),
  source: z.enum(['extracted', 'inferred', 'category_default']).default('inferred'),
  reasoning: z.string().default('Enriched from knowledge base reference patterns.')
});

export const EnrichmentResponseSchema = z.object({
  product_name: z.string(),
  category_code: z.string(),
  category_name: z.string(),
  enriched_attributes: z.record(EnrichedAttributeSchema),
  enrichment_summary: z.string().default('Attribute enrichment complete.')
});

// Stage 3 AI Validation Response Schema
export const RuleViolationSchema = z.object({
  rule: z.string(),
  severity: z.enum(['warning', 'error']).default('warning'),
  field: z.string(),
  message: z.string()
});

export const ValidationResponseSchema = z.object({
  status: z.enum(['valid', 'warning', 'error']).default('valid'),
  quality_score: z.number().min(0).max(100).default(85),
  summary: z.string().default('Validation audit completed.'),
  rule_violations: z.array(RuleViolationSchema).default([]),
  recommendations: z.array(z.string()).default([])
});
