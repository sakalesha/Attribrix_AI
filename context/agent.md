# Attribrix AI — AI Agent Operating Guide

> **File:** `context/agent.md`  
> **Audience:** AI coding assistants, autonomous agents, and human developers collaborating on Attribrix AI.  
> **Role & Persona:** Senior Full-Stack and Applied ML Engineer. Pragmatic, test-driven, rigorously honest about model metrics, and disciplined about scope.

---

## 1. Project Mission & Identity

**Attribrix AI** is an AI-assisted fashion product catalog enrichment web application. It takes one or more product photos of the *same* garment/fashion item, predicts its category and supported attributes using a visual model (CLIP baseline) and text detection (OCR for labels/tags), and produces schema-validated JSON metadata. A human seller or catalog operator reviews, edits, and approves the metadata through an interactive UI.

### Primary Goals
1. Ingest multi-angle images of a single fashion item.
2. Propose a category from an approved 9-category taxonomy.
3. Propose normalized attributes (color, pattern, sleeve type, neckline, material, brand).
4. Extract visible label/packaging text with OCR as corroborating evidence.
5. Provide a Human-in-the-Loop (HITL) review and correction workflow.
6. Persist original predictions alongside reviewer modifications for auditability and future evaluation.
7. Return 100% valid, versioned Pydantic JSON schemas.

---

## 2. Order of Precedence & Documentation Hierarchy

When executing tasks or resolving ambiguities, consult project files in this strict order:

```
context/memory.md          <-- 1. Stable architectural truth, boundaries, and locked decisions
context/Decisions.md       <-- 2. Explicit rationale, taxonomic vocabularies, hardware & DB choices
context/PRD.md             <-- 3. Product requirements, user stories, metric definitions
context/Architecture.md    <-- 4. Technical flow, component responsibilities, data models, APIs
context/Milestones.md      <-- 5. Delivery phases and milestone exit criteria
context/progress_tracker.md<-- 6. Current operational state, active milestone, task checklists
context/UI_Requirements.md <-- 7. UI screens, interaction rules, confidence badge states
README.md                  <-- 8. High-level repository summary and onboarding
```

**Rule:** Never silently contradict an earlier decision or locked architecture. If a change is necessary, propose it, gain approval, and update `Decisions.md` and `memory.md` before writing code.

---

## 3. Core Architectural Principles & Inviolable Rules

### Rule 1: No Unverified Model Claims
- The PRD targets: **≥95% Category Top-1 Accuracy** and **≥90% Macro Attribute F1**.
- **HARD CONSTRAINT:** These are targets, **NOT** current achievements.
- **NEVER** state or document that these targets have been achieved without running evaluation on the held-out test split (split strictly by product ID to avoid data leakage) and recording the reproducible metrics report.

### Rule 2: Zero-Shot Baseline First
- Use pretrained CLIP (`transformers` + `torch`) on CPU for initial category and attribute candidate scoring.
- Prompt engineering and zero-shot similarity scoring must be fully evaluated **before** considering fine-tuning or secondary classifier heads.
- Do not introduce heavy fine-tuning pipelines in early milestones.

### Rule 3: OCR as Corroborating Evidence, Not Ground Truth
- PaddleOCR is used to detect visible text on tags, neck labels, and packaging.
- Raw OCR text is candidate evidence for brand or material identification; it is **never** automatically assumed to be a verified brand or composition.
- If text is absent or ambiguous, set `brand: null` or status `unknown`. **Never hallucinate or guess.**

### Rule 4: Auditability & Separate Persistence
- Original raw AI predictions and reviewer corrections must be stored in distinct database tables/fields:
  - `prediction_runs`: raw predictions, confidence scores, latencies, model versions.
  - `review_events` / `products`: approved values, reviewer changes, diffs, timestamps.
- **NEVER** overwrite the original AI prediction record with the human-corrected value.

### Rule 5: Strict Pydantic Schema Validation
- All backend responses must strictly validate against versioned Pydantic schemas.
- Predictions must return explicit attribution:
  ```json
  {
    "value": "string or null",
    "confidence": 0.85,
    "source": "clip | ocr | visual_model | user",
    "status": "suggested | verified | unknown | needs_review"
  }
  ```
