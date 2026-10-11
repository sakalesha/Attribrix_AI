# Decisions made Before writing PRD file

## Related documentation

- [PRD](./PRD.md) — scope, metrics, and product requirements
- [Architecture](./Architecture.md) — system design and technical decisions
- [UI Requirements](./UI_Requirements.md) — user interaction and workflow expectations
- [Milestones](./Milestones.md) — delivery phases and acceptance gates
- [System Overview](../docs/system-overview.md) — narrative overview for onboarding and explanation


1. Product domain: I recommend starting with fashion products, then expanding after the pipeline works.
2. Visual model: Start with CLIP, but benchmark it on representative images before committing to it as the final encoder.
3. Database: PostgreSQL is my recommendation for structured records and flexible attributes; MongoDB is a reasonable alternative.
4. OCR: Test PaddleOCR on real product labels to establish whether its performance justifies the installation and runtime requirements.

# Technology decisions and boundaries

- CLIP is the initial baseline, not a final model choice guaranteed to meet the targets. Benchmark it on representative fashion images before committing to it for production.
- Start with pretrained inference and prompt/category experiments. Fine-tuning is deferred until evaluation shows a need and enough suitable labeled data exists.
- PaddleOCR must be tested on real product labels and image conditions. OCR text is evidence to process, not automatically a verified brand.
- PostgreSQL is the selected database. MongoDB is not part of the initial stack.
- Local file storage is for development/demo use. Production deployment should use controlled object storage or an equivalent durable storage service before accepting important user data.
- Use deterministic application logic and Pydantic validation to construct JSON; an external LLM API is not required for the MVP.

# Open Decisions for Implementation

28: These do not block writing the first code skeleton, but must be settled before final evaluation:
29: 
30: 1. **Exact taxonomy:** Confirm category names and how source dataset labels map to them.
31:    - **Decision:** Start with nine broad fashion categories: `tops`, `bottoms`, `dresses_one_piece`, `outerwear`, `footwear`, `bags`, `accessories`, `innerwear_sleepwear`, `ethnic_traditional`.
32: 2. **Exact attribute vocabulary:** Confirm allowed values for color, pattern, sleeve type, neckline, and other category-dependent attributes.
33:    - **Decision:** Use controlled vocabularies for color, pattern, sleeve type, neckline, and material. Brand is a normalized string with states like `unknown`, `needs_review`, and `verified`.
34: 3. **Evaluation dataset size:** Determine it based on category coverage and the confidence required in reported scores; avoid using a tiny set to claim the targets.
35:    - **Decision:** Use Hugging Face Datasets with 44,072 total records split into 70% Training (30,850), 15% Validation (6,611), and 15% Held-out test (6,611).
36: 4. **Runtime hardware:** Decide whether development and demo inference will use CPU or a supported GPU after measuring performance and installation constraints.
37:    - **Decision:** Development and demo inference will run on a CPU.
38: 5. **Deployment target:** Local demonstration first; select hosting and durable image storage before public release.
39:    - **Decision:** Use Neon which supports PostgreSQL and object storage with bucket name `product-image`.
40: 6. **Review identity and retention:** Decide whether the MVP needs reviewer accounts and how long image/review data should be retained.
41:    - **Decision:** No reviewer accounts/user authentication required. Keep ideal limit for data retention.
42: 7. **Upload constraints:**
43:    - **Decision:** Keep ideal limits for upload count, file-size, and rate limits for now.
