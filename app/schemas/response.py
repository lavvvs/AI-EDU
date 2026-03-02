from pydantic import BaseModel, Field
from typing import List, Optional


class SourceChunk(BaseModel):
    chunk: str
    score: float


class QAResponse(BaseModel):
    answer: str
    confidence: float
    sources: List[SourceChunk] = []


class ProcessResponse(BaseModel):
    document_id: str
    summary: str
    chunk_count: int


class VoiceProcessResponse(BaseModel):
    document_id: str
    transcription: str
    summary: str
