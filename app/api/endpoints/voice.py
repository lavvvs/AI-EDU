import logging
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from app.core.database import get_database
from app.api.deps import get_current_user
from app.schemas.user import UserOut
from app.schemas.response import VoiceProcessResponse
from app.services.transcription_service import transcribe_upload
from app.services.llm_service import generate_summary
from datetime import datetime
from bson import ObjectId

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/process", response_model=VoiceProcessResponse)
async def process_voice(
    file: UploadFile = File(...),
    current_user: UserOut = Depends(get_current_user),
):
    """Transcribe uploaded audio using faster-whisper and store result."""
    try:
        # Read uploaded file
        file_content = await file.read()
        if not file_content:
            raise HTTPException(status_code=400, detail="Empty audio file")

        # Transcribe using faster-whisper
        transcription = await transcribe_upload(file_content, file.filename or "audio.webm")

        if not transcription.strip():
            raise HTTPException(status_code=400, detail="Could not transcribe audio. Ensure clear speech.")

        # Generate summary
        summary = generate_summary(transcription)

        # Store in MongoDB
        db = await get_database()
        doc_data = {
            "user_id": ObjectId(current_user.id),
            "title": f"Voice Note: {file.filename}",
            "type": "voice",
            "summary": summary,
            "transcription": transcription,
            "created_at": datetime.utcnow(),
        }
        result = await db["documents"].insert_one(doc_data)
        document_id = str(result.inserted_id)

        return VoiceProcessResponse(
            document_id=document_id,
            transcription=transcription,
            summary=summary,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Voice processing failed: {e}")
        raise HTTPException(status_code=500, detail=f"Voice processing failed: {str(e)}")
