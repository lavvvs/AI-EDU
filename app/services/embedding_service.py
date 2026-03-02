import logging
from sentence_transformers import SentenceTransformer
from typing import List

logger = logging.getLogger(__name__)

# Singleton model instance
_model = None

def _get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        logger.info("Loading embedding model: BAAI/bge-small-en-v1.5")
        _model = SentenceTransformer("BAAI/bge-small-en-v1.5")
        logger.info("Embedding model loaded successfully")
    return _model

def embed_text(text: str) -> List[float]:
    """Embed a single text string. Returns 384-dim vector."""
    model = _get_model()
    embedding = model.encode(text, normalize_embeddings=True)
    return embedding.tolist()

def embed_batch(texts: List[str]) -> List[List[float]]:
    """Embed a batch of texts. Returns list of 384-dim vectors."""
    if not texts:
        return []
    model = _get_model()
    embeddings = model.encode(texts, normalize_embeddings=True, batch_size=32)
    return embeddings.tolist()

EMBEDDING_DIM = 384
