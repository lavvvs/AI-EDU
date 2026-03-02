import logging
import time
from typing import List
from app.core.config import settings
from huggingface_hub import InferenceClient

logger = logging.getLogger(__name__)

# BAAI/bge-small-en-v1.5 dimensions
EMBEDDING_DIM = 384
HF_TOKEN = settings.HUGGINGFACEHUB_API_TOKEN
MODEL_NAME = "BAAI/bge-small-en-v1.5"

# Singleton client
_client = None

def get_client():
    global _client
    if _client is None:
        if not HF_TOKEN:
            logger.error("HuggingFace Token (HUGGINGFACEHUB_API_TOKEN) missing!")
        _client = InferenceClient(token=HF_TOKEN)
    return _client

def embed_text(text: str) -> List[float]:
    """Embed a single text string using HF Cloud API."""
    client = get_client()
    try:
        # feature_extraction returns a numpy array-like list
        output = client.feature_extraction(text, model=MODEL_NAME)
        
        # If the result is nested (batch of 1), flatten it
        if isinstance(output, list) and len(output) > 0 and isinstance(output[0], list):
            return output[0]
        # Sometimes it returns a 1D list directly
        return output.tolist() if hasattr(output, 'tolist') else output
    except Exception as e:
        logger.error(f"HF Embedding failed: {e}")
        # If it's a loading error, the client usually retries, but we crash so the user knows
        raise Exception(f"AI Model is booting up or unavailable: {str(e)}")

def embed_batch(texts: List[str]) -> List[List[float]]:
    """Embed a batch of texts using HF Cloud API."""
    if not texts:
        return []
    
    client = get_client()
    try:
        output = client.feature_extraction(texts, model=MODEL_NAME)
        # Convert to list of lists
        return output.tolist() if hasattr(output, 'tolist') else output
    except Exception as e:
        logger.error(f"HF Batch Embedding failed: {e}")
        raise Exception(f"AI Model Batch failing: {str(e)}")
