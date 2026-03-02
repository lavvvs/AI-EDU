import os
import logging
from dotenv import load_dotenv

# Load environment variables FIRST
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import db
from app.api.endpoints import pdf, auth, documents, youtube, website, voice, teacher

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(title=settings.PROJECT_NAME)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ai-edu-assistant-livid.vercel.app",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(documents.router, prefix="/documents", tags=["Documents"])
app.include_router(pdf.router, prefix="/pdf", tags=["PDF"])
app.include_router(youtube.router, prefix="/youtube", tags=["YouTube"])
app.include_router(website.router, prefix="/website", tags=["Website"])
app.include_router(voice.router, prefix="/voice", tags=["Voice"])
app.include_router(teacher.router, prefix="/teacher", tags=["Teacher"])


@app.on_event("startup")
async def startup_db_client():
    from motor.motor_asyncio import AsyncIOMotorClient
    logger.info("Connecting to MongoDB Atlas...")
    db.client = AsyncIOMotorClient(settings.MONGODB_URI)
    logger.info("MongoDB connected")


@app.on_event("shutdown")
async def shutdown_db_client():
    if db.client:
        db.client.close()
        logger.info("MongoDB disconnected")


@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API", "status": "operational"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": settings.PROJECT_NAME}


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "type": exc.__class__.__name__},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        },
    )
