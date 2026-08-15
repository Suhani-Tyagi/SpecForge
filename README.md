# ⚡ SPECForge — AI Product Intelligence & Governance

> **Turn messy supplier information into trusted, commerce-ready product data.**
> SpecForge extracts, validates, challenges and explains product information before it reaches your catalog.

---

## 🎯 Conceptual Backbone Workflow

```
INGEST → EXTRACT → NORMALIZE → VALIDATE → CHALLENGE → RESOLVE → REVIEW → PUBLISH
```

---

## 🌟 Client-Friendly Enterprise User Experience

1. **Intent-Based Landing Screen ("WHAT DO YOU WANT TO DO?")**:
   - **Process Product Data**: Upload PDF/Image/CSV or paste URL for automated AI extraction & validation.
   - **Review Issues**: Inspect products with specification conflicts, missing data or safety rule flags.
   - **Check Suppliers**: Evaluate vendor catalog reliability scores & conflict rates.
   - **View Catalog Health**: Monitor ready, review-required, and blocked product counts.
   - **Manage Knowledge & Rules**: Configure product category schemas, physics validation rules & reference standards.

2. **Primary Product Workflow (`+ PROCESS DATA`)**:
   - **Add Product Data**: Clear choices (`Upload Document`, `Upload Spreadsheet`, `Product URL`, `Enter Manually`) + mandatory pre-submission explanation box (*"What happens next?"*).
   - **Processing Experience**: Real-time progress visualization (`✓ Data received | ✓ Specifications extracted | ✓ Units normalized | ...`).
   - **Analysis Complete**: Direct summary box with `VIEW PRODUCT ANALYSIS` action.

3. **Unified Product Detail View (Central Product Object)**:
   - Consolidates all intelligence into one unified view (`ProductDetail.jsx`):
     - **OVERVIEW**: Quick specs preview, verified fields count, issues flagged, risk level, recommended action CTA (`REVIEW ISSUE`).
     - **SPECIFICATIONS**: Clean specs table with clear status badges (`✓ Verified`, `⚠ Conflict`, `! Missing`, `× Invalid`).
     - **ISSUES & FORENSICS**: Unified SpecForensics multi-source comparison, AI Challenger critique, and resolution options (`Approve Value` / `Send for Human Review`).
     - **EVIDENCE & GRAPH**: Document snippet evidence preview + interactive Evidence Graph.
     - **RISK & TRUST**: Transparent 0–100 Factual Trust Score vs AI Confidence % + What-If Decision Simulator.
     - **HISTORY & AUDIT**: Chronological product audit log.

4. **Catalog Health Dashboard**:
   - Answers *"Why are products blocked?"*, *"Which suppliers cause the most issues?"*, and *"What should we fix first?"*.

5. **Client-Friendly Navigation**:
   - Navigation Bar: `HOME`, `PRODUCTS`, `SUPPLIERS`, `REVIEW`, `KNOWLEDGE`, `ANALYTICS`, `AUDIT`, `SETTINGS` + Global Search & `+ PROCESS DATA` button.
   - Replaces technical jargon (`Process Data`, `Needs Your Attention`, `Product Review`, `Publication Readiness`, `Knowledge & Rules`, `History & Audit`, `SpecForge Assistant`).

6. **Usability & Security Controls**:
   - Global search bar for SKUs, product names, and suppliers.
   - Contextual breadcrumbs (`Products / MTR-204 / Issues / Voltage`).
   - Inline `?` / `Explain` tooltips explaining technical terms.
   - Trust & Security center detailing URL validation, SSRF protection, prompt sanitization, Zod schema validation, and audit trail logging.

---

## 🏆 Judging Criteria Alignment

| Criteria | Product Implementation in SpecForge |
| :--- | :--- |
| **Innovation** | Multimodal Gemini 2.0 extraction, SpecForensics conflict investigation, AI Challenger critique stage, Factual Trust Score vs AI Confidence, What-If decision simulator. |
| **Technical Implementation** | Zod schema validation, deterministic unit normalizer, engineering physics rules, SSRF URL security guard, prompt sanitizer, helmet HTTP protections. |
| **Business Relevance** | PIM-ready export center, Publication Readiness gating, 85%+ manual review reduction, Business Impact ROI engine. |
| **Scalability** | Controlled concurrency batch processor (Concurrency: 3), Scale Simulator (100 to 100,000 SKUs), Category Plugin Architecture. |
| **Overall Impact** | Transforms 3 days of manual spreadsheet cleanup into 1.4s automated AI governance per SKU record. |

---

## 🛠️ Commands & Scripts

- **Run Full Dev Server**: `npm run dev:full`
- **Run Unit & Integration Tests**: `npm test`
- **Run Test Coverage**: `npm run test:coverage`
- **Run Secrets Security Audit**: `npm run audit-secrets`
- **Build Production Bundle**: `npm run build`

---

## ☁️ Deployment

Deployable directly on Vercel or Node.js environments with `GEMINI_API_KEY` environment variable configured.
Live app: [https://spec-forge-chi.vercel.app/](https://spec-forge-chi.vercel.app/)
Repository: [https://github.com/Suhani-Tyagi/SpecForge.git](https://github.com/Suhani-Tyagi/SpecForge.git)
