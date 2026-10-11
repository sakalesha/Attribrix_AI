# It is to predict the category and attributes of a given image. 

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

# It is to predict the category and attributes of a given image. 
class InferencePipeline:
    def __init__(self):
        self.category_labels = list(CATEGORIES.keys())
        self.category_prompts = [
            f"a photo of fashion {CATEGORIES[c]['display_name']}" for c in self.category_labels
        ]
        self.color_prompts = [f"a photo of a {c} garment" for c in COLOR_VALUES if c != "unknown"]
        self.pattern_prompts = [f"a photo with {p} pattern" for p in PATTERN_VALUES if p != "unknown"]
        self.material_prompts = [f"a photo of {m} texture fabric garment" for m in MATERIAL_VALUES if m != "unknown"]
        self.sleeve_prompts = [f"a photo of a {s.replace('_', ' ')} garment" for s in SLEEVE_VALUES if s not in ["unknown", "not_applicable"]]
        self.neckline_prompts = [f"a photo of a garment with {n.replace('_', ' ')}" for n in NECKLINE_VALUES if n not in ["unknown", "not_applicable"]]

    # It runs the pipeline.
    # Input: images (list of PIL images), product_id (optional string) 
    # Output: ProductPredictionResponse
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

        # 4. Predict material (candidate scoring even if low confidence)
        mat_scores = clip_wrapper.predict_candidates(images, self.material_prompts)
        top_mat_idx = self.material_prompts.index(mat_scores[0]["label"])
        pred_material = [m for m in MATERIAL_VALUES if m != "unknown"][top_mat_idx]
        mat_conf = round(mat_scores[0]["score"], 4)

        # 5. Predict sleeve type (for apparel)
        sleeve_scores = clip_wrapper.predict_candidates(images, self.sleeve_prompts)
        top_sleeve_idx = self.sleeve_prompts.index(sleeve_scores[0]["label"])
        pred_sleeve = [s for s in SLEEVE_VALUES if s not in ["unknown", "not_applicable"]][top_sleeve_idx]
        sleeve_conf = round(sleeve_scores[0]["score"], 4)

        # 6. Predict neckline
        neck_scores = clip_wrapper.predict_candidates(images, self.neckline_prompts)
        top_neck_idx = self.neckline_prompts.index(neck_scores[0]["label"])
        pred_neckline = [n for n in NECKLINE_VALUES if n not in ["unknown", "not_applicable"]][top_neck_idx]
        neck_conf = round(neck_scores[0]["score"], 4)

        # 7. Construct attributes conforming to Pydantic schema
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
            material=AttributeItem(
                value=pred_material,
                confidence=mat_conf,
                source="clip",
                status="suggested" if mat_conf >= 0.5 else "needs_review",
            ),
            sleeve_type=AttributeItem(
                value=pred_sleeve,
                confidence=sleeve_conf,
                source="clip",
                status="suggested" if sleeve_conf >= 0.5 else "needs_review",
            ),
            neckline=AttributeItem(
                value=pred_neckline,
                confidence=neck_conf,
                source="clip",
                status="suggested" if neck_conf >= 0.5 else "needs_review",
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
