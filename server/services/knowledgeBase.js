import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Statically require seed KB to guarantee inclusion in Vercel serverless bundle
let staticSeedKB = null;
try {
  staticSeedKB = require('../../specforge-knowledge-base.json');
} catch (e) {
  console.warn('[KnowledgeBase] Static require fallback:', e.message);
}

const DEFAULT_CATEGORY_FALLBACK = {
  code: "31-16-15",
  category: "Fasteners",
  subcategory: "Hex Bolts",
  typical_attributes: ["material", "diameter_mm", "length_mm", "thread_pitch", "grade", "coating", "head_type"]
};

class KnowledgeBaseService {
  constructor() {
    this.kb = null;
    this.loadKB();
  }

  loadKB() {
    try {
      const KNOWLEDGE_BASE_PATH = path.resolve(__dirname, '../../specforge-knowledge-base.json');
      if (fs.existsSync(KNOWLEDGE_BASE_PATH)) {
        const data = fs.readFileSync(KNOWLEDGE_BASE_PATH, 'utf-8');
        this.kb = JSON.parse(data);
      } else if (staticSeedKB) {
        this.kb = staticSeedKB;
      } else {
        throw new Error('Knowledge base JSON not found');
      }
      console.log(`[KnowledgeBase] Loaded ${this.getTaxonomy().length} categories, ${this.getReferenceProducts().length} reference products, ${this.getConsistencyRules().length} consistency rules.`);
    } catch (err) {
      console.error('[KnowledgeBase] Warning loading specforge-knowledge-base.json:', err.message);
      this.kb = staticSeedKB || { meta: {}, taxonomy: [DEFAULT_CATEGORY_FALLBACK], reference_products: [], consistency_rules: [] };
    }
  }

  getTaxonomy() {
    return (this.kb && this.kb.taxonomy && this.kb.taxonomy.length > 0) 
      ? this.kb.taxonomy 
      : [DEFAULT_CATEGORY_FALLBACK];
  }

  getReferenceProducts() {
    return (this.kb && this.kb.reference_products) ? this.kb.reference_products : [];
  }

  getConsistencyRules() {
    return (this.kb && this.kb.consistency_rules) ? this.kb.consistency_rules : [];
  }

  getCategoryByCode(code) {
    if (!code) return this.getTaxonomy()[0] || DEFAULT_CATEGORY_FALLBACK;
    const found = this.getTaxonomy().find(cat => cat.code === code);
    return found || this.getTaxonomy()[0] || DEFAULT_CATEGORY_FALLBACK;
  }

  findBestCategory(inputString) {
    const taxonomy = this.getTaxonomy();
    if (!inputString || taxonomy.length === 0) return taxonomy[0] || DEFAULT_CATEGORY_FALLBACK;
    
    const text = inputString.toLowerCase();
    
    // Direct code match
    const codeMatch = taxonomy.find(cat => cat.code === inputString);
    if (codeMatch) return codeMatch;

    // Subcategory or category match
    let bestCat = null;
    let maxScore = 0;

    for (const cat of taxonomy) {
      let score = 0;
      if (cat.subcategory && text.includes(cat.subcategory.toLowerCase())) score += 5;
      if (cat.category && text.includes(cat.category.toLowerCase())) score += 3;
      if (Array.isArray(cat.typical_attributes)) {
        cat.typical_attributes.forEach(attr => {
          if (text.includes(attr.replace(/_/g, ' '))) score += 1;
        });
      }

      if (score > maxScore) {
        maxScore = score;
        bestCat = cat;
      }
    }

    return bestCat || taxonomy[0] || DEFAULT_CATEGORY_FALLBACK;
  }

  /**
   * RAG Lookup: Retrieve reference products and aggregate category metrics for context
   */
  getRAGContext(categoryCode, rawAttributes = {}) {
    const category = this.getCategoryByCode(categoryCode) || DEFAULT_CATEGORY_FALLBACK;
    const categoryRefProducts = this.getReferenceProducts().filter(p => p.category_code === category.code);
    
    // Fallback to all reference products if none in exact category
    const refPool = categoryRefProducts.length > 0 ? categoryRefProducts : this.getReferenceProducts();

    // Aggregate default attributes across reference products
    const attributeDefaults = {};
    const attributeStats = {};

    const attributesList = Array.isArray(category.typical_attributes) ? category.typical_attributes : DEFAULT_CATEGORY_FALLBACK.typical_attributes;

    attributesList.forEach(attrKey => {
      const values = [];
      refPool.forEach(prod => {
        if (prod.attributes && prod.attributes[attrKey]) {
          values.push(prod.attributes[attrKey].value);
        }
      });

      if (values.length > 0) {
        // Use most frequent value or first value as category default
        attributeDefaults[attrKey] = values[0];
        attributeStats[attrKey] = {
          sampleValues: values,
          count: values.length
        };
      }
    });

    return {
      category,
      referenceProducts: refPool,
      attributeDefaults,
      attributeStats,
      applicableRules: this.getRulesForCategory(category.category)
    };
  }

