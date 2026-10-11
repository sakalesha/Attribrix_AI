# Attribrix AI

**Attribrix AI** is an AI-assisted fashion product catalog enrichment web application. It automates the extraction of structured metadata from product images to reduce manual data entry for sellers.

## Overview
A seller uploads one or more images of a fashion product. The system analyzes the images, predicts the product category and visible attributes (like color and pattern), reads text from visible labels using OCR (like brands), and returns structured JSON metadata. The seller reviews and corrects the suggestions before saving the approved product record. Corrections are retained to improve future evaluation and model performance.

### Project Goals
- **Category classification accuracy**: ≥ 95%
- **Attribute F1 score**: ≥ 90%
- Support for human-in-the-loop review and correction to prevent AI hallucination of unknown fields.

## Current Status
**Phase 1: Project Foundation**
- All architectural decisions, tech stack selections, and data vocabularies have been resolved.
- Dataset (Hugging Face) and hosting (Neon) are selected.
- Ready to scaffold the React frontend and FastAPI backend.

## Tech Stack
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Python + FastAPI
- **AI/Visual Baseline**: Hugging Face Transformers + pretrained CLIP + PyTorch
- **OCR**: PaddleOCR
- **Database**: PostgreSQL (via Neon)
- **Data Validation**: Pydantic

## Documentation
- [Product Requirements Document (PRD)](context/PRD.md)
- [Architecture & Data Flow](context/Architecture.md)
- [System Overview](docs/system-overview.md)
- [UI Requirements](context/UI_Requirements.md)
- [Milestones](context/Milestones.md)
- [Decisions Record](context/Decisions.md)
- [Project Memory](context/memory.md)
- [AI Agent Guide](context/agent.md)
- [Progress Tracker](context/progress_tracker.md)

## High-Level Architecture
Please refer to the [System Overview](docs/system-overview.md) for a detailed walkthrough and Mermaid diagram of how the components interact.
