from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import User
from schemas import UserCreate
from deps import get_database

router = APIRouter()

@router.post("/register")
def register(user: UserCreate, database: Session = Depends(get_database)):
    existing_user = database.query(User).filter(User.username == user.username).first()
    if existing_user:
        return {"success": False, "message":"Username already exists"}
    new_user = User(username=user.username, password=user.password)
    database.add(new_user)
    database.commit()
    return{"success":True, "message":"User has been created"}

@router.post("/login")
def login(user: UserCreate, database: Session=Depends(get_database)):
    existing_user = database.query(User).filter(User.username == user.username).first()

    if existing_user and existing_user.password == user.password:
        return{"success": True}
    return{"success": False}
