import { GoogleGenerativeAI } from '@google/generative-ai';
import { knowledgeBaseService } from './knowledgeBase.js';
import dotenv from 'dotenv';
dotenv.config();

class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.modelName = 'gemini-2.0-flash';
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
   * Helper to safely parse JSON from Gemini's text output
   */
  parseJSONResponse(text) {
    let clean = text.trim();
    // Strip markdown code fences if present
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '');
    }
    return JSON.parse(clean);
  }

  /**
   * STAGE 1: INTAKE & EXTRACTION
   * Extract raw attributes from text, category, image base64, or spec sheet text.
   * Explicitly outputs "unknown" for missing attributes.
   */
  async extractProductData({ inputType, textContent, imageBase64, mimeType, categoryCode }) {
    const startTime = Date.now();
    const taxonomy = knowledgeBaseService.getTaxonomy();
    const selectedCategory = categoryCode 
      ? knowledgeBaseService.getCategoryByCode(categoryCode) 
      : knowledgeBaseService.findBestCategory(textContent || '');

    const prompt = `
You are SpecForge's Industrial Extraction AI (Stage 1).
Your task is to analyze the provided industrial product input and extract structured raw attributes.

TAXONOMY CATEGORIES REFERENCE:
${JSON.stringify(taxonomy.map(t => ({ code: t.code, category: t.category, subcategory: t.subcategory, typical_attributes: t.typical_attributes })), null, 2)}

DETECTED/TARGET CATEGORY:
Code: ${selectedCategory.code} (${selectedCategory.category} -> ${selectedCategory.subcategory})
Typical Attributes for this category: ${JSON.stringify(selectedCategory.typical_attributes)}

INPUT TYPE: ${inputType}
${textContent ? `INPUT TEXT:\n"${textContent}"` : ''}

INSTRUCTIONS:
1. Identify the specific Product Name and confirm the 6-digit Category Code from the taxonomy.
2. Extract all raw attributes present in the input matching the category's typical attributes, or any additional relevant technical attributes.
3. CRITICAL RULE FOR ACCURACY: If an attribute is NOT explicitly mentioned or determinable from the input, set its value EXACTLY to "unknown". DO NOT hallucinate or guess missing values in this extraction stage — guessing occurs in Stage 2 (Enrichment).

Respond ONLY with a valid JSON object matching this schema:
{
  "product_name": "String name of product",
  "category_code": "6-digit UNSPSC/ETIM code from taxonomy",
  "category_name": "Category -> Subcategory name",
  "raw_attributes": {
    "attribute_key": "extracted value or unknown"
  },
  "extraction_summary": "Short 1-sentence summary of raw extracted information"
}
`;

    try {
      const model = this.getModel('gemini-2.0-flash');
      let result;

      if (inputType === 'image' && imageBase64) {
        const imagePart = {
          inlineData: {
            data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
            mimeType: mimeType || 'image/jpeg'
          }
        };
        result = await model.generateContent([prompt, imagePart]);
      } else {
        result = await model.generateContent(prompt);
      }

      const responseText = result.response.text();
      const extracted = this.parseJSONResponse(responseText);
      const latencyMs = Date.now() - startTime;

      return {
        stage: 1,
        stageName: 'Intake & Extraction',
        success: true,
        latencyMs,
        data: extracted
      };
    } catch (err) {
      console.error('[GeminiService] Extraction Error:', err);
      // Fallback response for graceful error handling
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
          extraction_summary: `Extraction failed: ${err.message}`
        }
      };
    }
  }

  /**
   * STAGE 2: ENRICHMENT (RAG against specforge-knowledge-base.json)
   * Infers "unknown" fields using retrieved RAG context & reference products.
   * Assigns confidence (high/medium/low) and source (extracted/inferred/category_default) with reasoning.
   */
  async enrichProductData(extractedPayload) {
    const startTime = Date.now();
    const extractedData = extractedPayload.data || extractedPayload;
    const categoryCode = extractedData.category_code || '31-16-15';
    
    // Retrieve RAG Context from Knowledge Base
    const ragContext = knowledgeBaseService.getRAGContext(categoryCode, extractedData.raw_attributes);

    const prompt = `
You are SpecForge's RAG Enrichment AI Engine (Stage 2).
Your task is to take a product record with raw extracted attributes (some of which are "unknown") and enrich it by filling in missing values using the provided RAG Reference Knowledge Base.

PRODUCT TO ENRICH:
Product Name: "${extractedData.product_name}"
Category: ${extractedData.category_name} (Code: ${categoryCode})
Raw Extracted Attributes:
${JSON.stringify(extractedData.raw_attributes, null, 2)}

RAG KNOWLEDGE BASE CONTEXT (Reference Products & Category Standards):
Category Typical Attributes: ${JSON.stringify(ragContext.category.typical_attributes)}
Category Defaults from KB: ${JSON.stringify(ragContext.attributeDefaults, null, 2)}
Matching Reference Products in KB:
${JSON.stringify(ragContext.referenceProducts, null, 2)}

INSTRUCTIONS:
1. For every attribute in raw_attributes (PLUS any missing typical attributes for this category):
   - If raw_attributes already had a valid extracted value (not "unknown"), keep that value! Set source = "extracted", confidence = "high", and reasoning = "Explicitly extracted from input source."
   - If raw_attributes value is "unknown", use the RAG reference products, physical engineering relationships, and category standards to infer a plausible best-guess value.
     - If derived from a close reference product in KB, set source = "inferred", confidence = "medium", and reasoning = "Inferred from RAG reference product match [id]."
     - If derived from general category defaults, set source = "category_default", confidence = "medium" or "low", and reasoning = "Standard industry baseline for category."
2. Every enriched attribute object MUST have this exact schema:
   {
     "value": string | number | boolean,
     "confidence": "high" | "medium" | "low",
     "source": "extracted" | "inferred" | "category_default",
     "reasoning": "Short concise string explaining origin"
   }

Respond ONLY with a valid JSON object matching this schema:
{
  "product_name": "${extractedData.product_name}",
  "category_code": "${categoryCode}",
  "category_name": "${extractedData.category_name}",
  "enriched_attributes": {
    "attribute_key": {
      "value": "Value",
      "confidence": "high|medium|low",
      "source": "extracted|inferred|category_default",
      "reasoning": "Reasoning text"
    }
  },
  "enrichment_summary": "Summary of attributes enriched vs extracted"
}
`;

    try {
      const model = this.getModel('gemini-2.0-flash');
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const enriched = this.parseJSONResponse(responseText);
      const latencyMs = Date.now() - startTime;

      return {
        stage: 2,
        stageName: 'Enrichment (RAG Engine)',
        success: true,
        latencyMs,
        ragContextUsed: {
          categoryCode,
          referenceProductsCount: ragContext.referenceProducts.length,
          rulesCount: ragContext.applicableRules.length
        },
        data: enriched
      };
    } catch (err) {
      console.error('[GeminiService] Enrichment Error:', err);
      // Fallback enrichment using deterministic KB defaults
      const fallbackAttrs = {};
      const raw = extractedData.raw_attributes || {};

      Object.keys(raw).forEach(key => {
        const val = raw[key];
        if (val !== 'unknown' && val !== undefined) {
          fallbackAttrs[key] = {
            value: val,
            confidence: 'high',
            source: 'extracted',
            reasoning: 'Extracted from source input'
          };
        } else {
          const defVal = ragContext.attributeDefaults[key] || 'Standard';
          fallbackAttrs[key] = {
            value: defVal,
            confidence: 'medium',
            source: 'category_default',
            reasoning: `Fallback category default from knowledge base`
          };
        }
      });

      return {
        stage: 2,
        stageName: 'Enrichment (RAG Engine)',
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
   * Validates attributes against consistency rules (e.g. bearing diameters, motor poles/rpm, pump inlet/outlet).
   * Generates quality score and violation reports.
   */
  async validateProductData(enrichedPayload) {
    const startTime = Date.now();
    const enrichedData = enrichedPayload.data || enrichedPayload;
    const categoryName = enrichedData.category_name || '';

    // Step 1: Run deterministic KB consistency rules
    const deterministicViolations = knowledgeBaseService.validateAttributes(
      categoryName, 
      enrichedData.enriched_attributes || {}
    );

    const prompt = `
You are SpecForge's Validation & Quality Control AI Engine (Stage 3).
Your task is to audit a structured industrial product record for physical engineering consistency, attribute cross-validation, and catalog readiness.

ENRICHED PRODUCT RECORD:
Product Name: "${enrichedData.product_name}"
Category: ${categoryName} (Code: ${enrichedData.category_code})
Attributes:
${JSON.stringify(enrichedData.enriched_attributes, null, 2)}

DETERMINISTIC KNOWLEDGE BASE RULE CHECKS PERFORMED:
${JSON.stringify(deterministicViolations, null, 2)}

INSTRUCTIONS:
1. Review all attribute values, confidence scores, and physical relationships.
2. Check for technical contradictions (e.g. invalid units, impossible physical dimensions, material/temperature incompatibilities).
3. Calculate an overall Data Quality Score (0 to 100) based on confidence levels, completeness, and consistency.
4. Assign an overall record validation status: "valid" (no major issues), "warning" (minor issues/low confidence), or "error" (critical rule violations).

Respond ONLY with a valid JSON object matching this schema:
{
  "status": "valid" | "warning" | "error",
  "quality_score": 85,
  "summary": "Validation audit narrative summary",
  "rule_violations": [
    {
      "rule": "Rule description",
      "severity": "warning" | "error",
      "field": "attribute_name",
      "message": "Specific explanation of contradiction"
    }
  ],
  "recommendations": [
    "Recommended human review action"
  ]
}
`;

    try {
      const model = this.getModel('gemini-2.0-flash');
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const aiValidation = this.parseJSONResponse(responseText);

      // Merge deterministic violations with AI audit results to prevent missing any KB rule
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
            summary: aiValidation.summary || 'Validation completed successfully.',
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
            summary: `Validation completed with deterministic rules (${err.message})`,
            rule_violations: deterministicViolations,
            recommendations: ['Review low confidence attributes manually.']
          }
        }
      };
    }
  }

  /**
   * Run complete 4-Stage End-to-End Pipeline for a single product
   */
  async runFullPipeline(inputData) {
    const totalStart = Date.now();

    // Stage 1: Extraction
    const extractionResult = await this.extractProductData(inputData);
    
    // Stage 2: RAG Enrichment
    const enrichmentResult = await this.enrichProductData(extractionResult.data || extractionResult);

    // Stage 3: Validation & Traceability
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
