# Attribrix AI — Progress Tracker

> Update this file at the end of each implementation or planning session. Keep stable project context in `memory.md`; this file records current status, next actions, blockers and verified progress.

**Last updated:** 2026-10-10  
**Overall status:** Planning and requirements defined; implementation progress has not yet been confirmed.  
**Current phase:** Phase 1 — Project foundation (not started / not verified)

## 1. Current Snapshot

| Area | Status | Notes |
|---|---|---|
| Project name and initial domain | Approved | Attribrix AI; fashion products first |
| Technology stack | Locked | React/Vite/TypeScript, FastAPI, CLIP/Transformers/PyTorch, PaddleOCR, Pillow/OpenCV as needed, Pydantic, PostgreSQL/JSONB, scikit-learn |
| Product requirements | Drafted/approved for MVP planning | `PRD.md`; version 1.0 in current draft |
| Architecture | Drafted | `Architecture.md`; technical flow, API outline, schema and data model included |
| Decision record | Drafted | `Decisions.md`; locked choices and open decisions recorded |
| UI requirements | Drafted | `UI_Requirements.md`; product and review flow requirements are defined |
| Milestones | Drafted | `Milestones.md`; seven phases and exit criteria included |
| Source code / project scaffold | Not confirmed | No implementation tasks are marked complete in this tracker yet |
| Evaluation dataset and results | Not started / not confirmed | No verified benchmark result is recorded here |
| 95% category accuracy target | Not yet demonstrated | Must be measured on a representative held-out test set |
| 90% attribute F1 target | Not yet demonstrated | Must be measured using the agreed attribute evaluation policy |

**Status definitions:** `NOT STARTED` = no evidence work has begun; `IN PROGRESS` = work underway; `BLOCKED` = cannot proceed without resolving a dependency; `DONE` = exit criteria checked and evidence recorded. “Not confirmed” means no completion evidence has been provided, not necessarily that no work exists elsewhere.

## 2. Immediate Documentation Cleanup

- [x] Fix the section numbering in `PRD.md` (the current draft jumps from section 10 to section 17).
- [x] Move the long beginner-friendly component walkthrough out of `Architecture.md` into `README.md` or `docs/system-overview.md`; keep the canonical technical diagram in `Architecture.md`.
- [x] Rename `Disign.md` to `UI_Requirements.md`.
- [x] Keep the detailed release acceptance checklist in `Milestones.md` only where it adds value; use `PRD.md` as the canonical source for product requirements.
- [x] Add links between the documentation files once their canonical filenames and locations are settled; the canonical cross-links are in place across the planning docs.

## 3. Implementation Milestones

### Phase 1 — Project foundation
**Status: IN PROGRESS / FOUNDATION SCAFFOLDED**

- [x] Create the frontend, backend, and ML service project structure according to locked 3-tier skeleton.
- [x] Set up React + Vite and Tailwind CSS (`frontend/`).
- [x] Set up Node.js + Express backend with modular architecture, upload middleware, and `mlClient.js` (`backend/`).
- [x] Set up Python ML microservice with FastAPI, taxonomy, Pydantic schemas, Pillow processor, CLIP wrapper, and evaluation metrics (`ml/`).
- [x] Add environment configuration and safe `.env.example` across all 3 tiers.
- [x] Configure PostgreSQL connection pool in `backend/src/config/db.js`.
- [x] Confirm initial category taxonomy and versioned attribute schema in `ml/src/data/taxonomy.py` and `ml/src/data/schemas.py`.
- [x] Add `GET /api/v1/health` and `GET /health` across backend and ML service.
- [x] Add automated test suites for backend health and ML schemas/taxonomy.
- [x] Add development launcher scripts in `scripts/start-dev.bat` and `scripts/start-dev.sh`.

**Exit criteria:** Frontend, backend, and ML service scaffolding complete; health endpoints and schema validation passing.

### Phase 2 — Image upload and storage
**Status: NOT STARTED / NOT VERIFIED**

- [ ] Build multi-image upload UI for one product.
- [ ] Show image previews and allow removal before submission.
- [ ] Validate allowed formats, file sizes, image count and decoded image content.
- [ ] Store images under generated identifiers in local development storage.
- [ ] Create product and product-image records.
- [ ] Handle malformed files and storage failures clearly.

**Exit criteria:** Valid image groups can be uploaded and retrieved; malformed files are rejected cleanly; images are linked to one product record.

### Phase 3 — CLIP baseline
**Status: NOT STARTED / NOT VERIFIED**

- [ ] Load the pretrained CLIP model through Transformers/PyTorch.
- [ ] Define initial category candidates and text prompts from the agreed taxonomy.
- [ ] Add candidate generation for agreed attributes such as color and pattern.
- [ ] Preserve scores and model/configuration identifiers.
- [ ] Evaluate against a small development/validation sample without using the final test set to tune prompts.
- [ ] Record CPU/GPU compatibility, memory use and inference latency.

**Exit criteria:** Representative images produce reproducible candidate outputs and an initial baseline evaluation can be calculated.

### Phase 4 — OCR and metadata assembly
**Status: NOT STARTED / NOT VERIFIED**

- [ ] Integrate PaddleOCR behind a separate OCR service/module.
- [ ] Test OCR on representative product labels and record failure cases.
- [ ] Normalize model/OCR candidates to the configured vocabulary.
- [ ] Define source, status, unknown-value and confidence/evidence fields.
- [ ] Combine multi-image evidence and flag conflicts for review.
- [ ] Validate final output with Pydantic and return JSON.
- [ ] Ensure OCR failure does not unnecessarily prevent visual inference from completing.

**Exit criteria:** Successful analysis returns schema-valid metadata; unsupported or unknown attributes are not invented; component failures are handled explicitly.

