from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "EduAI Pro"
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "eduai_pro"
    JWT_SECRET: str = "super_secret_key_change_me_in_production"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080

    # HuggingFace (for LLM inference)
    HUGGINGFACEHUB_API_TOKEN: Optional[str] = None

    # Qdrant
    QDRANT_DB_PATH: Optional[str] = "./qdrant_db"
    QDRANT_URL: Optional[str] = None
    QDRANT_API_KEY: Optional[str] = None

    # RAG
    SIMILARITY_THRESHOLD: float = 0.40

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="allow",
        case_sensitive=False
    )

settings = Settings()
