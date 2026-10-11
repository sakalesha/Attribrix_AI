# Attribrix AI — Project Memory

> Purpose: A concise, durable context file for the developer and AI coding assistants. Read this before making significant implementation changes. Keep stable decisions here; record changing task status in `progress_tracker.md`.

## 1. Project Identity

- **Project name:** Attribrix AI
- **Project type:** AI-assisted fashion product catalog enrichment web application
- **Core purpose:** Accept one or more images of the same fashion product, predict its category and supported attributes, read visible text where possible, and generate structured metadata that a seller can review and approve.
- **Problem being solved:** Manual product listing is slow and can result in incomplete or inconsistent catalog attributes.
- **Initial domain:** Fashion products only. Expand to other retail domains only after the fashion pipeline is working and evaluated.
- **Primary user:** Seller or catalog operator.
- **Secondary user:** Project administrator/evaluator.

## 2. Goals and Success Targets

The product should:
1. Accept one or multiple images of one product.
2. Suggest a category using a defined fashion taxonomy.
3. Suggest supported attributes such as color and pattern.
4. Extract visible text from labels or packaging using OCR where possible.
5. Return schema-validated JSON metadata.
6. Let a human review, edit, mark fields unknown, and approve the results.
7. Preserve both original predictions and reviewed/corrected values.
8. Retain verified corrections for future evaluation and model improvement.

**Quality targets — not yet demonstrated:**
- Category top-1 accuracy: **at least 95%**.
- Attribute F1: **at least 90%**, using the PRD's defined macro-average across supported, label-eligible attribute fields.
- JSON/Pydantic schema validity: 100%.

Never claim these model targets are met until measured on a representative, held-out, manually labeled test set. Split data by product identity to prevent photos of the same item leaking across splits.

## 3. Locked Technology Stack (3-Tier Service Architecture)

| Layer | Selected technology | Intended responsibility |
|---|---|---|
| Frontend | React + Vite | Image upload, previews, prediction display, editing, and human review approval |
| Styling | Tailwind CSS | Responsive, accessible, and consistent UI |
| Backend API / BFF | Node.js + Express | Upload validation, storage orchestration, PostgreSQL persistence, and client API |
| ML Integration | `mlClient.js` | Express integration client communicating with the Python ML microservice |
| ML Microservice | Python + FastAPI | Vision & OCR inference service exposing prediction and health endpoints |
| Visual baseline | Hugging Face Transformers + pretrained CLIP | Zero-shot category and attribute candidate scoring on CPU |
| ML framework | PyTorch (CPU) | Model inference and possible future fine-tuning |
| OCR | PaddleOCR | Detect/read text visible on labels and packaging |
| Image utilities | Pillow (PIL) | Decode, validate, resize, and prepare image batches |
| Schema validation | Pydantic | Validate responses, taxonomy, and normalized metadata |
| Database | PostgreSQL (Neon) | Product, image-reference, prediction, review and evaluation records |
| Flexible attributes | PostgreSQL JSONB | Store category-specific attributes alongside stable relational fields |
| Metrics | scikit-learn | Accuracy, precision, recall, F1, and confusion matrices |
| Image storage | Local filesystem (`./uploads`) / Neon Object Storage | Store uploads; database stores generated UUID paths/references |

## 4. Architecture and Data Flow

1. User uploads one or more images belonging to a single fashion product in the React UI.
2. Node.js Express backend validates file format, size, count, and saves files with UUID filenames to `./uploads`.
3. `mlClient.js` sends the image batch to the Python ML microservice (`POST /api/v1/predict`).
4. Pillow verifies and decodes images in memory for inference.
5. CLIP compares image/text representations against configured category and attribute candidates on CPU.
6. PaddleOCR extracts text visible on labels or packaging.
7. Attribute processing normalizes candidate values to a controlled vocabulary and formats results.
8. Pydantic validates the resulting versioned metadata schema.
9. UI shows candidates, confidence badges, and fields that are unknown or need review.
10. User accepts, edits, or marks individual fields unknown, then approves.
11. PostgreSQL stores product data, image references, original predictions, and review events.
12. Verified examples may later be exported for offline evaluation and controlled model experiments.

A multi-image upload normally represents **one product with multiple views**, not multiple separate products. Conflicting views or field predictions should be shown for review instead of silently discarded.

## 5. Attribute and Evidence Rules

- **Category:** Use the agreed fashion taxonomy. Return a candidate and score/evidence when available.
- **Color:** Normalize to a controlled vocabulary; allow multiple colors when appropriate.
- **Pattern:** Use a controlled vocabulary, initially including values such as solid, striped, checked, floral, printed and unknown, subject to final taxonomy approval.
- **Garment details:** Sleeve type and neckline may be category-dependent optional fields.
- **Brand:** OCR can suggest a value only when text is visible and readable. OCR output is not automatically a verified brand. Logo recognition may require a separate approach later.
- **Material:** Do not assert exact textile composition from appearance alone. Prefer readable labels or verified seller/product data. Use `null`/unknown when evidence is insufficient.
- Never invent missing product facts just to fill a field.
- Distinguish model suggestions from user-approved values.
- CLIP similarity scores are **not automatically calibrated probabilities**. Calibrate confidence thresholds on validation data before interpreting them as probabilities.

Example response shape (illustrative values only):

