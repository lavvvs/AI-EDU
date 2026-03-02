from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime
from bson import ObjectId
from app.schemas.user import PyObjectId

class DocumentBase(BaseModel):
    title: str
    type: str # "pdf", "youtube", "website", "voice"
    summary: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class DocumentCreate(DocumentBase):
    user_id: str

class DocumentInDB(DocumentBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: PyObjectId
    content_chunks: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )

class DocumentOut(DocumentBase):
    id: PyObjectId = Field(alias="_id")
    created_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )

class DashboardStats(BaseModel):
    total_documents: int
    ai_insights: int
    study_time: int
    recent_documents: List[DocumentOut]
