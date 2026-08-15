/**
 * Comprehensive Demo Dataset for SpecForge Competition Transformation
 * Contains realistic industrial product records, forensics multi-source cases,
 * AI Challenger critiques, What-if decision scenarios, decisions requiring attention,
 * trust score calculations, business impact metrics, and category plugins.
 */

export const DEMO_PRODUCTS = [
  {
    id: "PROD-MOTOR-01",
    sku: "SF-MTR-415V-5HP",
    name: "Industrial 3-Phase Induction Motor 5HP",
    category: "Electric Motors & Drives",
    categoryCode: "23-15-16",
    supplier: "ElectroDrive Corp",
    supplierId: "SUP-001",
    confidence: 0.98,
    trustScore: 96,
    riskScore: 12,
    riskLevel: "LOW",
    commerceStatus: "READY",
    lastUpdated: "2026-08-15 14:20",
    rawInput: "Industrial motor, 5 HP, 415V, 3 phase, 1440 RPM, IP55 protection class, IE3 efficiency, Cast Iron frame 112M.",
    attributes: {
      power: { value: "3.7 kW (5 HP)", confidence: 0.99, source: "Supplier PDF (pg 2)", status: "VERIFIED", normalized: "3.7 kW" },
      voltage: { value: "415 V", confidence: 0.98, source: "Supplier Spec Sheet", status: "VERIFIED", normalized: "415 V" },
      phase: { value: "3 Phase", confidence: 0.99, source: "Supplier PDF", status: "VERIFIED", normalized: "3 Phase" },
      speed: { value: "1440 RPM", confidence: 0.96, source: "Supplier PDF", status: "VERIFIED", normalized: "1440 RPM" },
      protectionClass: { value: "IP55", confidence: 0.97, source: "Nameplate Image", status: "VERIFIED", normalized: "IP55" },
      efficiencyClass: { value: "IE3 Premium", confidence: 0.95, source: "Product Catalog", status: "VERIFIED", normalized: "IE3" },
      frameMaterial: { value: "Cast Iron", confidence: 0.94, source: "Supplier PDF", status: "VERIFIED", normalized: "Cast Iron" }
    },
    conflicts: [],
    evidence: [
      { step: "Source Ingestion", detail: "PDF Technical Datasheet (DocID: ED-MTR-2026.pdf) parsed successfully" },
      { step: "AI Extraction", detail: "Gemini 2.0 Flash extracted 8 spec key-values with 98% mean confidence" },
      { step: "RAG Enrichment", detail: "Matched against Category 23-15-16 schema. Standard nominal voltage verified." },
      { step: "Engineering Rules", detail: "Passed rule EV-001 (Motor 5HP matching 3.7kW standard rating)." },
      { step: "Source Authority", detail: "Supplier PDF authoritative hierarchy confirmed over text description." }
    ],
    commerceReadiness: {
      completeness: 100,
      confidence: 98,
      consistency: 100,
      traceability: 100,
      blockingIssues: []
    }
  },
  {
    id: "PROD-MOTOR-02",
    sku: "SF-MTR-415V-CONFL",
    name: "Heavy-Duty Industrial Motor (Conflicting Specs)",
    category: "Electric Motors & Drives",
    categoryCode: "23-15-16",
    supplier: "Global Power Supplies",
    supplierId: "SUP-002",
    confidence: 0.81,
    trustScore: 64,
    riskScore: 68,
    riskLevel: "HIGH",
    commerceStatus: "BLOCKED",
    lastUpdated: "2026-08-15 15:45",
    rawInput: "Source A (PDF): 5 HP, 415 V, 1440 RPM, IP55. Source B (Portal Text): 5 HP, 380 V, 1450 RPM, IP54.",
    attributes: {
      power: { value: "3.7 kW (5 HP)", confidence: 0.98, source: "PDF & Portal Text", status: "VERIFIED", normalized: "3.7 kW" },
      voltage: { value: "415 V (Datasheet) vs 380 V (Web)", confidence: 0.65, source: "CONFLICTING SOURCES", status: "CONFLICT", normalized: "415 V (Authority Selected)" },
      phase: { value: "3 Phase", confidence: 0.95, source: "Supplier PDF", status: "VERIFIED", normalized: "3 Phase" },
      speed: { value: "1440 RPM (PDF) vs 1450 RPM (Text)", confidence: 0.72, source: "CONFLICTING SOURCES", status: "CONFLICT", normalized: "1440 RPM" },
      protectionClass: { value: "IP55 (PDF) vs IP54 (Text)", confidence: 0.70, source: "CONFLICTING SOURCES", status: "CONFLICT", normalized: "IP55" }
    },
    conflicts: [
      { field: "voltage", sourceA: "415 V (Datasheet PDF, pg 3)", sourceB: "380 V (Distributor Web Portal)", resolution: "Datasheet 415V preferred via Authority Hierarchy SA-02", status: "NEEDS_HUMAN_CONFIRMATION" },
      { field: "speed", sourceA: "1440 RPM at 50Hz", sourceB: "1450 RPM at 50Hz", resolution: "Standard 4-pole slip speed 1440 RPM selected", status: "RESOLVED_AUTO" }
    ],
    evidence: [
      { step: "Source Ingestion", detail: "Multi-channel inputs ingested: Datasheet PDF + Distributor API" },
      { step: "AI Extraction", detail: "Gemini detected conflicting voltage (415V vs 380V)" },
      { step: "AI Challenger", detail: "Challenger flagged: 'Distributor API 380V contradicts Manufacturer PDF 415V'" },
      { step: "Conflict Engine", detail: "Triggered Rule SA-02: Manufacturer Datasheet PDF overrides Web API text" }
    ],
    commerceReadiness: {
      completeness: 88,
      confidence: 81,
      consistency: 60,
      traceability: 95,
      blockingIssues: [
        "Primary nominal voltage conflict between Datasheet (415V) and Distributor API (380V)",
        "Enclosure rating requires human sign-off (IP55 vs IP54)"
      ]
    }
  },
  {
    id: "PROD-PUMP-01",
    sku: "SF-PMP-CENT-750W",
    name: "High-Pressure Centrifugal Chemical Pump",
    category: "Pumps & Fluid Handling",
    categoryCode: "24-10-12",
    supplier: "FluidTech Systems",
    supplierId: "SUP-003",
    confidence: 0.74,
    trustScore: 58,
    riskScore: 78,
    riskLevel: "HIGH",
    commerceStatus: "BLOCKED",
    lastUpdated: "2026-08-15 16:10",
    rawInput: "Centrifugal pump 1.0 HP, 2900 RPM, max head 35m, flow rate 120 L/min, SS316 casing. Operating temp missing.",
    attributes: {
      power: { value: "0.75 kW (1.0 HP)", confidence: 0.95, source: "Supplier Text", status: "VERIFIED", normalized: "0.75 kW" },
      maxHead: { value: "35 m", confidence: 0.92, source: "Supplier PDF", status: "VERIFIED", normalized: "35 m" },
      flowRate: { value: "120 L/min (7.2 m³/h)", confidence: 0.90, source: "Supplier PDF", status: "VERIFIED", normalized: "7.2 m³/h" },
      material: { value: "SS316 Stainless Steel", confidence: 0.94, source: "Material Spec Sheet", status: "VERIFIED", normalized: "SS316" },
      maxTemp: { value: "MISSING", confidence: 0.00, source: "N/A", status: "MISSING", normalized: "MISSING" }
    },
    conflicts: [],
    evidence: [
      { step: "Source Ingestion", detail: "Supplier text datasheet ingested" },
      { step: "RAG Schema Check", detail: "Category 24-10-12 mandates Operating Temperature for Chemical Pump safety compliance" },
      { step: "Validation Failure", detail: "FAILED: Critical required attribute 'maxTemp' is unpopulated" }
    ],
    commerceReadiness: {
      completeness: 75,
      confidence: 74,
      consistency: 90,
      traceability: 85,
      blockingIssues: [
        "Missing required safety attribute: Maximum Operating Temperature (maxTemp)"
      ]
    }
  }
];