```json
{
  "product_id": "generated-product-id",
  "category": {
    "value": "T-shirt",
    "confidence": 0.87,
    "source": "clip",
    "status": "suggested"
  },
  "attributes": {
    "color": {
      "value": "Blue",
      "confidence": 0.91,
      "source": "visual_model",
      "status": "suggested"
    },
    "pattern": {
      "value": "Solid",
      "confidence": 0.76,
      "source": "visual_model",
      "status": "suggested"
    },
    "brand": {
      "value": null,
      "confidence": null,
      "source": "ocr",
      "status": "unknown"
    },
    "material": {
      "value": null,
      "confidence": null,
      "source": "not_observed",
      "status": "unknown"
    }
  },
  "review_status": "pending"
}
```

Numbers above are examples only, not measured outputs.

## 6. Proposed API Contract

These endpoints are proposed in the architecture document and should be finalized during implementation:

- `POST /api/v1/products/analyze` — upload image(s) and receive candidate metadata.
- `GET /api/v1/products/{product_id}` — retrieve product metadata and review state.
- `PATCH /api/v1/products/{product_id}/review` — save user corrections and approval status.
- `GET /api/v1/health` — service health check.
- `GET /api/v1/taxonomy` — supported categories and attribute vocabularies.

Use multipart form uploads. Return helpful, distinct errors for invalid uploads, OCR/inference failures, and persistence failures. Add authentication/authorization before any public deployment.

## 7. Database Concepts

The proposed database structure includes:

- `products`: normalized category, JSONB attributes, review state, schema version, timestamps.
- `product_images`: product foreign key, generated storage path/reference, content type, file size, timestamps, optional original filename for display/debug only.
- `prediction_runs`: product foreign key, model/config identifier, raw candidates and OCR results, processing status, latency and timestamp.
- `review_events`: product foreign key, original prediction snapshot, reviewed values, optional reviewer identifier and timestamp.

Do not use user-supplied filenames as file storage paths. Avoid collecting unnecessary personal information.

## 8. Technology and Scope Boundaries

- Start with pretrained CLIP inference and prompt/category experiments; **do not fine-tune at the beginning**.
- Benchmark CLIP on representative fashion images before committing to it as the final production encoder. Compare another model only if evidence shows a need.
- Test PaddleOCR against real product labels and realistic image conditions before judging its usefulness.
- Use deterministic application code and Pydantic validation to create JSON. An external LLM API is **not required** for the MVP.
- PostgreSQL is selected; MongoDB is **not** in the initial stack.
- Local image storage is for development/demo use only. Before public or important-data production use, choose durable, access-controlled object storage or an equivalent.
- Do not add Redis, Celery, a vector database, distributed job orchestration, cloud object storage, or Docker to the first prototype unless a concrete requirement makes one necessary.
- User corrections do not trigger automatic retraining. Collect, curate, train/adjust periodically, and evaluate before deploying an updated model.
- Public dataset terms and licenses must be checked before use; do not assume research datasets are cleared for commercial use.

## 9. Open Decisions to Resolve During Implementation

159: 1. Final fashion category taxonomy and source-dataset label mapping.
160:    - **Decision:** 9 broad categories: tops, bottoms, dresses_one_piece, outerwear, footwear, bags, accessories, innerwear_sleepwear, ethnic_traditional.
161: 2. Exact allowed values for color, pattern, sleeve type, neckline and other category-dependent attributes.
162:    - **Decision:** Fixed controlled vocabularies defined for color, pattern, sleeve type, neckline, and material. Brand is a normalized string.
163: 3. Dataset selection, license/terms, annotation guide and evaluation-set size.
164:    - **Decision:** Hugging Face Dataset; 44,072 total records; 70/15/15 split for train/val/test.
165: 4. Target development/demo hardware (CPU or supported GPU), based on latency and installation testing.
166:    - **Decision:** Development and demo inference will run on a CPU.
167: 5. Hosting and durable image storage before public release.
168:    - **Decision:** Use Neon for PostgreSQL and object storage.
169: 6. Whether reviewer accounts are needed and how long uploaded images/review data should be retained.
170:    - **Decision:** No user authentication required. Data retention kept at ideal limits.
171: 7. Upload image-count, file-size and rate limits.
172:    - **Decision:** Kept at ideal limits for now.

## 10. Documentation and Working Rules

- `PRD.md`: product goals, scope, user stories, requirements and success metrics.
- `Architecture.md`: technical components, data flow, API, schema and database design.
- `Decisions.md`: locked choices, boundaries and open decisions.
- `UI_Requirements.md`: UI behavior and screen requirements (rename from `Disign.md` if not already renamed).
- `Milestones.md`: phases and exit criteria.
- `memory.md`: stable project context and constraints.
- `agent.md`: operational guide, hard rules, and persona for AI coding agents.
- `progress_tracker.md`: current status, task checklist, blockers, evidence and dated update log.
- Later, as needed: `README.md` for setup and quick-start instructions, plus `docs/Data_and_Evaluation.md` for detailed dataset/benchmark operations.

When working with AI coding tools:
1. Read `memory.md`, `agent.md`, `PRD.md`, `Decisions.md`, `Architecture.md`, and `progress_tracker.md` before major changes.
2. Implement only the current milestone's scope; avoid speculative features.
3. Do not silently change a locked technology or product decision. Propose the change and record an accepted decision in `Decisions.md` and this file.
4. Add/update tests and report what was actually run.
5. Update `progress_tracker.md` at the end of each work session. Mark a task done only when its acceptance condition has been verified.
6. Never report accuracy targets as achieved without reproducible held-out evaluation results.