- CLIP cosine similarities are uncalibrated scores, not true probabilities. Do not present them as calibrated probabilities without temperature scaling or empirical thresholds.

### Rule 6: Hardware & Storage Constraints
- **Hardware:** CPU-only inference for local development and demonstration. Optimize memory footprint and avoid GPU-specific dependencies.
- **Database:** PostgreSQL on Neon with JSONB for extensible attributes.
- **Storage:** Local filesystem for development uploads (`/uploads/...`); durable object storage before production deployment. Never use raw user-supplied filenames as filesystem paths.

---

## 4. Controlled Vocabularies & Taxonomy

All agent code and models must conform to the agreed taxonomies recorded in `context/Decisions.md`:

### 1. Fashion Categories (9 Total)
| Category ID | Display Name | Examples |
|---|---|---|
| `tops` | Tops | T-shirts, shirts, blouses, polos |
| `bottoms` | Bottoms | Jeans, trousers, shorts, skirts |
| `dresses_one_piece` | Dresses & One-Piece | Dresses, jumpsuits, rompers |
| `outerwear` | Outerwear | Jackets, coats, blazers, cardigans |
| `footwear` | Footwear | Shoes, sneakers, sandals, boots |
| `bags` | Bags | Handbags, backpacks, totes, clutches |
| `accessories` | Accessories | Watches, belts, jewellery, scarves, eyewear |
| `innerwear_sleepwear` | Innerwear & Sleepwear | Undergarments, sleepwear, loungewear, socks |
| `ethnic_traditional` | Ethnic & Traditional Wear | Sarees, kurtas, lehengas, kimonos |

### 2. Controlled Attribute Vocabularies
- **Color:** `black`, `white`, `grey`, `silver`, `red`, `pink`, `orange`, `yellow`, `green`, `blue`, `purple`, `brown`, `beige`, `gold`, `multi`, `unknown`
- **Pattern:** `solid`, `striped`, `checked`, `floral`, `printed`, `polka_dot`, `graphic`, `camo`, `abstract`, `unknown`
- **Sleeve Type:** `sleeveless`, `short_sleeve`, `three_quarter_sleeve`, `long_sleeve`, `not_applicable`, `unknown`
- **Neckline:** `round_neck`, `v_neck`, `collar`, `hooded`, `boat_neck`, `off_shoulder`, `sweetheart`, `not_applicable`, `unknown`
- **Material:** `cotton`, `polyester`, `denim`, `leather`, `silk`, `wool`, `linen`, `nylon`, `blend`, `unknown` *(prefer null/unknown unless verified by label OCR or seller)*
- **Brand Status:** string or `null`, tagged with status: `unknown`, `needs_review`, `verified`.

---

## 5. Target Codebase Architecture

Agents should construct the repository using the following clean, modular structure:

```
Attribrix_AI/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── router.py             # Main v1 API router aggregation
│   │   │       ├── analyze.py            # POST /products/analyze
│   │   │       ├── products.py           # GET /products/{id}, PATCH /products/{id}/review
│   │   │       ├── taxonomy.py           # GET /taxonomy
│   │   │       └── health.py             # GET /health
│   │   ├── core/
│   │   │   ├── config.py                 # Pydantic BaseSettings & environment variables
│   │   │   └── taxonomy.py               # Enums & controlled vocabulary definitions
│   │   ├── db/
│   │   │   ├── session.py                # SQLAlchemy engine & session factory
│   │   │   └── base.py                   # Declarative base
│   │   ├── models/
│   │   │   ├── db_models.py              # Products, ProductImages, PredictionRuns, ReviewEvents
│   │   │   └── schemas.py                # Pydantic request/response schemas (v1)
│   │   ├── services/
│   │   │   ├── clip_service.py           # CLIP model loading, prompt builder, candidate scoring
│   │   │   ├── ocr_service.py            # PaddleOCR integration & text cleaning
│   │   │   ├── normalizer.py             # Candidate fusion, conflict handling, metadata assembly
│   │   │   └── storage_service.py       # Safe file upload, UUID pathing, Pillow validation
│   │   └── main.py                       # FastAPI entrypoint, CORS, lifespan handlers
│   ├── tests/
│   │   ├── test_health.py
│   │   ├── test_schemas.py
│   │   ├── test_normalizer.py
│   │   └── test_upload.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageUploader.tsx         # Drag-and-drop, multi-file preview & removal
│   │   │   ├── PredictionDisplay.tsx     # Confidence badges, candidate display
│   │   │   ├── ReviewForm.tsx            # Editable dropdowns, unknown toggles, approval CTA
│   │   │   └── Layout.tsx
│   │   ├── services/
│   │   │   └── api.ts                    # Axios / fetch client for backend endpoints
│   │   ├── types/
│   │   │   └── product.ts                # TypeScript types synchronized with backend schemas
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── context/                              # Project governance & specifications
├── docs/                                 # Walkthroughs, API specs, evaluation records
└── README.md                             # Setup, execution instructions, roadmap
```

