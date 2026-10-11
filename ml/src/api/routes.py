# It is the API routes for the ML service. 

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from typing import List, Optional

from ..data.taxonomy import (
    CATEGORIES,
    COLOR_VALUES,
    PATTERN_VALUES,
    SLEEVE_VALUES,
    NECKLINE_VALUES,
    MATERIAL_VALUES,
    BRAND_STATUS_VALUES,
)
from ..data.schemas import ProductPredictionResponse, HealthResponse
from ..preprocessing.image_processor import prepare_image_batch
from ..inference.pipeline import inference_pipeline
from ..models.clip_model import clip_wrapper

router = APIRouter()

# It is the health check function. 
@router.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="ok",
        service="attribrix-ml",
        version="1.0.0",
        device=clip_wrapper.device,
        models_loaded={
            "clip": clip_wrapper.is_loaded,
        },
    )

# It is the health check function for the API. 
@router.get("/api/v1/health", response_model=HealthResponse)
def api_v1_health_check():
    return health_check()

# It is the function to get the taxonomy. 
@router.get("/api/v1/taxonomy")
def get_taxonomy():
    return {
        "categories": CATEGORIES,
        "vocabularies": {
            "color": COLOR_VALUES,
            "pattern": PATTERN_VALUES,
            "sleeve_type": SLEEVE_VALUES,
            "neckline": NECKLINE_VALUES,
            "material": MATERIAL_VALUES,
            "brand_status": BRAND_STATUS_VALUES,
        },
    }

# It is the function to predict the category and attributes of a given image. 
@router.post("/api/v1/predict", response_model=ProductPredictionResponse)
async def predict_product(
    images: List[UploadFile] = File(...),
    product_id: Optional[str] = Form(None),
):
    if not images:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one product image must be uploaded.",
        )

    try:
        raw_bytes_list = []
        for img in images:
            content = await img.read()
            raw_bytes_list.append(content)

        pil_images = prepare_image_batch(raw_bytes_list)
        result = inference_pipeline.run(pil_images, product_id=product_id)
        return result
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(ve),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference error: {str(e)}",
        )
