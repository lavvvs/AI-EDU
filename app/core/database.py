from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def get_database():
    if db.client is None:
        db.client = AsyncIOMotorClient(settings.MONGODB_URI)
    return db.client[settings.DATABASE_NAME]

async def close_database():
    if db.client:
        db.client.close()
