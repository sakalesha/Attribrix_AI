# Attribrix AI — Product Requirements Document (PRD)

**Version:** 1.0  
**Status:** Initial product scope and technology decisions approved  
**Product type:** AI-assisted fashion catalog enrichment web application

## Related documentation

- [Architecture](./Architecture.md) — technical structure, data flow, and system design
- [Decisions](./Decisions.md) — decisions that shaped the product and technical direction
- [UI Requirements](./UI_Requirements.md) — user experience and review flow requirements
- [Milestones](./Milestones.md) — phased plan, milestones, and acceptance criteria
- [System Overview](../docs/system-overview.md) — beginner-friendly overview of the product and pipeline

---

## 1. Product Overview

**Attribrix AI** helps sellers create better product listings with less manual data entry. A seller uploads one or more images of a fashion product. The system analyzes the images, predicts the product category and visible attributes, reads text from visible labels where possible, and returns structured metadata. The seller reviews and corrects the suggestions before saving the approved product record.

Corrections are retained as verified examples that can support future evaluation and model improvement. The application will **not** automatically retrain the model after every correction.

### Product statement

Build an AI system that takes one or more product images, predicts a fashion product category, extracts key attributes, and generates structured metadata. The target is at least **95% category classification accuracy** and **90% attribute F1 score** on a representative, manually labeled evaluation set.

These targets are goals, not assumed results. They must be validated by experiments before the product can claim to have achieved them.

## 2. Problem Statement

Creating product listings manually takes time and often leads to incomplete, inconsistent, or incorrect catalog information. Sellers may use different names for the same color or category, omit attributes, or enter brand and material information without sufficient evidence.

Attribrix AI will reduce repetitive data entry by suggesting standardized product metadata from product images while keeping a human reviewer responsible for approving uncertain or incorrect values.

## 3. Goals and Success Metrics

### 3.1 Primary goals

1. Accept one or more images for a single fashion product.
2. Predict the product's category using a defined fashion taxonomy.
3. Extract and normalize supported attributes, including color and pattern.
4. Read visible label text with OCR to assist brand and other text-based attribute extraction.
5. Return validated structured JSON that can populate a product listing form.
6. Let users review, correct, and approve predictions.
7. Save approved metadata and traceable correction data for evaluation and future model improvement.

### 3.2 Success metrics

| Metric | Target | Measurement method |
|---|---:|---|
| Category classification accuracy | ≥ 95% | Correct top-1 category predictions divided by all labeled test products |
| Attribute F1 score | ≥ 90% | Macro-averaged F1 across the defined, evaluable attribute fields; also report per-field precision, recall, and F1 |
| Metadata schema validity | 100% | Responses that conform to the agreed Pydantic/JSON schema |
| Human correction capture | 100% of submitted reviews | Reviewed records persist the approved values and review status |
| Unsupported-value handling | 100% schema-compliant | Unknown or unverified values use `null`/an explicit unknown state instead of invented values |

**Evaluation rules:**
- Keep a held-out test set that is not used to tune prompts, thresholds, or model parameters.
- Split data by product identity, not by individual image, to prevent images of the same item leaking into both training/validation and test sets.
- Report results overall and by category, attribute, and confidence band. Include sample counts and class imbalance.
- Define the exact attribute F1 aggregation in the evaluation report. In this PRD, the primary target is the macro average of per-field F1 over the supported, label-eligible attributes.
- If a field is not visually observable in a test image (for example, exact fabric composition without a readable label), evaluate it only under a documented annotation policy and do not silently count missing ground truth as a model success.

## 4. Target Users

### Primary user: Product seller / catalog operator
- Uploads product photos.
- Reviews AI-generated category and attribute suggestions.
- Corrects errors and approves the final listing metadata.

### Secondary user: Project administrator / evaluator
- Checks system quality and review records.
- Exports or inspects verified examples for evaluation.
- Runs offline model benchmarks and approves model updates.

The MVP is intended for a controlled project demonstration and evaluation. Public, multi-tenant commercial use requires additional authentication, authorization, deployment, and operational hardening.

## 5. Scope

### 5.1 In scope for the MVP

- Fashion product images only.
- Upload one or multiple images belonging to one product.
- Initial configurable categories, such as tops, bottoms, dresses, outerwear, footwear, and bags/accessories. Final category names and mapping must be confirmed in the taxonomy configuration before evaluation.
- Pretrained CLIP as the initial visual baseline; no fine-tuning required to launch the first prototype.
- Candidate generation for category, color, pattern, and other visually supportable attributes.
- PaddleOCR for text found on visible labels or packaging.
- Attribute normalization and deterministic JSON generation with Pydantic validation.
- A review screen where users can edit, accept, or mark attributes as unknown.
- PostgreSQL storage for product records, images' file references, prediction output, review corrections, and model/evaluation metadata.
- A labeled-data strategy using relevant public fashion datasets (subject to license and suitability checks) and human-verified examples.
- Offline evaluation using scikit-learn metrics and a held-out test set.

