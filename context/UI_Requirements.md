## Related documentation

- [PRD](./PRD.md) — product goals, scope, and success metrics
- [Architecture](./Architecture.md) — technical and workflow context for the application
- [Decisions](./Decisions.md) — decisions that shaped the UI and implementation approach
- [Milestones](./Milestones.md) — project phases and acceptance gates
- [System Overview](../docs/system-overview.md) — simplified explanation of the image-processing pipeline

## 1. UI Requirements

### Upload view
- Allow selecting multiple images for one product.
- Show selected image previews and allow removal before submission.
- Show validation errors clearly.

### Results and review view
- Show category and attribute suggestions in editable fields.
- Show confidence/evidence indicators where meaningful.
- Display OCR text separately when helpful for verification.
- Clearly mark unknown, low-confidence, or conflicting values.
- Provide actions to accept, edit, mark unknown, and save/approve.

### Saved product view
- Show approved metadata and associated images.
- Indicate whether the record is pending review or approved.
- Preserve reviewed values distinctly from raw model suggestions.