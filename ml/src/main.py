import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .api.routes import router as api_router
from .models.clip_model import clip_wrapper

load_dotenv()

app = FastAPI(
    title="Attribrix AI — Machine Learning Service",
    description="Vision & OCR inference microservice for fashion catalog enrichment",
    version="1.0.0",
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # Attempt lazy model loading on startup
    device = os.getenv("DEVICE", "cpu")
    clip_model_name = os.getenv("CLIP_MODEL_NAME", "openai/clip-vit-base-patch32")
    clip_wrapper.device = device
    clip_wrapper.model_name = clip_model_name
    clip_wrapper.load()

# Mount API routes
app.include_router(api_router)

@app.get("/")
def root():
    return {
        "service": "Attribrix AI ML Microservice",
        "health": "/health",
        "taxonomy": "/api/v1/taxonomy",
    }
