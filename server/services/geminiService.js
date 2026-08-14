import { GoogleGenerativeAI } from '@google/generative-ai';
import { knowledgeBaseService } from './knowledgeBase.js';
import { sanitizeSupplierInput } from '../middleware/promptSanitizer.js';
import { normalizeEnrichedAttributes } from '../utils/unitNormalizer.js';
import { ExtractionResponseSchema, EnrichmentResponseSchema, ValidationResponseSchema } from '../schemas/aiSchemas.js';
import dotenv from 'dotenv';

dotenv.config();

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.modelName = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    if (!this.apiKey) {
      console.warn('[GeminiService] Warning: GEMINI_API_KEY environment variable is not set.');
    }
  }

  getAIClient() {
    if (!this.apiKey && process.env.GEMINI_API_KEY) {
      this.apiKey = process.env.GEMINI_API_KEY;
    }
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in backend environment.');
    }
    return new GoogleGenerativeAI(this.apiKey);
  }

  getModel(modelName = this.modelName) {
    const ai = this.getAIClient();
    return ai.getGenerativeModel({ model: modelName });
  }

  /**
   * Helper to safely parse JSON with markdown code fence stripping
   */
  parseJSONResponse(text) {
    let clean = text.trim();
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
    }
    return JSON.parse(clean);
  }

  /**
   * Exponential backoff retry execution wrapper for Gemini API calls
   */
  async executeWithRetry(apiFn, retries = 2, delayMs = 1000) {
    let lastError;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await apiFn();
      } catch (err) {
        lastError = err;
        console.warn(`[GeminiService] API Call Attempt ${attempt + 1} failed: ${err.message}. Retrying in ${delayMs}ms...`);
        if (attempt < retries) {
          await new Promise(res => setTimeout(res, delayMs * Math.pow(2, attempt)));
        }
      }
    }
    throw lastError;
  }

  /**
   * STAGE 1: INTAKE & AI EXTRACTION
   */
  async extractProductData({ inputType, textContent, imageBase64, mimeType, categoryCode }) {
    const startTime = Date.now();
    const taxonomy = knowledgeBaseService.getTaxonomy();
    const selectedCategory = categoryCode 
      ? knowledgeBaseService.getCategoryByCode(categoryCode) 
      : knowledgeBaseService.findBestCategory(textContent || '');

    const sanitizedText = sanitizeSupplierInput(textContent || '');

    const prompt = `
You are SpecForge's Industrial Extraction AI (Stage 1).
Your task is to analyze the provided industrial product input and extract raw technical attributes.

TAXONOMY REFERENCE:
${JSON.stringify(taxonomy.map(t => ({ code: t.code, category: t.category, subcategory: t.subcategory, typical_attributes: t.typical_attributes })), null, 2)}

DETECTED/TARGET CATEGORY:
Code: ${selectedCategory.code} (${selectedCategory.category} -> ${selectedCategory.subcategory})
Typical Attributes: ${JSON.stringify(selectedCategory.typical_attributes)}

INPUT TYPE: ${inputType}
${sanitizedText}

INSTRUCTIONS:
1. Identify the specific Product Name and confirm the Category Code.
2. Extract raw attributes matching typical category attributes or other present technical specs.
3. CRITICAL FIDELITY RULE: If an attribute is NOT explicitly mentioned or determinable from input, set value EXACTLY to "unknown". DO NOT guess missing values in this extraction stage!

Respond ONLY with valid JSON matching this schema:
{
  "product_name": "Product Name",
  "category_code": "${selectedCategory.code}",
  "category_name": "${selectedCategory.category} -> ${selectedCategory.subcategory}",
  "raw_attributes": {
    "attribute_key": "extracted value or unknown"
  },
  "extraction_summary": "Short 1-sentence extraction summary"
}
`;

    try {
      const model = this.getModel();
      const apiCall = async () => {
        if (inputType === 'image' && imageBase64) {
          const imagePart = {
            inlineData: {
              data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
              mimeType: mimeType || 'image/jpeg'
            }
          };
          return await model.generateContent([prompt, imagePart]);
        } else {
          return await model.generateContent(prompt);
        }
      };

      const result = await this.executeWithRetry(apiCall);
      const responseText = result.response.text();
      let rawJson = this.parseJSONResponse(responseText);

      // Zod Validation & Auto-Repair fallback
      const validated = ExtractionResponseSchema.safeParse(rawJson);
      if (!validated.success) {
        console.warn('[GeminiService] Stage 1 Zod validation warnings:', validated.error.errors);
      }

      const finalData = validated.success ? validated.data : rawJson;
      const latencyMs = Date.now() - startTime;

      return {
        stage: 1,
        stageName: 'Intake & Extraction',
        success: true,
        latencyMs,
        data: finalData
      };
    } catch (err) {
      console.error('[GeminiService] Extraction Error:', err);
      return {
        stage: 1,
        stageName: 'Intake & Extraction',
        success: false,
        error: err.message,
        data: {
          product_name: textContent ? textContent.slice(0, 40) : 'Industrial Component',
          category_code: selectedCategory.code,
          category_name: `${selectedCategory.category} -> ${selectedCategory.subcategory}`,
          raw_attributes: selectedCategory.typical_attributes.reduce((acc, k) => ({ ...acc, [k]: 'unknown' }), {}),
          extraction_summary: `Extraction fallback: ${err.message}`
        }
      };
    }
  }

  /**
   * STAGE 2: RAG ENRICHMENT ENGINE
   */
  async enrichProductData(extractedPayload) {
    const startTime = Date.now();
    const extractedData = extractedPayload.data || extractedPayload;
    const categoryCode = extractedData.category_code || '31-16-15';
    
    // Retrieve RAG Context from Knowledge Base
    const ragContext = knowledgeBaseService.getRAGContext(categoryCode, extractedData.raw_attributes);

    const prompt = `
You are SpecForge's RAG Enrichment AI Engine (Stage 2).
Your task is to enrich a product record with raw attributes (some of which are "unknown") by inferring missing values using RAG Reference Knowledge Base patterns.

PRODUCT TO ENRICH:
Product Name: "${extractedData.product_name}"
Category: ${extractedData.category_name} (Code: ${categoryCode})
Raw Extracted Attributes:
${JSON.stringify(extractedData.raw_attributes, null, 2)}

RAG KNOWLEDGE BASE CONTEXT:
Category Typical Attributes: ${JSON.stringify(ragContext.category.typical_attributes)}
Category Defaults: ${JSON.stringify(ragContext.attributeDefaults, null, 2)}
Matching Reference Products in KB:
${JSON.stringify(ragContext.referenceProducts, null, 2)}

INSTRUCTIONS:
1. For every attribute in raw_attributes (plus typical category attributes):
   - If raw_attributes had an explicit value (not "unknown"), KEEP IT! Set source = "extracted", confidence = "high", and reasoning = "Explicitly extracted from input source."
   - If raw_attributes was "unknown", use RAG reference products and engineering norms to infer a plausible value.
     - Derived from reference product: source = "inferred", confidence = "medium", reasoning = "Inferred from RAG reference pattern."
     - Derived from category baseline: source = "category_default", confidence = "medium" or "low", reasoning = "Standard industry baseline."

Respond ONLY with valid JSON matching this schema:
{
  "product_name": "${extractedData.product_name}",
  "category_code": "${categoryCode}",
  "category_name": "${extractedData.category_name}",
  "enriched_attributes": {
    "attribute_key": {
      "value": "Value",
      "confidence": "high|medium|low",
      "source": "extracted|inferred|category_default",
      "reasoning": "Reasoning string"
    }
  },
  "enrichment_summary": "Summary of attributes enriched"
}
`;

    try {
      const model = this.getModel();
      const result = await this.executeWithRetry(() => model.generateContent(prompt));
      const responseText = result.response.text();
      let rawJson = this.parseJSONResponse(responseText);

      // Zod Validation & Auto-Repair fallback
      const validated = EnrichmentResponseSchema.safeParse(rawJson);
      const finalData = validated.success ? validated.data : rawJson;

      // Apply Unit Normalization Layer
      finalData.enriched_attributes = normalizeEnrichedAttributes(finalData.enriched_attributes);

      const latencyMs = Date.now() - startTime;

      return {
        stage: 2,
        stageName: 'RAG Enrichment Engine',
        success: true,
        latencyMs,
        ragContextUsed: {
          categoryCode,
          referenceProductsCount: ragContext.referenceProducts.length,
          rulesCount: ragContext.applicableRules.length
        },
        data: finalData
      };
    } catch (err) {
      console.error('[GeminiService] Enrichment Error:', err);
      const fallbackAttrs = normalizeEnrichedAttributes(
        Object.keys(extractedData.raw_attributes || {}).reduce((acc, key) => {
          const val = extractedData.raw_attributes[key];
          if (val !== 'unknown' && val !== undefined) {
            acc[key] = { value: val, confidence: 'high', source: 'extracted', reasoning: 'Extracted from source' };
          } else {
            acc[key] = { value: ragContext.attributeDefaults[key] || 'Standard', confidence: 'medium', source: 'category_default', reasoning: 'Fallback category default' };
          }
          return acc;
        }, {})
      );

      return {
        stage: 2,
        stageName: 'RAG Enrichment Engine',
        success: false,
        error: err.message,
        data: {
          product_name: extractedData.product_name || 'Industrial Product',
          category_code: categoryCode,
          category_name: extractedData.category_name || 'Industrial Equipment',
          enriched_attributes: fallbackAttrs,
          enrichment_summary: `Enrichment fallback applied: ${err.message}`
        }
      };
    }
  }

  /**
   * STAGE 3: VALIDATION & TRACEABILITY
   */
  async validateProductData(enrichedPayload) {
    const startTime = Date.now();
    const enrichedData = enrichedPayload.data || enrichedPayload;
    const categoryName = enrichedData.category_name || '';

    // Step 1: Execute deterministic Knowledge Base rules engine first
    const deterministicViolations = knowledgeBaseService.validateAttributes(
      categoryName, 
      enrichedData.enriched_attributes || {}
    );

    const prompt = `
You are SpecForge's Validation & Quality Control AI Engine (Stage 3).
Audit this structured product record for physical engineering consistency and catalog readiness.

ENRICHED PRODUCT RECORD:
Product Name: "${enrichedData.product_name}"
Category: ${categoryName} (Code: ${enrichedData.category_code})
Attributes:
${JSON.stringify(enrichedData.enriched_attributes, null, 2)}

DETERMINISTIC RULE CHECKS PERFORMED:
${JSON.stringify(deterministicViolations, null, 2)}

INSTRUCTIONS:
1. Audit physical dimensions, material ratings, and unit consistency.
2. Calculate overall Data Quality Score (0 to 100) based on confidence levels, completeness, and consistency.
3. Assign status: "valid", "warning", or "error".

Respond ONLY with valid JSON matching this schema:
{
  "status": "valid|warning|error",
  "quality_score": 85,
  "summary": "Validation narrative summary",
  "rule_violations": [
    {
      "rule": "Rule description",
      "severity": "warning|error",
      "field": "attribute_name",
      "message": "Explanation of issue"
    }
  ],
  "recommendations": ["Human review recommendation"]
}
`;

    try {
      const model = this.getModel();
      const result = await this.executeWithRetry(() => model.generateContent(prompt));
      const responseText = result.response.text();
      let rawJson = this.parseJSONResponse(responseText);

      const validated = ValidationResponseSchema.safeParse(rawJson);
      const aiValidation = validated.success ? validated.data : rawJson;

      // Merge deterministic violations with AI findings
      const allViolations = [...deterministicViolations];
      (aiValidation.rule_violations || []).forEach(v => {
        if (!allViolations.some(dv => dv.rule === v.rule || dv.field === v.field)) {
          allViolations.push(v);
        }
      });

      const finalStatus = allViolations.some(v => v.severity === 'error') 
        ? 'error' 
        : allViolations.length > 0 
          ? 'warning' 
          : (aiValidation.status || 'valid');

      const latencyMs = Date.now() - startTime;

      return {
        stage: 3,
        stageName: 'Validation & Traceability',
        success: true,
        latencyMs,
        data: {
          product_name: enrichedData.product_name,
          category_code: enrichedData.category_code,
          category_name: enrichedData.category_name,
          attributes: enrichedData.enriched_attributes,
          validation: {
            status: finalStatus,
            quality_score: aiValidation.quality_score || (finalStatus === 'error' ? 55 : finalStatus === 'warning' ? 78 : 95),
            summary: aiValidation.summary || 'Validation completed.',
            rule_violations: allViolations,
            recommendations: aiValidation.recommendations || []
          }
        }
      };
    } catch (err) {
      console.error('[GeminiService] Validation Error:', err);
      const latencyMs = Date.now() - startTime;
      return {
        stage: 3,
        stageName: 'Validation & Traceability',
        success: false,
        error: err.message,
        data: {
          product_name: enrichedData.product_name,
          category_code: enrichedData.category_code,
          category_name: enrichedData.category_name,
          attributes: enrichedData.enriched_attributes,
          validation: {
            status: deterministicViolations.length > 0 ? 'warning' : 'valid',
            quality_score: 75,
            summary: `Validation fallback applied (${err.message})`,
            rule_violations: deterministicViolations,
            recommendations: ['Review low confidence attributes manually.']
          }
        }
      };
    }
  }

  /**
   * Run complete 3-Stage AI Processing Pipeline
   */
  async runFullPipeline(inputData) {
    const totalStart = Date.now();

    const extractionResult = await this.extractProductData(inputData);
    const enrichmentResult = await this.enrichProductData(extractionResult.data || extractionResult);
    const validationResult = await this.validateProductData(enrichmentResult.data || enrichmentResult);

    const totalLatencyMs = Date.now() - totalStart;

    return {
      success: true,
      totalLatencyMs,
      stages: {
        intake: extractionResult,
        enrichment: enrichmentResult,
        validation: validationResult
      },
      finalRecord: validationResult.data
    };
  }
}

export const geminiService = new GeminiService();