  getRulesForCategory(categoryName) {
    if (!categoryName) return this.getConsistencyRules();
    return this.getConsistencyRules().filter(r => 
      r.applies_to.toLowerCase() === categoryName.toLowerCase() ||
      categoryName.toLowerCase().includes(r.applies_to.toLowerCase())
    );
  }

  /**
   * Validate consistency rules on product attributes
   */
  validateAttributes(categoryName, attributes = {}) {
    const rules = this.getRulesForCategory(categoryName);
    const violations = [];

    // Helper to get raw numeric/string value from attribute object or primitive
    const getVal = (key) => {
      const field = attributes[key];
      if (field === undefined || field === null) return null;
      const v = typeof field === 'object' ? field.value : field;
      if (v === 'unknown' || v === '' || v === null || v === undefined) return null;
      const num = parseFloat(v);
      return isNaN(num) ? v : num;
    };

    rules.forEach(rule => {
      const text = rule.rule.toLowerCase();

      // Rule 1: Fasteners - diameter_mm < length_mm
      if (text.includes('diameter_mm must be less than length_mm')) {
        const dia = getVal('diameter_mm');
        const len = getVal('length_mm');
        if (dia !== null && len !== null && typeof dia === 'number' && typeof len === 'number') {
          if (dia >= len) {
            violations.push({
              rule: rule.rule,
              severity: rule.severity,
              field: 'diameter_mm',
              message: `Diameter (${dia}mm) must be less than length (${len}mm) for standard fasteners.`
            });
          }
        }
      }

      // Rule 2: Bearings - outer_diameter_mm > bore_diameter_mm
      if (text.includes('outer_diameter_mm must be greater than bore_diameter_mm')) {
        const od = getVal('outer_diameter_mm');
        const id = getVal('bore_diameter_mm');
        if (od !== null && id !== null && typeof od === 'number' && typeof id === 'number') {
          if (od <= id) {
            violations.push({
              rule: rule.rule,
              severity: rule.severity,
              field: 'outer_diameter_mm',
              message: `Outer diameter (${od}mm) must be strictly greater than bore diameter (${id}mm).`
            });
          }
        }
      }

      // Rule 3: Motors - RPM correlation
      if (text.includes('rpm should correlate')) {
        const rpm = getVal('rpm');
        if (rpm !== null && typeof rpm === 'number') {
          const isValidRpm = (rpm > 650 && rpm < 1100) || (rpm > 1200 && rpm < 1650) || (rpm > 2500 && rpm < 3300);
          if (!isValidRpm && rpm > 0) {
            violations.push({
              rule: rule.rule,
              severity: rule.severity,
              field: 'rpm',
              message: `RPM value (${rpm}) deviates from standard AC induction motor pole ranges.`
            });
          }
        }
      }

      // Rule 4: Pumps - outlet_size_mm <= inlet_size_mm
      if (text.includes('outlet_size_mm is typically less than or equal to inlet_size_mm')) {
        const outlet = getVal('outlet_size_mm');
        const inlet = getVal('inlet_size_mm');
        if (outlet !== null && inlet !== null && typeof outlet === 'number' && typeof inlet === 'number') {
          if (outlet > inlet) {
            violations.push({
              rule: rule.rule,
              severity: rule.severity,
              field: 'outlet_size_mm',
              message: `Pump outlet size (${outlet}mm) exceeds inlet size (${inlet}mm).`
            });
          }
        }
      }

      // Rule 5: Valves - max_temp_c vs material
      if (text.includes('max_temp_c should be consistent with stated material')) {
        const temp = getVal('max_temp_c');
        const mat = (getVal('material') || '').toString().toLowerCase();
        if (temp !== null && typeof temp === 'number' && mat.includes('pvc')) {
          if (temp > 60) {
            violations.push({
              rule: rule.rule,
              severity: rule.severity,
              field: 'max_temp_c',
              message: `Max temperature (${temp}°C) exceeds safety rating for PVC material.`
            });
          }
        }
      }
    });

    return violations;
  }
}

export const knowledgeBaseService = new KnowledgeBaseService();