### Phase 5 — Human review and persistence
**Status: NOT STARTED / NOT VERIFIED**

- [ ] Build editable result fields in the UI.
- [ ] Show low-confidence, unknown and conflicting values clearly.
- [ ] Allow accept, edit, mark-unknown and approve actions.
- [ ] Persist the original predictions separately from reviewed values.
- [ ] Record review state, timestamps and model/configuration identifiers.
- [ ] Add retrieval of saved products and their review state.

**Exit criteria:** User corrections persist and can be retrieved without overwriting the original prediction record.

### Phase 6 — Dataset and evaluation
**Status: NOT STARTED / NOT VERIFIED**

- [ ] Select public fashion dataset(s) and verify their licenses/terms and label suitability.
- [ ] Define taxonomy mapping and annotation guidelines.
- [ ] Curate representative, manually verified examples, including real project-style images where possible.
- [ ] Split train/validation/test sets by product identity; prevent duplicate or near-duplicate leakage.
- [ ] Implement category top-1 accuracy calculation.
- [ ] Implement per-attribute precision, recall and F1, plus the PRD-defined aggregate F1.
- [ ] Report sample counts, class imbalance, per-category/per-attribute performance, confidence bands and failure cases.
- [ ] Keep the final test set untouched while tuning prompts, thresholds or models.

**Exit criteria:** A repeatable evaluation report exists with documented data sources, label policy, scores and limitations.

### Phase 7 — Pilot refinement
**Status: NOT STARTED / NOT VERIFIED**

- [ ] Test with representative fashion product images and users.
- [ ] Analyze errors and improve taxonomy/prompt wording/normalization/thresholds where evidence supports it.
- [ ] Compare an alternative visual encoder only if CLIP's measured baseline is insufficient.
- [ ] Decide whether a frozen-embedding classifier or partial fine-tuning is justified by data and results.
- [ ] Measure end-to-end latency and user correction patterns.
- [ ] Document whether the 95% category accuracy and 90% attribute F1 targets were achieved.
- [ ] Make model promotion conditional on held-out quality and regression checks.

**Exit criteria:** Quality and latency are measured; limitations are documented; any target claims are supported by reproducible results.

## 4. Current Next Actions

Recommended order:

1. Complete the small documentation cleanup above.
2. Start Phase 1 and create the project scaffold.
3. Set up the backend environment, frontend application and local PostgreSQL connection.
4. Decide the first taxonomy and attribute vocabulary before writing model-specific logic.
5. Make the health endpoint and schema-validation tests pass.

Do not start fine-tuning before a baseline and a sufficient set of verified labels exist.

## 5. Blockers and Open Decisions

These are planning decisions still to resolve; they do not all block creating the initial code scaffold.

- [x] Final fashion taxonomy and mapping from dataset labels.
- [x] Exact allowed values for color, pattern, sleeve type, neckline and category-specific fields.
- [x] Dataset selection, permissions/license and evaluation-set size.
- [x] CPU versus GPU development/demo runtime, after measuring compatibility and latency.
- [x] Hosting and durable object storage before public release.
- [x] Whether reviewer accounts are needed for the MVP.
- [x] Retention/deletion policy for images and review data.
- [x] Upload count, size and request-rate limits.

## 6. Verification and Results Log

Add one entry for any meaningful implementation or evaluation session. Record exact commands/tests and outcomes; do not write “passed” unless the check was actually run.

| Date | Area | Work completed | Verification / evidence | Remaining issue |
|---|---|---|---|---|
| 2026-10-10 | Planning | Technology decisions and MVP documents drafted; actual implementation status not confirmed | Reviewed current PRD, Architecture, Decisions, UI requirements and Milestones content | Documentation cleanup and Phase 1 implementation remain to be confirmed |
| 2026-10-10 | Planning | Resolved open decisions regarding taxonomy, hardware, hosting, dataset, and retention policies | Updated `Decisions.md` and `memory.md` with final vocabulary, hardware (CPU), hosting (Neon), dataset (Hugging Face 70/15/15), and user policies. | Ready to start Phase 1 implementation |
| 2026-10-11 | Planning / Agent Guidance | Created `context/agent.md` as operational guide and persona specification for AI coding agents | Created `context/agent.md`, updated `memory.md` and `progress_tracker.md` references | None |
| 2026-10-11 | Phase 1 Foundation | Scaffolded locked 3-tier folder structure (`frontend/`, `backend/`, `ml/`, `scripts/`); implemented health endpoints, `mlClient.js`, Pydantic schemas, and launch scripts | Updated `Architecture.md`, `memory.md`, `agent.md`, and `README.md` with locked 3-tier architecture | Local dependency installation (`npm install`, `pip install`) by developer |

## 7. Session Update Template

Append a row to the Verification and Results Log and update the phase checkboxes after each work session.

```markdown
### Session YYYY-MM-DD
- **Phase:**
- **Completed:**
- **Files changed:**
- **Verification run:** command/test and actual result
- **Decisions made:** update `Decisions.md` and `memory.md` if a locked decision changes
- **Blockers:**
- **Next actions:**
```

## 8. Rules for Maintaining This Tracker

1. Update this file at the end of every work session, including work done by an AI coding tool.
2. Mark tasks `DONE` only when their exit criteria are verified; include evidence where practical.
3. Keep proposed work separate from completed work.
4. Do not claim model accuracy targets until the agreed evaluation has been run on a held-out test set.
5. If a technology or project requirement changes, record the rationale in `Decisions.md` and revise `memory.md` as well.
6. Keep this file focused on status and evidence. Put stable architecture and constraints in `memory.md` and detailed requirements in `PRD.md`.
