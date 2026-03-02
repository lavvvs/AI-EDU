import logging
import uuid
from typing import List, Dict, Any, Optional
from qdrant_client import QdrantClient, models
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
    FilterSelector,
)
from app.services.embedding_service import EMBEDDING_DIM

logger = logging.getLogger(__name__)

# Singleton Qdrant client — persistent local storage
_client: Optional[QdrantClient] = None

COLLECTION_NAME = "document_chunks"


def _get_client() -> QdrantClient:
    global _client
    from app.core.config import settings
    if _client is None:
        if settings.QDRANT_URL:
            logger.info(f"Initializing Qdrant Cloud client at {settings.QDRANT_URL}")
            _client = QdrantClient(
                url=settings.QDRANT_URL,
                api_key=settings.QDRANT_API_KEY,
                timeout=60, # Increased timeout for cloud stability
            )
        else:
            logger.info(f"Initializing Qdrant persistent client at {settings.QDRANT_DB_PATH}")
            _client = QdrantClient(path=settings.QDRANT_DB_PATH)
        _ensure_collection()
        logger.info("Qdrant client ready")
    return _client


def _ensure_collection():
    """Create or recreate the main collection to match current embedding dimensions."""
    client = _client
    try:
        collections = [c.name for c in client.get_collections().collections]
        
        if COLLECTION_NAME in collections:
            # Check if dimensions match
            col_info = client.get_collection(COLLECTION_NAME)
            current_dim = col_info.config.params.vectors.size
            
            if current_dim != EMBEDDING_DIM:
                logger.warning(f"Qdrant dimension mismatch: Cluster={current_dim}, Config={EMBEDDING_DIM}. Recreating...")
                client.delete_collection(COLLECTION_NAME)
                collections.remove(COLLECTION_NAME)
        
        if COLLECTION_NAME not in collections:
            client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(
                    size=EMBEDDING_DIM,
                    distance=Distance.COSINE,
                ),
            )
            # Create payload indexes for filtering performance
            client.create_payload_index(
                collection_name=COLLECTION_NAME,
                field_name="user_id",
                field_schema="keyword",
            )
            client.create_payload_index(
                collection_name=COLLECTION_NAME,
                field_name="document_id",
                field_schema="keyword",
            )
            logger.info(f"Created Qdrant collection: {COLLECTION_NAME} (Size: {EMBEDDING_DIM})")
            
    except Exception as e:
        logger.error(f"Failed to ensure Qdrant collection: {e}")


def store_chunks(
    user_id: str,
    document_id: str,
    chunks: List[str],
    embeddings: List[List[float]],
) -> int:
    """Store document chunks with their embeddings in Qdrant."""
    client = _get_client()
    points = []
    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        point_id = str(uuid.uuid4())
        points.append(
            PointStruct(
                id=point_id,
                vector=embedding,
                payload={
                    "user_id": user_id,
                    "document_id": document_id,
                    "content": chunk,
                    "chunk_index": i,
                },
            )
        )

    # Upsert in batches of 100
    batch_size = 100
    for i in range(0, len(points), batch_size):
        batch = points[i : i + batch_size]
        client.upsert(collection_name=COLLECTION_NAME, points=batch)

    logger.info(f"Stored {len(points)} chunks for document {document_id}")
    return len(points)


def search_similar(
    user_id: str,
    document_id: str,
    query_embedding: List[float],
    top_k: int = 5,
) -> List[Dict[str, Any]]:
    """Search for similar chunks using qdrant-client 1.17+ query_points API."""
    client = _get_client()

    # Debug: check collection status
    col_info = client.get_collection(COLLECTION_NAME)
    logger.info(f"[QDRANT] Collection '{COLLECTION_NAME}' has {col_info.points_count} total points")
    logger.info(f"[QDRANT] Searching: user_id='{user_id}', document_id='{document_id}'")

    query_filter = Filter(
        must=[
            FieldCondition(key="user_id", match=MatchValue(value=user_id)),
            FieldCondition(key="document_id", match=MatchValue(value=document_id)),
        ]
    )

    response = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_embedding,
        query_filter=query_filter,
        limit=top_k,
        with_payload=True,
    )
    logger.info(f"[QDRANT] Query returned {len(response.points)} points")

    results = []
    for point in response.points:
        results.append({
            "content": point.payload["content"],
            "score": point.score,
            "chunk_index": point.payload.get("chunk_index", 0),
        })

    return results


def delete_document_chunks(user_id: str, document_id: str) -> None:
    """Delete all chunks for a specific document."""
    client = _get_client()
    client.delete(
        collection_name=COLLECTION_NAME,
        points_selector=FilterSelector(
            filter=Filter(
                must=[
                    FieldCondition(key="user_id", match=MatchValue(value=user_id)),
                    FieldCondition(key="document_id", match=MatchValue(value=document_id)),
                ]
            )
        ),
    )
    logger.info(f"Deleted chunks for document {document_id}")
