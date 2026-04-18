from pydantic import BaseModel, Field

#notes = [] #temp storage as a list
class UserCreate(BaseModel):
    username: str
    password: str

#making sure there is a title and content
class NoteCreate(BaseModel):
    title: str = Field(min_length=1)
    content: str = Field(min_length=1)

class EventCreate(BaseModel):
    title: str
    date: str

class SongCreate(BaseModel):
    title: str
    url: str

class ProfileCreate(BaseModel):
    full_name:str
    email:str
    bio:str
    savings_goal:str
    savings_amount:str