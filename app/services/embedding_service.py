import logging
import google.generativeai as genai
from typing import List
from app.core.config import settings

logger = logging.getLogger(__name__)

# Note: Gemini embedding-001 is 768 dimensions
EMBEDDING_DIM = 768

def embed_text(text: str) -> List[float]:
    """Embed a single text string using Gemini API."""
    try:
        result = genai.embed_content(
            model="models/embedding-001",
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']
    except Exception as e:
        logger.error(f"Gemini Embedding failed: {e}")
        # Return zero vector fallback
        return [0.0] * EMBEDDING_DIM

def embed_batch(texts: List[str]) -> List[List[float]]:
    """Embed a batch of texts using Gemini API."""
    if not texts:
        return []
    try:
        result = genai.embed_content(
            model="models/embedding-001",
            content=texts,
            task_type="retrieval_document"
        )
        return result['embedding']
    except Exception as e:
        logger.error(f"Gemini Batch Embedding failed: {e}")
        return [[0.0] * EMBEDDING_DIM for _ in texts]
