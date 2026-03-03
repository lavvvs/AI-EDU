import logging
from typing import Dict, Any, List
from youtube_transcript_api import YouTubeTranscriptApi

from app.services.embedding_service import embed_text, embed_batch
from app.services.vector_service import store_chunks, search_similar
from app.services.llm_service import generate_answer

logger = logging.getLogger(__name__)

SIMILARITY_THRESHOLD = 0.25  # bge-small cosine via Qdrant: typical relevant range 0.3-0.7
CHUNK_SIZE = 800
CHUNK_OVERLAP = 100


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
    """Split text into overlapping chunks using recursive character splitting."""
    if not text:
        return []

    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size

        # Try to break at sentence boundary
        if end < len(text):
            # Look for sentence-ending punctuation near the end
            for sep in [". ", ".\n", "? ", "! ", "\n\n"]:
                last_sep = text[start:end].rfind(sep)
                if last_sep > chunk_size // 2:
                    end = start + last_sep + len(sep)
                    break

        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)

        start = end - overlap

    return chunks


def process_and_store(
    user_id: str,
    document_id: str,
    text: str,
) -> int:
    """Chunk text, generate embeddings, and store in Qdrant. Returns chunk count."""
    chunks = chunk_text(text)
    if not chunks:
        raise ValueError("No content to process after chunking")

    embeddings = embed_batch(chunks)
    count = store_chunks(user_id, document_id, chunks, embeddings)
    logger.info(f"Processed {count} chunks for doc {document_id}")
    return count


def query_document(
    user_id: str,
    document_id: str,
    question: str,
) -> Dict[str, Any]:
    """Full RAG pipeline: embed query → vector search → threshold → LLM answer."""
    logger.info(f"[RAG] QA request: user={user_id}, doc={document_id}, q='{question[:80]}'")

    # 1. Embed the question
    query_embedding = embed_text(question)
    logger.info(f"[RAG] Query embedded: dim={len(query_embedding)}")

    # 2. Search Qdrant for similar chunks
    results = search_similar(
        user_id=user_id,
        document_id=document_id,
        query_embedding=query_embedding,
        top_k=5,
    )

    logger.info(f"[RAG] Qdrant returned {len(results)} results")
    for i, r in enumerate(results):
        logger.info(f"[RAG]   #{i+1} score={r['score']:.4f} chunk='{r['content'][:60]}...'")

    if not results:
        logger.warning(f"[RAG] No results found for doc={document_id}. Collection may be empty or filters don't match.")
        return {
            "answer": "I don't have enough information in the provided material to answer that question.",
            "confidence": 0.0,
            "sources": [],
        }

    # 3. Check similarity threshold
    top_score = results[0]["score"]
    logger.info(f"[RAG] Top score={top_score:.4f}, threshold={SIMILARITY_THRESHOLD}")

    if top_score < SIMILARITY_THRESHOLD:
        logger.warning(f"[RAG] Below threshold: {top_score:.4f} < {SIMILARITY_THRESHOLD}")
        return {
            "answer": "I don't have enough information in the provided material to answer that question. The content doesn't seem to cover this topic.",
            "confidence": round(top_score, 3),
            "sources": [],
        }

    # 4. Build context from top results (include all results above half-threshold)
    context_parts = []
    sources = []
    min_include = SIMILARITY_THRESHOLD * 0.5
    for r in results:
        if r["score"] >= min_include:
            context_parts.append(r["content"])
            sources.append({
                "chunk": r["content"][:200] + "..." if len(r["content"]) > 200 else r["content"],
                "score": round(r["score"], 3),
            })

    context = "\n\n---\n\n".join(context_parts)
    logger.info(f"[RAG] Sending {len(context_parts)} chunks to LLM ({len(context)} chars)")

    # 5. Generate answer via LLM
    answer = generate_answer(context=context, question=question)
    logger.info(f"[RAG] LLM answer generated: '{answer[:80]}...'")

    return {
        "answer": answer,
        "confidence": round(top_score, 3),
        "sources": sources,
    }


def _extract_video_id(url: str) -> str:
    """Extract YouTube video ID from various URL formats."""
    if "v=" in url:
        return url.split("v=")[1].split("&")[0]
    elif "youtu.be/" in url:
        return url.split("youtu.be/")[1].split("?")[0]
    else:
        return url.split("/")[-1]


def get_youtube_transcript(url: str) -> str:
    """Smart Pipeline: Try captions first (server-friendly), then audio fallback (local-friendly)."""

    video_id = _extract_video_id(url)

    # 1. Primary: Caption-based extraction (works on cloud servers without cookies)
    try:
        logger.info(f"Attempting caption-based transcript for video: {video_id}")
        from youtube_transcript_api import YouTubeTranscriptApi
        transcript_data = YouTubeTranscriptApi.get_transcript(video_id)
        transcript = " ".join([t["text"] for t in transcript_data])
        if transcript.strip():
            logger.info(f"Caption transcript obtained: {len(transcript)} chars")
            return transcript
    except Exception as caption_e:
        logger.warning(f"Caption extraction failed (will try audio): {caption_e}")

    # 2. Fallback: yt-dlp audio download + Whisper transcription (works locally)
    try:
        from app.services.audio_service import process_youtube_audio
        logger.info(f"Attempting audio-based transcription for: {url}")
        transcript = process_youtube_audio(url)
        if not transcript:
            raise ValueError("Empty transcript generated from audio.")
        return transcript
    except Exception as audio_e:
        logger.error(f"Audio pipeline also failed: {audio_e}")
        raise ValueError(
            f"Could not analyze YouTube content: {str(audio_e)}. "
            f"This video may require authentication on the server, or has no available captions."
        )
