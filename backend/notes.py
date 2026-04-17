from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import Note
from schemas import NoteCreate
from deps import get_database

router = APIRouter()

@router.get("/notes")
def get_notes(database: Session = Depends(get_database)): #now gets notes from database
    return database.query(Note).all()

@router.post("/notes") #adds a note
def add_notes(note: NoteCreate, database: Session = Depends(get_database)):
    new_note = Note(title=note.title, content=note.content)
    database.add(new_note)
    database.commit()
    database.refresh(new_note)
    return new_note

@router.delete("/notes/{note_id}")#function for deleting a note
def delete_note(note_id: int, database: Session = Depends(get_database)):
    note = database.query(Note).filter(Note.id == note_id).first()
    if note:
        database.delete(note)
        database.commit()
        return{"Note Deleted"}
    return{"Error"}