from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import Event
from schemas import EventCreate
from deps import get_database

router = APIRouter()

@router.get("/events")
def get_events(database: Session = Depends(get_database)):
    return database.query(Event).all()

#adding an event to calendar
@router.post("/events")
def add_event(event: EventCreate, database: Session = Depends(get_database)):
    new_event = Event(title=event.title, date=event.date) #creating new event object 
    #adding to database
    database.add(new_event)
    database.commit()
    database.refresh(new_event)

    return new_event

#deleting an event in calendar
@router.delete("/events/{event_id}")
def delete_event(event_id: int, database: Session = Depends(get_database)):
    #finding event by id
    event = database.query(Event).filter(Event.id == event_id).first()

    if not event:
        return{"error": "Event not found"}
    database.delete(event);
    database.commit()

    return{"message":"Event"}

@router.put("/events/{event_id}")
def update_event(event_id: int, updated: EventCreate, database: Session = Depends(get_database)):
    #finding event by id
    event = database.query(Event).filter(Event.id == event_id).first()
    if event:
        event.title = updated.title
        event.date = updated.date

        database.commit()
        return event
    return{"error":"Event not found"}