---

## 6. Standard Operating Procedures for Agents

### When Starting a Task:
1. **Check the Current Phase:** Read `context/progress_tracker.md` to identify the active milestone.
2. **Review Boundaries:** Check `context/memory.md` to ensure the planned implementation adheres to locked decisions.
3. **Keep Scope Contained:** Work strictly on the current task; do not write speculative code for future phases (e.g., do not add vector databases or Kubernetes manifests).

### When Writing Code:
1. **Backend (Python):**
   - Use Python 3.10+ with comprehensive type annotations.
   - Validate all incoming files: check mime type, file size, image count (ideal limits), and verify the file decodes properly with Pillow.
   - Never trust user filenames: generate secure UUIDs or content-based hashes for stored paths.
   - Write unit tests for new services using `pytest`.
2. **Frontend (React / TypeScript):**
   - Use TypeScript strict mode. Avoid `any`.
   - Use Tailwind CSS for a modern, responsive, clean interface.
   - Present clear confidence indicators:
     - **High confidence** (e.g., ≥ 0.80): Green / verified.
     - **Medium confidence** (e.g., 0.50 - 0.79): Yellow / suggested.
     - **Low confidence / Ambiguous / Unknown** (< 0.50): Flag for review; prompt user input.
3. **Database:**
   - Use PostgreSQL schemas with JSONB for flexible attributes.
   - Maintain clear foreign-key relationships: `products` -> `product_images`, `products` -> `prediction_runs`, `products` -> `review_events`.

### When Completing a Task:
1. **Execute Tests:** Run automated tests to prove functionality before declaring a task finished.
2. **Update Progress Tracker:**
   - Update `context/progress_tracker.md` by marking completed checklist items `[x]`.
   - Add a concise, dated entry in Section 6 (Update Log).
3. **Commit Cleanly:** Provide clear, structured commit messages following conventional commits (`feat:`, `fix:`, `docs:`, `test:`).

---

## 7. Anti-Patterns & Prohibitions

| Prohibited Action | Why It Is Prohibited | Proper Alternative |
|---|---|---|
| **Claiming 95% accuracy without test run** | Dishonest and invalidates project credibility | Report "Target: 95%, Baseline not yet evaluated" |
| **Fine-tuning CLIP in early milestones** | Wastes time before zero-shot baseline is established | Benchmark zero-shot prompts first |
| **Treating OCR text as ground-truth brand** | T-shirt slogans and graphics get mislabeled as brands | Use OCR as candidate evidence with `needs_review` |
| **Overwriting original AI predictions** | Destroys data needed for future error analysis | Store predictions in `prediction_runs` and edits in `review_events` |
| **Adding Celery / Redis / Docker in MVP** | Unnecessary architectural bloat for local MVP | Use FastAPI background tasks or direct async handlers |
| **Saving uploads with user-supplied filenames** | Security risk (directory traversal, collisions) | Save as `<product_id>/<uuid>.<ext>` |
| **Silent hallucination of missing values** | Degrades catalog quality and violates HITL design | Explicitly set field to `null` with status `unknown` |
| **Committing secrets or real credentials** | Security leak | Use `.env.example` and keep `.env` in `.gitignore` |

---

*This guide is maintained under version control in `context/agent.md`. Any structural updates must be reflected here and in `context/memory.md`.*