### 5.2 Out of scope for the MVP

- Support for all retail domains (electronics, groceries, furniture, etc.).
- Guaranteed recognition of every logo or brand from an image.
- Guaranteed inference of exact textile composition from appearance alone.
- Automatic model retraining after each user correction.
- Vector databases, semantic product search, Redis, Celery, and distributed job orchestration.
- A large language model API as a required dependency.
- Cloud object storage, multi-region deployment, and enterprise multi-tenant operations.
- Claims that the accuracy targets have been met before evaluation proves them.

## 6. User Stories

1. **As a seller**, I want to upload one or more product photos so that I can start a listing without manually entering every field.
2. **As a seller**, I want suggested category and attributes so that repetitive data entry is reduced.
3. **As a seller**, I want to see uncertain or missing values so that I can correct them instead of trusting guesses.
4. **As a seller**, I want to edit predictions and approve the final metadata so that the saved catalog record is accurate.
5. **As an evaluator**, I want to compare predictions with verified labels so that category accuracy and attribute F1 can be measured.
6. **As a project administrator**, I want reviewed corrections to be retained so that they can be analyzed and used in future model iterations.

## 7. Functional Requirements

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---|---|
| FR-01 | Upload product image(s) | Must | User can select and submit supported images for one product; invalid files produce a clear error |
| FR-02 | Validate uploads | Must | Validate extension, MIME type, size limit, and actual image decoding; reject malformed or unsupported files |
| FR-03 | Prepare images | Must | Images are consistently decoded, resized as needed, and passed to inference without altering the stored original |
| FR-04 | Predict category | Must | Return a category candidate using the configured fashion taxonomy and preserve score/evidence for review |
| FR-05 | Suggest visual attributes | Must | Generate candidates for the agreed initial fields, including color and pattern, with unknown supported |
| FR-06 | Extract visible text | Must | OCR output is captured for review/normalization; unreadable or absent text is allowed |
| FR-07 | Normalize attributes | Must | Raw values map to the versioned controlled vocabulary or remain unknown; no invented fallback values |
| FR-08 | Generate valid metadata | Must | Response conforms to the Pydantic schema and JSON structure |
| FR-09 | Review/edit predictions | Must | User can change a field, accept a value, or mark it unknown before approval |
| FR-10 | Persist product record | Must | Save approved metadata, review status, image references, timestamps, and prediction/model version identifiers |
| FR-11 | Store corrections | Must | Preserve original suggestion and final reviewed value for audit and training-data provenance |
| FR-12 | Measure model quality | Must | Evaluation utility reports category accuracy and per-attribute precision, recall, F1 and the agreed aggregate F1 |
| FR-13 | Export verified examples | Should | Authorized project operator can export reviewed examples and labels for offline analysis, without exposing data unintentionally |
| FR-14 | Support future model replacement | Should | Model implementation is isolated behind a service/interface so another encoder can be benchmarked without rewriting the UI |
| FR-15 | Show uncertainty/conflicts | Must | UI makes unknown or conflicting attributes visible and does not present all predictions as confirmed facts |

## 8. Non-Functional Requirements

### Reliability and validation
- All API outputs must pass Pydantic validation.
- Failures from decoding, OCR, inference, or database persistence must return useful error messages without silently producing a successful record.
- A failure in OCR should not prevent CLIP-based inference from completing if the rest of the request is valid.

### Performance
- Record end-to-end processing time and per-component latency during development.
- Set a response-time service target only after a baseline is measured on the intended hardware and expected image sizes. Model loading and CPU/GPU availability can materially change latency.
- Avoid loading model weights from disk for every request; load reusable model objects once per backend process where supported.

### Security and privacy
- Accept only approved image formats (initially JPEG, PNG, and WebP) and enforce configurable upload-size and image-count limits.
- Never trust the filename or MIME type alone; validate the decoded content.
- Store uploaded files using generated identifiers rather than user-supplied paths.
- Keep secrets in environment variables and never commit credentials.
- Do not expose uploaded images or review data publicly by default.
- Before public deployment, add authentication, authorization, rate limiting, and a documented retention/deletion policy.

### Maintainability
- Keep UI, API, model inference, OCR, normalization, persistence, and evaluation code in separate modules.
- Version the category taxonomy, attribute schema, model configuration, and evaluation dataset.
- Include unit tests for validation and normalization, plus integration tests for the upload-to-review workflow.