export const DECISIONS_REQUIRING_ATTENTION = [
  {
    sku: "SF-MTR-415V-CONFL",
    name: "Heavy-Duty Industrial Motor (Conflicting Specs)",
    issue: "Primary Voltage Discrepancy (415V vs 380V)",
    severity: "HIGH",
    affectedAttribute: "Voltage",
    recommendedAction: "Confirm Manufacturer Datasheet (415V) over Distributor Portal (380V)",
    riskScore: 68,
    trustScore: 64,
    supplier: "Global Power Supplies"
  },
  {
    sku: "SF-PMP-CENT-750W",
    name: "High-Pressure Centrifugal Chemical Pump",
    issue: "Missing Required Safety Attribute (Max Operating Temp)",
    severity: "CRITICAL",
    affectedAttribute: "maxTemp",
    recommendedAction: "Request thermal specification datasheet from supplier FluidTech",
    riskScore: 78,
    trustScore: 58,
    supplier: "FluidTech Systems"
  },
  {
    sku: "SF-VLV-BALL-2IN",
    name: "Pneumatic Actuated Ball Valve 2-Inch",
    issue: "Low-Confidence Body Material Extraction (45%)",
    severity: "CRITICAL",
    affectedAttribute: "bodyMaterial",
    recommendedAction: "Verify material test certificate for pressure vessel safety",
    riskScore: 84,
    trustScore: 42,
    supplier: "Apex Industrial Valve Co"
  }
];

