from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password
from app.core.database import get_database
from app.schemas.user import UserCreate, UserOut, UserInDB
from app.api.deps import get_current_user
from bson import ObjectId

router = APIRouter()

from datetime import datetime

@router.post("/register", response_model=UserOut)
async def register(user_in: UserCreate):
    try:
        db = await get_database()
        user = await db["users"].find_one({"email": user_in.email})
        if user:
            raise HTTPException(
                status_code=400,
                detail="The user with this email already exists in the system.",
            )
        
        user_dict = user_in.model_dump()
        password = str(user_dict.pop("password", ""))
        if not password:
             raise HTTPException(status_code=400, detail="Password is required")
             
        user_dict["hashed_password"] = get_password_hash(password)
        user_dict["created_at"] = datetime.utcnow()
        
        result = await db["users"].insert_one(user_dict)
        user_dict["_id"] = result.inserted_id
        
        return UserOut(**user_dict)
    except Exception as e:
        print(f"Registration error: {str(e)}")
        # Check if it's a MongoDB connection issue
        if "connection" in str(e).lower() or "timeout" in str(e).lower():
            raise HTTPException(
                status_code=503,
                detail="Database connection failed. Please check your MongoDB Atlas configuration."
            )
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred during registration: {str(e)}"
        )

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db = await get_database()
    user = await db["users"].find_one({"email": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": create_access_token(
            user["_id"], expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.get("/me", response_model=UserOut)
async def read_users_me(current_user: UserOut = Depends(get_current_user)):
    return current_user
