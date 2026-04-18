from pydantic import BaseModel, Field
from typing import Optional

class UserCreate(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    username: str

class NoteCreate(BaseModel):
    title: str = Field(min_length=1)
    content: str = Field(min_length=1)

class NoteOut(BaseModel):
    id: int
    user_id: int
    title: str
    content: str
    model_config = {"from_attributes": True}

class EventCreate(BaseModel):
    title: str
    date: str

class EventOut(BaseModel):
    id: int
    user_id: int
    title: str
    date: str
    model_config = {"from_attributes": True}

class SongCreate(BaseModel):
    title: str
    url: str

class SongOut(BaseModel):
    id: int
    user_id: int
    title: str
    url: str
    platform: str
    media_id: str
    model_config = {"from_attributes": True}

class ProfileCreate(BaseModel):
    full_name: str
    email: str
    bio: str
    savings_goal: float
    savings_amount: float

class ProfileOut(BaseModel):
    id: int
    user_id: int
    full_name: str
    email: str
    bio: str
    savings_goal: float
    savings_amount: float
    model_config = {"from_attributes": True}