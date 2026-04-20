from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Note
from schemas import NoteCreate, NoteOut
from deps import get_database, get_current_user
from typing import List

router = APIRouter()

@router.get("/notes", response_model=List[NoteOut])
def get_notes(database: Session = Depends(get_database), user_id: int = Depends(get_current_user)):
    return database.query(Note).filter(Note.user_id == user_id).all()

@router.post("/notes", response_model=NoteOut)
def add_note(note: NoteCreate, database: Session = Depends(get_database), user_id: int = Depends(get_current_user)):
    new_note = Note(user_id=user_id, title=note.title, content=note.content)
    database.add(new_note)
    database.commit()
    database.refresh(new_note)
    return new_note

@router.delete("/notes/{note_id}")
def delete_note(note_id: int, database: Session = Depends(get_database), user_id: int = Depends(get_current_user)):
    note = database.query(Note).filter(Note.id == note_id, Note.user_id == user_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    database.delete(note)
    database.commit()
    return {"message": "Note deleted"}

@router.put("/notes/{note_id}", response_model=NoteOut)
def update_note(note_id: int, note: NoteCreate, database: Session = Depends(get_database), user_id: int = Depends(get_current_user)):
    existing = database.query(Note).filter(Note.id == note_id, Note.user_id == user_id).first()
    if not existing:
        raise HTTPException(status_code=404, detail="Note not found")
    existing.title = note.title
    existing.content = note.content
    database.commit()
    database.refresh(existing)
    return existing
