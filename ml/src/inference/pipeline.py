from typing import List, Dict, Any, Optional
from PIL import Image

from ..data.taxonomy import (
    CATEGORIES,
    COLOR_VALUES,
    PATTERN_VALUES,
    SLEEVE_VALUES,
    NECKLINE_VALUES,
    MATERIAL_VALUES,
)
from ..data.schemas import (
    ProductPredictionResponse,
    CategoryItem,
    ProductAttributes,
    AttributeItem,
)
from ..models.clip_model import clip_wrapper

class InferencePipeline:
    def __init__(self):
        self.category_labels = list(CATEGORIES.keys())
        self.category_prompts = [
            f"a photo of fashion {CATEGORIES[c]['display_name']}" for c in self.category_labels
        ]
        self.color_prompts = [f"a photo of a {c} garment" for c in COLOR_VALUES if c != "unknown"]
        self.pattern_prompts = [f"a photo with {p} pattern" for p in PATTERN_VALUES if p != "unknown"]

    def run(self, images: List[Image.Image], product_id: Optional[str] = None) -> ProductPredictionResponse:
        # 1. Predict category
        cat_scores = clip_wrapper.predict_candidates(images, self.category_prompts)
        top_cat_prompt = cat_scores[0]["label"]
        top_cat_idx = self.category_prompts.index(top_cat_prompt)
        pred_cat_id = self.category_labels[top_cat_idx]
        cat_conf = round(cat_scores[0]["score"], 4)

        # 2. Predict color
        color_scores = clip_wrapper.predict_candidates(images, self.color_prompts)
        top_color_idx = self.color_prompts.index(color_scores[0]["label"])
        pred_color = [c for c in COLOR_VALUES if c != "unknown"][top_color_idx]
        color_conf = round(color_scores[0]["score"], 4)

        # 3. Predict pattern
        pattern_scores = clip_wrapper.predict_candidates(images, self.pattern_prompts)
        top_pattern_idx = self.pattern_prompts.index(pattern_scores[0]["label"])
        pred_pattern = [p for p in PATTERN_VALUES if p != "unknown"][top_pattern_idx]
        pattern_conf = round(pattern_scores[0]["score"], 4)

        # 4. Construct attributes conforming to Pydantic schema
        attributes = ProductAttributes(
            color=AttributeItem(
                value=pred_color,
                confidence=color_conf,
                source="clip",
                status="suggested" if color_conf >= 0.5 else "needs_review",
            ),
            pattern=AttributeItem(
                value=pred_pattern,
                confidence=pattern_conf,
                source="clip",
                status="suggested" if pattern_conf >= 0.5 else "needs_review",
            ),
            sleeve_type=AttributeItem(
                value=None,
                confidence=None,
                source="not_observed",
                status="unknown",
            ),
            neckline=AttributeItem(
                value=None,
                confidence=None,
                source="not_observed",
                status="unknown",
            ),
            material=AttributeItem(
                value=None,
                confidence=None,
                source="not_observed",
                status="unknown",
            ),
            brand=AttributeItem(
                value=None,
                confidence=None,
                source="ocr",
                status="unknown",
            ),
        )

        return ProductPredictionResponse(
            product_id=product_id,
            category=CategoryItem(
                value=pred_cat_id,
                confidence=cat_conf,
                source="clip",
                status="suggested" if cat_conf >= 0.7 else "needs_review",
            ),
            attributes=attributes,
            review_status="pending",
            metadata_version="1.0.0",
        )

inference_pipeline = InferencePipeline()
