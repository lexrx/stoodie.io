from database import SessionLocal

def get_database(): #class to get database session
    database = SessionLocal()
    try:
        yield database
    finally: 
        database.close()