from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class AttributeItem(BaseModel):
    value: Optional[str] = None
    confidence: Optional[float] = None
    source: str = Field(default="visual_model", description="clip, ocr, visual_model, user")
    status: str = Field(default="suggested", description="suggested, verified, unknown, needs_review")

class CategoryItem(BaseModel):
    value: str
    confidence: Optional[float] = None
    source: str = "clip"
    status: str = "suggested"

class ProductAttributes(BaseModel):
    color: AttributeItem
    pattern: AttributeItem
    sleeve_type: Optional[AttributeItem] = None
    neckline: Optional[AttributeItem] = None
    material: AttributeItem
    brand: AttributeItem

class ProductPredictionResponse(BaseModel):
    product_id: Optional[str] = None
    category: CategoryItem
    attributes: ProductAttributes
    review_status: str = "pending"
    metadata_version: str = "1.0.0"

class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "attribrix-ml"
    version: str = "1.0.0"
    device: str
    models_loaded: Dict[str, bool]
