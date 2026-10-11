import os
from typing import List, Dict, Any, Optional
from PIL import Image

class CLIPModelWrapper:
    def __init__(self, model_name: str = "openai/clip-vit-base-patch32", device: str = "cpu"):
        self.model_name = model_name
        self.device = device
        self._model = None
        self._processor = None
        self._loaded = False

    def load(self):
        """
        Loads CLIP model and processor lazily.
        """
        if self._loaded:
            return
        try:
            from transformers import CLIPProcessor, CLIPModel
            import torch

            self._processor = CLIPProcessor.from_pretrained(self.model_name)
            self._model = CLIPModel.from_pretrained(self.model_name).to(self.device)
            self._loaded = True
        except Exception as e:
            # Keep as unloaded if torch/transformers are not yet installed in local environment
            self._loaded = False

    @property
    def is_loaded(self) -> bool:
        return self._loaded

    def predict_candidates(self, images: List[Image.Image], candidate_texts: List[str]) -> List[Dict[str, float]]:
        """
        Scores candidate text descriptions against the given images.
        """
        if not self._loaded:
            # Fallback heuristic for testing/scaffolding
            return [{"label": c, "score": 1.0 / len(candidate_texts)} for c in candidate_texts]

        import torch

        inputs = self._processor(
            text=candidate_texts,
            images=images,
            return_tensors="pt",
            padding=True,
        ).to(self.device)

        with torch.no_grad():
            outputs = self._model(**inputs)
            logits_per_image = outputs.logits_per_image
            probs = logits_per_image.softmax(dim=1).mean(dim=0)  # average across multiple views

        scores = [
            {"label": candidate_texts[i], "score": float(probs[i])}
            for i in range(len(candidate_texts))
        ]
        return sorted(scores, key=lambda x: x["score"], reverse=True)

# Global singleton
clip_wrapper = CLIPModelWrapper()
