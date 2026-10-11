import io
from PIL import Image
from typing import List, Tuple

def validate_and_decode_image(image_bytes: bytes) -> Image.Image:
    """
    Decodes and validates raw bytes into a PIL Image.
    Converts RGBA or grayscale to RGB.
    """
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img.verify()  # Verify file integrity
        # Re-open because verify() closes the file
        img = Image.open(io.BytesIO(image_bytes))
        if img.mode != "RGB":
            img = img.convert("RGB")
        return img
    except Exception as e:
        raise ValueError(f"Invalid or corrupted image: {str(e)}")

def prepare_image_batch(images_bytes_list: List[bytes]) -> List[Image.Image]:
    """
    Decodes and validates a batch of image byte buffers.
    """
    decoded = []
    for idx, b in enumerate(images_bytes_list):
        try:
            decoded.append(validate_and_decode_image(b))
        except Exception as e:
            raise ValueError(f"Image {idx+1} failed validation: {str(e)}")
    return decoded
