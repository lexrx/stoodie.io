from sqlalchemy import Column, Integer, String
from database import Base

#User table
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    password = Column(String)

#Note table
class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(String)

#Event table storing calendar data
class Event(Base):
    __tablename__ = "events" 
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    date = Column(String)
