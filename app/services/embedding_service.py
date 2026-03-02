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
    import time
    
    # Simple retry loop for "Model is loading" scenario (common with free tier)
    for _ in range(3):
        response = requests.post(API_URL, headers=headers, json=payload, timeout=30)
        result = response.json()
        
        # Handle "Model is loading"
        if isinstance(result, dict) and "estimated_time" in result:
            wait_time = min(result.get("estimated_time", 10), 20)
            logger.info(f"HF Model is loading, waiting {wait_time}s...")
            time.sleep(wait_time)
            continue
            
        if response.status_code != 200:
            error_msg = result.get("error", "Unknown HF API Error")
            logger.error(f"HF API Error ({response.status_code}): {error_msg}")
            raise Exception(error_msg)
            
        return result
    
    raise Exception("Model failed to load after multiple retries")

def embed_text(text: str) -> List[float]:
    """Embed a single text string using HF Cloud API."""
    if not HF_TOKEN:
        logger.error("HuggingFace Token missing!")
        return [0.0] * EMBEDDING_DIM
    
    try:
        output = query_hf({"inputs": text})
        # If it's a list containing a list (nested), grab the first
        if isinstance(output, list) and len(output) > 0 and isinstance(output[0], list):
             return output[0]
        return output
    except Exception as e:
        logger.error(f"HF Embedding failed: {e}")
        # Crash explicitly so the UI shows the real error instead of 'error' strings
        raise e

def embed_batch(texts: List[str]) -> List[List[float]]:
    """Embed a batch of texts using HF Cloud API."""
    if not texts:
        return []
        
    if not HF_TOKEN:
        raise Exception("HuggingFace Token missing in environment")
    
    try:
        output = query_hf({"inputs": texts})
        return output
    except Exception as e:
        logger.error(f"HF Batch Embedding failed: {e}")
        raise e
