from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import User, Profile
from schemas import UserCreate, TokenResponse
from deps import get_database, hash_password, verify_password, create_token

router = APIRouter()

@router.post("/register")
def register(user: UserCreate, database: Session = Depends(get_database)):
    # Check if username already exists
    existing_user = database.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Create new user with hashed password
    new_user = User(username=user.username, password=hash_password(user.password))
    database.add(new_user)
    database.commit()
    database.refresh(new_user)

    # Create blank profile for user
    new_profile = Profile(
        user_id=new_user.id,
        full_name="",
        email="",
        bio="",
        savings_goal=0.0,
        savings_amount=0.0
    )
    database.add(new_profile)
    database.commit()

    return {"success": True, "message": "User created"}

@router.post("/login", response_model=TokenResponse)
def login(user: UserCreate, database: Session = Depends(get_database)):
    # Find user by username
    existing_user = database.query(User).filter(User.username == user.username).first()

    # Verify password against stored hash
    if not existing_user or not verify_password(user.password, existing_user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Issue a JWT token
    token = create_token({"sub": str(existing_user.id), "username": existing_user.username})
    return {"access_token": token, "token_type": "bearer", "user_id": existing_user.id, "username": existing_user.username}
