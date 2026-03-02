from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.llm_service import generate_teacher_answer

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def teacher_chat(request: ChatRequest):
    if not request.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    try:
        response = generate_teacher_answer(request.message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
