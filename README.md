# ⚡ SpecForge — AI Industrial Product Intelligence System

> **Hackathon Edition** — An AI-powered product intelligence system built for industrial commerce. SpecForge ingests fragmented, incomplete product data (text descriptions, category tags, images, or spec sheets) and transforms it into structured, validated, commerce-ready product intelligence records with field-level traceability (`value`, `confidence`, `source`, `reasoning`).

---

## 🌟 Key Features

1. **Intake & Multi-Modal Extraction (Stage 1)**:
   - Supports free text, name + category, product image upload (Gemini 2.0 Flash Vision), and URL/spec sheet text.
   - Outputs explicit `"unknown"` values for missing fields to avoid hallucinated specs.
   - Pre-loaded with 4 instant industrial presets (Ball Bearings, AC Motors, Pumps, Hex Bolts).

2. **RAG Enrichment Engine (Stage 2)**:
   - RAG source powered by seed taxonomy (20 UNSPSC/ETIM categories) & reference products in `specforge-knowledge-base.json`.
   - Infers missing attributes using matching reference products and category standards.
   - Assigns `confidence` (`high`/`medium`/`low`), `source` (`extracted`/`inferred`/`category_default`), and explicit `reasoning` strings for every field.

3. **Automated Validation & Traceability (Stage 3)**:
   - Rule checks enforcing physical & engineering rules (bearing outer vs. bore diameter, motor RPM vs. pole counts, pump inlet vs. outlet sizes, valve material temperature ratings).
   - Generates overall Data Quality Score (0–100) and rule violation warnings.

4. **Human-In-The-Loop (HITL) Review UI (Stage 4)**:
   - Interactive table with color-coded field confidence badges (`Green` = High, `Amber` = Medium, `Rose` = Low).
   - Accept, edit, or reject individual fields.
   - Global bulk actions and one-click PIM/Catalog JSON feed export.

5. **Scalability Batch Demo**:
   - Process 3–5 items concurrently through the full pipeline with live status tracking and throughput metrics.

6. **Knowledge Base Explorer**:
   - Interactive catalog browser for seed taxonomy, reference products, and consistency rules.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Express API, `@google/generative-ai` SDK (`gemini-2.0-flash`)
- **Knowledge Base RAG**: `specforge-knowledge-base.json`
- **Deployment**: Vercel ready (Serverless Functions via `/api/index.js`)

---

## 🚀 Local Development Setup

1. **Clone & Install Dependencies**:
   ```bash
   git clone https://github.com/Suhani-Tyagi/SpecForge.git
   cd SpecForge
   npm install
   ```

2. **Configure Environment**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3001
   ```

3. **Run Dev Environment**:
   ```bash
   npm run dev:full
   # Frontend: http://localhost:5173
   # Backend API: http://localhost:3001
   ```

---

