from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from app.core.database import get_database
from app.schemas.document import DocumentOut, DashboardStats
from app.schemas.user import UserOut
from app.api.deps import get_current_user
from bson import ObjectId

router = APIRouter()

@router.get("/", response_model=List[DocumentOut])
async def get_documents(
    current_user: UserOut = Depends(get_current_user),
    type: Optional[str] = None
):
    db = await get_database()
    query = {"user_id": ObjectId(current_user.id)}
    if type:
        query["type"] = type
        
    cursor = db["documents"].find(query).sort("created_at", -1)
    documents = await cursor.to_list(length=100)
    return [DocumentOut(**doc) for doc in documents]

@router.get("/recent", response_model=List[DocumentOut])
async def get_recent_documents(current_user: UserOut = Depends(get_current_user)):
    db = await get_database()
    cursor = db["documents"].find({"user_id": ObjectId(current_user.id)}).sort("created_at", -1).limit(5)
    documents = await cursor.to_list(length=5)
    return [DocumentOut(**doc) for doc in documents]

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(current_user: UserOut = Depends(get_current_user)):
    db = await get_database()
    user_id = ObjectId(current_user.id)
    
    total_documents = await db["documents"].count_documents({"user_id": user_id})
    ai_insights = await db["documents"].count_documents({"user_id": user_id, "summary": {"$ne": None}})
    
    # Simple study time calculation (e.g., 10 mins per document uploaded)
    study_time = total_documents * 10 
    
    cursor = db["documents"].find({"user_id": user_id}).sort("created_at", -1).limit(5)
    recent_documents = await cursor.to_list(length=5)
    
    return DashboardStats(
        total_documents=total_documents,
        ai_insights=ai_insights,
        study_time=study_time,
        recent_documents=[DocumentOut(**doc) for doc in recent_documents]
    )

@router.delete("/{id}")
async def delete_document(
    id: str,
    current_user: UserOut = Depends(get_current_user)
):
    db = await get_database()
    result = await db["documents"].delete_one({
        "_id": ObjectId(id),
        "user_id": ObjectId(current_user.id)
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Document not found or access denied")
        
    return {"message": "Document deleted successfully"}