export const FORENSICS_CASE = {
  sku: "SF-MTR-415V-CONFL",
  productName: "Heavy-Duty Industrial Motor 5HP",
  targetAttribute: "Voltage",
  sources: [
    {
      id: "SRC-01",
      name: "Manufacturer Technical Datasheet (PDF)",
      page: 3,
      section: "Electrical Nominal Ratings",
      rawText: "Nominal Operating Voltage: 415 V AC +/- 10% @ 50 Hz, 3-Phase Delta connection.",
      claimedValue: "415 V",
      authorityWeight: 1.0,
      trustRating: "High (Authoritative Manufacturer Doc)"
    },
    {
      id: "SRC-02",
      name: "Distributor Web Portal Listing (JSON)",
      page: "N/A (API)",
      section: "Quick Specs Table",
      rawText: "Voltage: 380V AC, 3 Phase, 50Hz, Standard European Industrial Rating.",
      claimedValue: "380 V",
      authorityWeight: 0.6,
      trustRating: "Medium (Distributor Portal API Text)"
    },
    {
      id: "SRC-03",
      name: "Supplier Invoice Text Document",
      page: 1,
      section: "Line Item Description",
      rawText: "Induction Motor 5HP 415V 1440RPM Cast Iron Frame.",
      claimedValue: "415 V",
      authorityWeight: 0.8,
      trustRating: "High (Invoice Confirmation)"
    }
  ],
  aiExtraction: {
    candidateValue: "415 V",
    confidence: 0.98,
    method: "Gemini 2.0 Multimodal OCR + Structure Parser"
  },
  aiChallenger: {
    critique: "ALERT: Source B (Distributor Web Portal) claims 380V, whereas Source A (Datasheet) and Source C (Invoice) claim 415V. Is 380V a regional 60Hz variant or a supplier catalog typo?",
    finding: "Cross-source discrepancy detected. Datasheet authority rule SA-02 invoked."
  },
  engineeringValidation: {
    ruleId: "EV-002",
    ruleName: "Nominal Industrial Voltage Range Check",
    status: "VALID",
    message: "415V is a standard IEC 60034 three-phase nominal rating in Commonwealth/UK grid standards."
  },
  authorityEngine: {
    rule: "SA-02 (Manufacturer PDF > Distributor Text > AI Inference)",
    winner: "415 V (Manufacturer Datasheet PDF, pg 3)",
    score: "415V score: 1.8 vs 380V score: 0.6"
  },
  finalDecision: "415 V",
  recommendation: "APPROVE 415V (Manufacturer Datasheet confirmed authoritative)",
  whyExplanation: "SpecForge selected 415V because the primary Manufacturer Datasheet (Page 3) and Invoice text both confirm 415V, carrying a 1.0 authority weight compared to the 0.6 weight of the Distributor Web Portal text. Engineering Rule EV-002 verified 415V as a standard nominal voltage."
};

export const WHAT_IF_SIMULATION = {
  scenarioA: {
    label: "APPROVE 415 V (SpecForge Recommended)",
    voltage: "415 V",
    affectedSkus: 0,
    compatibilityImpact: "100% Compatible with IEC 60034 400-415V Grids",
    catalogExposure: "Zero Risk",
    publicationStatus: "READY TO PUBLISH",
    riskScore: 12
  },
  scenarioB: {
    label: "APPROVE 380 V (Distributor Portal Value)",
    voltage: "380 V",
    affectedSkus: 42,
    compatibilityImpact: "WARNING: High risk of motor overheating on 415V industrial supplies",
    catalogExposure: "Severe (Buyer Return & Equipment Damage Risk)",
    publicationStatus: "BLOCKED BY SAFETY GOVERNANCE",
    riskScore: 84
  }
};

export const BUSINESS_IMPACT_METRICS = {
  totalProcessed: 12840,
  conflictsDetected: 1420,
  highSeverityConflicts: 317,
  criticalBlocks: 84,
  manualReviewsAvoided: 11340,
  hoursSaved: 4250,
  errorReduction: "96.4% fewer catalog errors",
  estimatedCostSavings: "$174,000 / year (Simulated workload)"
};

