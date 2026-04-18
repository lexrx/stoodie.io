from sqlalchemy import Column, Integer, String, ForeignKey, Float
from database import Base

# User table
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    password = Column(String)

# Note table — linked to a user
class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String)
    content = Column(String)

# Event table — linked to a user
class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String)
    date = Column(String)

# Table for storing songs in the queue
class QueueSong(Base):
    __tablename__ = "queue_songs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String)
    url = Column(String)
    platform = Column(String)
    media_id = Column(String)

class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True, index=True)

    # Links this profile to a user
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)

    # Profile fields
    full_name = Column(String, default="")
    email = Column(String, default="")
    bio = Column(String, default="")
    savings_goal = Column(Float, default=0.0)
    savings_amount = Column(Float, default=0.0)