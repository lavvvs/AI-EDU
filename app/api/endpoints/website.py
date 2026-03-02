import logging
from fastapi import APIRouter, Form, Depends, HTTPException
from app.core.database import get_database
from app.api.deps import get_current_user
from app.schemas.user import UserOut
from app.schemas.response import ProcessResponse, QAResponse
from app.services.rag_service import process_and_store, query_document
from app.services.scraping_service import scrape_website
from app.services.llm_service import generate_summary
from datetime import datetime
from bson import ObjectId

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/process", response_model=ProcessResponse)
async def process_website(
    url: str = Form(...),
    current_user: UserOut = Depends(get_current_user),
):
    """Scrape website, chunk, embed, and store."""
    try:
        # Scrape content
        content = scrape_website(url)

        # Generate summary
        summary = generate_summary(content)

        # Store metadata in MongoDB
        db = await get_database()
        doc_data = {
            "user_id": ObjectId(current_user.id),
            "title": f"Website: {url}",
            "type": "website",
            "summary": summary,
            "source_url": url,
            "created_at": datetime.utcnow(),
        }
        result = await db["documents"].insert_one(doc_data)
        document_id = str(result.inserted_id)

        # Process chunks and store in Qdrant
        chunk_count = process_and_store(
            user_id=str(current_user.id),
            document_id=document_id,
            text=content,
        )

        await db["documents"].update_one(
            {"_id": result.inserted_id},
            {"$set": {"chunk_count": chunk_count}},
        )

        return ProcessResponse(
            document_id=document_id,
            summary=summary,
            chunk_count=chunk_count,
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Website processing failed: {e}")
        raise HTTPException(status_code=500, detail=f"Website processing failed: {str(e)}")


@router.post("/qa", response_model=QAResponse)
async def website_qa(
    query: str = Form(...),
    document_id: str = Form(...),
    current_user: UserOut = Depends(get_current_user),
):
    """Ask a question about a specific website."""
    try:
        db = await get_database()
        doc = await db["documents"].find_one({
            "_id": ObjectId(document_id),
            "user_id": ObjectId(current_user.id),
        })
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")

        result = query_document(
            user_id=str(current_user.id),
            document_id=document_id,
            question=query,
        )

        return QAResponse(**result)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Website QA failed: {e}")
        raise HTTPException(status_code=500, detail=f"QA failed: {str(e)}")