## 9. Data Strategy

### 9.1 Initial data sources

Use existing fashion product datasets to establish a baseline, rather than waiting to collect a private dataset from scratch. Candidate sources include:

- Fashion product image datasets hosted on Hugging Face, including fashion catalog images with labels.
- DeepFashion and related research datasets for clothing categories and attributes.
- Images gathered specifically for the project and manually labeled under a consistent annotation guide.

Before using any external dataset, check its license, terms, redistribution constraints, label definitions, and whether its images and labels suit this project's intended usage. Do not assume that all research datasets can be used commercially.

### 9.2 Labeling policy

- Define a versioned category and attribute dictionary before annotation.
- Keep exact textile composition separate from visual appearance. For example, visually “cotton-like” is not equivalent to verified “100% cotton.”
- Use `unknown`/`not visible` where an image does not contain enough evidence.
- Review a sample of annotations for consistency; document disagreements and resolve them using the annotation guide.
- Store label provenance (public dataset, seller input, OCR candidate, or human-verified correction).

### 9.3 Feedback data lifecycle

1. Store model output as a prediction record.
2. Store user-approved values as a separate reviewed record, preserving the original prediction.
3. Mark each field's review status and source.
4. Exclude unreviewed pseudo-labels from the verified training/evaluation set.
5. Periodically export verified examples, split by product identity, and run offline experiments.
6. Promote a new model only when it meets agreed regression and quality checks on the held-out evaluation process.

## 10. Model and Evaluation Plan

### Phase A — Baseline without fine-tuning
- Use pretrained CLIP with a defined set of category and attribute text candidates.
- Experiment with prompt wording and category mappings on a validation set only.
- Test visual attributes separately; do not assume category performance implies attribute performance.
- Run PaddleOCR against representative visible labels and inspect both text-recognition and brand-field usefulness.

### Phase B — Benchmark
- Create a representative, manually verified test set with products from each supported category and varying image quality, color, pattern, and backgrounds.
- Prevent near-duplicate/product leakage between splits.
- Evaluate category top-1 accuracy and per-attribute precision/recall/F1.
- Record unknown predictions, error types, latency, and performance by category.
- Compare CLIP with an alternative (for example, SigLIP or a dedicated classifier) only if baseline results indicate a need.

### Phase C — Improve only where evidence supports it
- Improve taxonomy and prompts first when errors are due to category naming or candidate wording.
- Add verified labeled examples and train a lightweight classifier on frozen embeddings if appropriate.
- Fine-tune parts of the encoder only if enough relevant labels exist and experiments show a likely benefit.
- Keep the final test set untouched until a model candidate is ready for evaluation.

### Human-review policy
- Calibrate thresholds using validation data, not intuition alone.
- High-confidence suggestions may be preselected, but users must be able to review them.
- Low-confidence, conflicting, or evidence-poor fields should be displayed as requiring review or unknown.
- A score from a model must not be displayed as a statistically calibrated probability unless calibration has been evaluated.

## 17. Risks and Mitigations

| Risk | Why it matters | Mitigation |
|---|---|---|
| CLIP performs poorly on fine-grained categories | Similar garments may look alike | Define a clear taxonomy, benchmark real images, compare alternative models if needed |
| Visually inferred material is unreliable | Exact textile composition often is not observable | Prefer readable labels or verified seller data; support unknown values |
| OCR mistakes brand names | Stylized fonts, curved labels, and blur reduce readability | Show OCR text for review; preserve source/evidence and avoid auto-verifying uncertain text |
| Public data differs from real seller images | Benchmark scores may not generalize | Collect representative test images and report dataset limitations |
| Duplicate-product leakage inflates metrics | Test results appear stronger than real-world performance | Split by product identity and check near duplicates |
| Attribute vocabularies are inconsistent | Similar values fragment across the catalog | Use a versioned controlled vocabulary and normalization rules |
| User corrections are noisy | Bad labels can harm later models | Keep provenance; use reviewed examples and annotation checks |
| Heavy inference causes slow requests | Upload experience degrades | Measure latency, cache model instances, resize inputs, and optimize only when necessary |
| Dataset license is unsuitable | Limits reuse or deployment | Check licensing and usage conditions before integrating data |

---

## Final Product Principle

**Attribrix AI should suggest, explain uncertainty, and learn from verified corrections—not guess missing facts.** The first version prioritizes a working image-to-metadata workflow and an honest evaluation baseline. Accuracy targets will drive subsequent improvements only after they are measured on representative data.
