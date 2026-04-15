from fastapi import FastAPI, Depends
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
from fastapi.middleware.cors import CORSMiddleware
from models import Note, User

Base.metadata.create_all(bind=engine) #creating tables


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_database(): #class to get database session
    database = SessionLocal()
    try:
        yield database
    finally: 
        database.close()
#notes = [] #temp storage as a list
class UserCreate(BaseModel):
    username: str
    password: str

#making sure there is a title and content
class NoteCreate(BaseModel):
    title: str = Field(min_length=1)
    content: str = Field(min_length=1)

@app.post("/register")
def register(user: UserCreate, database: Session = Depends(get_database)):
    new_user = User(username=user.username, password=user.password)
    database.add(new_user)
    database.commit()
    return{"message":"User has been created"}

@app.post("/login")
def login(user: UserCreate, database: Session=Depends(get_database)):
    existing_user = database.query(User).filter(User.username == user.username).first()

    if existing_user and existing_user.password == user.password:
        return{"success": True}
    return{"success": False}
#Testing to see if backend is working
@app.get("/")
def home():
    return {"message": "Backend works"}

@app.get("/notes")
def get_notes(database: Session = Depends(get_database)): #now gets notes from database
    return database.query(Note).all()

@app.post("/notes") #adds a note
def add_notes(note: NoteCreate, database: Session = Depends(get_database)):
    new_note = Note(title=note.title, content=note.content)
    database.add(new_note)
    database.commit()
    database.refresh(new_note)
    return new_note

@app.delete("/notes/{note_id}")#function for deleting a note
def delete_note(note_id: int, database: Session = Depends(get_database)):
    note = database.query(Note).filter(Note.id == note_id).first()
    if note:
        database.delete(note)
        database.commit()
        return{"Note Deleted"}
    return{"Error"}




