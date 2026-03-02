from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from app.core.config import settings
from app.core.database import get_database
from app.schemas.user import UserOut, UserInDB
from bson import ObjectId

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)

async def get_current_user(
    token: str = Depends(reusable_oauth2)
) -> UserOut:
    try:
        payload = jwt.decode(
            token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
        )
        token_data = payload.get("sub")
        if token_data is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Could not validate credentials",
            )
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    
    db = await get_database()
    user = await db["users"].find_one({"_id": ObjectId(token_data)})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return UserOut(**user)
