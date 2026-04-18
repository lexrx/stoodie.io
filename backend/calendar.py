from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models import Event
from schemas import EventCreate, EventOut
from deps import get_database, get_current_user
from typing import List

router = APIRouter()

@router.get("/events", response_model=List[EventOut])
def get_events(database: Session = Depends(get_database), user_id: int = Depends(get_current_user)):
    return database.query(Event).filter(Event.user_id == user_id).all()

@router.post("/events", response_model=EventOut)
def add_event(event: EventCreate, database: Session = Depends(get_database), user_id: int = Depends(get_current_user)):
    new_event = Event(user_id=user_id, title=event.title, date=event.date)
    database.add(new_event)
    database.commit()
    database.refresh(new_event)
    return new_event

@router.delete("/events/{event_id}")
def delete_event(event_id: int, database: Session = Depends(get_database), user_id: int = Depends(get_current_user)):
    event = database.query(Event).filter(Event.id == event_id, Event.user_id == user_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    database.delete(event)
    database.commit()
    return {"message": "Event deleted"}

@router.put("/events/{event_id}", response_model=EventOut)
def update_event(event_id: int, updated: EventCreate, database: Session = Depends(get_database), user_id: int = Depends(get_current_user)):
    event = database.query(Event).filter(Event.id == event_id, Event.user_id == user_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    event.title = updated.title
    event.date = updated.date
    database.commit()
    database.refresh(event)
    return event
