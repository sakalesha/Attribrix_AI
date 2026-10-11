# It defines the schemas for the ML module.      

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

# It defines the attributes of a product.  
class AttributeItem(BaseModel):
    value: Optional[str] = None
    confidence: Optional[float] = None
    source: str = Field(default="visual_model", description="clip, ocr, visual_model, user")
    status: str = Field(default="suggested", description="suggested, verified, unknown, needs_review")

# It defines the category of a product. 
class CategoryItem(BaseModel):
    value: str
    confidence: Optional[float] = None
    source: str = "clip"
    status: str = "suggested"

# It defines the attributes of a product. 
class ProductAttributes(BaseModel):
    color: AttributeItem
    pattern: AttributeItem
    sleeve_type: Optional[AttributeItem] = None
    neckline: Optional[AttributeItem] = None
    material: AttributeItem
    brand: AttributeItem

# It defines the prediction response of a product. 
class ProductPredictionResponse(BaseModel):
    product_id: Optional[str] = None
    category: CategoryItem
    attributes: ProductAttributes
    review_status: str = "pending"
    metadata_version: str = "1.0.0"

# It defines the health response of the ML service.
class HealthResponse(BaseModel):
    status: str = "ok"
    service: str = "attribrix-ml"
    version: str = "1.0.0"
    device: str
    models_loaded: Dict[str, bool]
