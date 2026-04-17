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