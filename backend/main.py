from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import auth
import notes
import calendar
import pomodoro
import profile

Base.metadata.create_all(bind=engine) #creating tables


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Testing to see if backend is working
@app.get("/")
def home():
    return {"message": "Backend works"}

app.include_router(auth.router)
app.include_router(notes.router)
app.include_router(calendar.router)
app.include_router(pomodoro.router)
app.include_router(profile.router)



    




