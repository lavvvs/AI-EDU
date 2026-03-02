import tempfile
import logging
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from app.core.database import get_database
from app.api.deps import get_current_user
from app.schemas.user import UserOut
from app.schemas.response import ProcessResponse, QAResponse
from app.services.rag_service import process_and_store, query_document
from app.services.llm_service import generate_summary
from datetime import datetime
from bson import ObjectId

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/process", response_model=ProcessResponse)
async def process_pdf(
    file: UploadFile = File(...),
    current_user: UserOut = Depends(get_current_user),
):
    """Upload a PDF, extract text, chunk, embed, and store in Qdrant."""
    try:
        # Save to temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name

        # Extract text with PyMuPDF
        import fitz  # pymupdf

        doc = fitz.open(tmp_path)
        full_text = ""
        for page in doc:
            full_text += page.get_text() + "\n"
        doc.close()

        if not full_text.strip():
            raise HTTPException(status_code=400, detail="PDF contains no extractable text")

        # Generate summary
        summary = generate_summary(full_text)

        # Store metadata in MongoDB
        db = await get_database()
        doc_data = {
            "user_id": ObjectId(current_user.id),
            "title": file.filename,
            "type": "pdf",
            "summary": summary,
            "created_at": datetime.utcnow(),
        }
        result = await db["documents"].insert_one(doc_data)
        document_id = str(result.inserted_id)

        # Process chunks and store in Qdrant
        chunk_count = process_and_store(
            user_id=str(current_user.id),
            document_id=document_id,
            text=full_text,
        )

        # Update chunk count in MongoDB
        await db["documents"].update_one(
            {"_id": result.inserted_id},
            {"$set": {"chunk_count": chunk_count}},
        )

        return ProcessResponse(
            document_id=document_id,
            summary=summary,
            chunk_count=chunk_count,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"PDF processing failed: {e}")
        raise HTTPException(status_code=500, detail=f"PDF processing failed: {str(e)}")


@router.post("/qa", response_model=QAResponse)
async def pdf_qa(
    query: str = Form(...),
    document_id: str = Form(...),
    current_user: UserOut = Depends(get_current_user),
):
    """Ask a question about a specific PDF document."""
    try:
        # Verify document ownership
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
        logger.error(f"PDF QA failed: {e}")
        raise HTTPException(status_code=500, detail=f"QA failed: {str(e)}")
