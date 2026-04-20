from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import auth
import notes
import events
import pomodoro
import profile

Base.metadata.create_all(bind=engine) #creating tables


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Testing to see if backend is working
@app.get("/")
def home():
    return {"message": "Backend works"}

app.include_router(auth.router)
app.include_router(notes.router)
app.include_router(events.router)
app.include_router(pomodoro.router)
app.include_router(profile.router)



    




