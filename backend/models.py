from sqlalchemy import Column, Interger, String
from database import Base

class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primaru_key=True, index=True)
    title = Column(String)
    content = Column(String)