## Related documentation

- [PRD](./PRD.md) — product goals, target metrics, and feature requirements
- [Architecture](./Architecture.md) — technical design and system flow
- [Decisions](./Decisions.md) — strategic and technical decisions behind the plan
- [UI Requirements](./UI_Requirements.md) — user experience and review workflow expectations
- [System Overview](../docs/system-overview.md) — beginner-friendly explanation of the pipeline

## 1. Milestones and Implementation Plan

### Phase 1 — Project foundation
- Create frontend and backend project structure.
- Configure environment variables and local PostgreSQL connection.
- Define category taxonomy, attribute schema, and Pydantic models.
- Add health endpoint and basic automated tests.

**Exit criteria:** Frontend and backend start locally; database connection works; schema validation tests pass.

### Phase 2 — Image upload and storage
- Build multi-image upload UI.
- Validate, decode, preview, and store images locally.
- Create product and product-image records.

**Exit criteria:** Valid image groups can be uploaded and retrieved; malformed files are rejected cleanly.

### Phase 3 — CLIP baseline
- Load pretrained CLIP through Transformers/PyTorch.
- Implement configurable category candidates and attribute prompts.
- Return candidate scores and model configuration identifiers.

**Exit criteria:** A set of representative images produces reproducible category and attribute candidates; baseline metrics can be calculated.

### Phase 4 — OCR and metadata assembly
- Integrate PaddleOCR.
- Normalize visual and OCR candidates.
- Combine results into the versioned Pydantic/JSON schema.

**Exit criteria:** Successful analysis returns schema-valid metadata; OCR or visual inference failures are handled independently where possible.

### Phase 5 — Human review and persistence
- Implement editable prediction form and approval workflow.
- Save final approved values and a separate record of original predictions/corrections.

**Exit criteria:** Corrections persist and can be retrieved without losing the original model output.

### Phase 6 — Dataset and evaluation
- Select permitted public fashion data and curate a project-specific labeled set.
- Establish train/validation/test policy and annotation guide.
- Build evaluation scripts for category accuracy and per-attribute F1.

**Exit criteria:** Repeatable benchmark report includes sample counts, scores, category breakdowns, and key failure cases.

### Phase 7 — Pilot refinement
- Test with representative images and users.
- Improve prompts, taxonomy, thresholds, and UI based on error analysis.
- Decide whether a small classifier or fine-tuning is justified.

**Exit criteria:** Quality and latency are measured; model limitations are documented; target metrics are reported honestly.

## 2. Release Acceptance Checklist

The MVP is acceptable for demonstration when:

- [ ] A user can upload one or more supported fashion-product images.
- [ ] The system returns a category suggestion and the configured attribute candidates.
- [ ] OCR output can contribute visible label text without being treated as ground truth automatically.
- [ ] Metadata is valid against the Pydantic schema and returned as JSON.
- [ ] Unknown and conflicting values are represented safely.
- [ ] The user can edit, mark unknown, and approve fields.
- [ ] Product records, image references, predictions, and reviewed corrections are persisted.
- [ ] The evaluation pipeline reports category accuracy and attribute precision, recall, and F1 on a held-out test set.
- [ ] Dataset licenses and label mapping are documented.
- [ ] The documentation clearly states whether the 95% category accuracy and 90% attribute F1 targets have actually been achieved.
