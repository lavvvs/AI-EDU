import os
import logging
import requests
from typing import List
from app.core.config import settings

logger = logging.getLogger(__name__)

# Reverting to original dimensions for BAAI/bge-small-en-v1.5
EMBEDDING_DIM = 384
API_URL = "https://api-inference.huggingface.co/models/BAAI/bge-small-en-v1.5"
HF_TOKEN = settings.HUGGINGFACEHUB_API_TOKEN

def query_hf(payload):
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

def embed_text(text: str) -> List[float]:
    """Embed a single text string using HF Cloud API."""
    if not HF_TOKEN:
        logger.error("HuggingFace Token missing!")
        return [0.0] * EMBEDDING_DIM
    
    try:
        # The model returns a list of embeddings
        output = query_hf({"inputs": text})
        return output
    except Exception as e:
        logger.error(f"HF Embedding failed: {e}")
        return [0.0] * EMBEDDING_DIM

def embed_batch(texts: List[str]) -> List[List[float]]:
    """Embed a batch of texts using HF Cloud API."""
    if not texts or not HF_TOKEN:
        return [[0.0] * EMBEDDING_DIM for _ in texts]
    
    try:
        output = query_hf({"inputs": texts})
        return output
    except Exception as e:
        logger.error(f"HF Batch Embedding failed: {e}")
        return [[0.0] * EMBEDDING_DIM for _ in texts]
