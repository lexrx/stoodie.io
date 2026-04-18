from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Profile
from schemas import ProfileCreate, ProfileOut
from deps import get_database, get_current_user

router = APIRouter()

@router.get("/profile/{user_id}", response_model=ProfileOut)
def get_profile(user_id: int, database: Session = Depends(get_database), current_user: int = Depends(get_current_user)):
    if user_id != current_user:
        raise HTTPException(status_code=403, detail="Not allowed to view another user's profile")
    profile = database.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("/profile/{user_id}", response_model=ProfileOut)
def update_profile(user_id: int, updated_profile: ProfileCreate, database: Session = Depends(get_database), current_user: int = Depends(get_current_user)):
    if user_id != current_user:
        raise HTTPException(status_code=403, detail="Not allowed to edit another user's profile")
    profile = database.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Update fields (typo fixed: was update_profile.bio / update_profile.savings_amount)
    profile.full_name = updated_profile.full_name
    profile.email = updated_profile.email
    profile.bio = updated_profile.bio
    profile.savings_goal = updated_profile.savings_goal
    profile.savings_amount = updated_profile.savings_amount

    database.commit()
    database.refresh(profile)
    return profile