export const SUPPLIER_METRICS = [
  {
    id: "SUP-001",
    name: "ElectroDrive Corp",
    category: "Electric Motors & Sensors",
    qualityScore: 94,
    completeness: 97,
    consistency: 96,
    conflictRate: 3,
    traceability: 98,
    productCount: 1420,
    reviewBurden: "Low (4%)",
    reliabilityIndex: "A+ (Tier 1 Certified)",
    status: "PREFERRED",
    aiRecommendation: "Maintain auto-approval status for all standard motor SKUs.",
    policyRule: "ALLOW_AUTO_APPROVAL"
  },
  {
    id: "SUP-002",
    name: "Global Power Supplies",
    category: "Heavy Drives & Transformers",
    qualityScore: 81,
    completeness: 84,
    consistency: 78,
    conflictRate: 12,
    traceability: 89,
    productCount: 850,
    reviewBurden: "Medium (18%)",
    reliabilityIndex: "B+ (Standard)",
    status: "ACTIVE",
    aiRecommendation: "Require secondary voltage verification on 3-phase motor uploads.",
    policyRule: "MANDATORY_VOLTAGE_REVIEW"
  },
  {
    id: "SUP-003",
    name: "FluidTech Systems",
    category: "Pumps & Compressors",
    qualityScore: 76,
    completeness: 79,
    consistency: 82,
    conflictRate: 15,
    traceability: 80,
    productCount: 620,
    reviewBurden: "High (24%)",
    reliabilityIndex: "B- (Requires Review)",
    status: "UNDER_AUDIT",
    aiRecommendation: "Enforce required temperature attribute check before batch ingestion.",
    policyRule: "ENFORCE_TEMP_ATTRIBUTE"
  },
  {
    id: "SUP-004",
    name: "Apex Industrial Valve Co",
    category: "Valves & Flow Controls",
    qualityScore: 68,
    completeness: 71,
    consistency: 65,
    conflictRate: 24,
    traceability: 72,
    productCount: 490,
    reviewBurden: "Critical (36%)",
    reliabilityIndex: "C (High Error Rate)",
    status: "HIGH_RISK",
    aiRecommendation: "Flag 100% of valve SKUs for mandatory engineering sign-off.",
    policyRule: "MANDATORY_HUMAN_GOVERNANCE"
  }
];

export const CATEGORY_PLUGINS = [
  {
    id: "motors",
    name: "Electric Motors & Drives",
    code: "23-15-16",
    status: "ACTIVE",
    requiredFields: ["Power (kW/HP)", "Voltage (V)", "Phase (1Ph/3Ph)", "Speed (RPM)"],
    rulesCount: 14,
    referenceSkus: 420
  },
  {
    id: "pumps",
    name: "Pumps & Fluid Handling",
    code: "24-10-12",
    status: "ACTIVE",
    requiredFields: ["Power (kW/HP)", "Max Head (m)", "Flow Rate (L/min)", "Max Operating Temp"],
    rulesCount: 12,
    referenceSkus: 310
  },
  {
    id: "sensors",
    name: "Sensors & Instrumentation",
    code: "18-12-05",
    status: "ACTIVE",
    requiredFields: ["Pressure Range", "Output Signal (4-20mA)", "Supply Voltage"],
    rulesCount: 10,
    referenceSkus: 280
  },
  {
    id: "valves",
    name: "Valves & Actuators",
    code: "21-04-10",
    status: "ACTIVE",
    requiredFields: ["Valve Size", "Pressure Rating", "Seat Material", "Actuator Type"],
    rulesCount: 9,
    referenceSkus: 190
  },
  {
    id: "hvac",
    name: "HVAC & Climate Control",
    code: "40-10-18",
    status: "PLANNED",
    requiredFields: ["Cooling Capacity (BTU)", "Refrigerant Type", "Airflow Rate (CFM)"],
    rulesCount: 8,
    referenceSkus: 150
  }
];

export const SCALE_BENCHMARKS = {
  100: { products: 100, aiApproved: 88, humanReview: 9, blocked: 3, workloadHoursSaved: 42, processingTimeMinutes: 1.4, costPerProduct: "$0.08" },
  1000: { products: 1000, aiApproved: 875, humanReview: 95, blocked: 30, workloadHoursSaved: 420, processingTimeMinutes: 12.5, costPerProduct: "$0.06" },
  10000: { products: 10000, aiApproved: 8820, humanReview: 910, blocked: 270, workloadHoursSaved: 4250, processingTimeMinutes: 98.0, costPerProduct: "$0.04" },
  100000: { products: 100000, aiApproved: 88900, humanReview: 8900, blocked: 2200, workloadHoursSaved: 43100, processingTimeMinutes: 840.0, costPerProduct: "$0.02" }
};
