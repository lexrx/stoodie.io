from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

notes = [] #temp storage as a list

#making sure there is a title and content
class Notes(BaseModel):
    title: str 
    content: str 

#Testing to see if backend is working
@app.get("/")
def home():
    return {"message": "Backend works"}

@app.get("/notes")
def get_notes(): #returning all notes
    return notes

@app.post("/notes") #adds a note
def add_notes(note: Note):
    notes.append(note)
    return {"message": "Note has been added"} #added a message so it is easier to see when testing


