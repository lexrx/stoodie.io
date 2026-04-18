from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from urllib.parse import urlparse, parse_qs
from models import QueueSong
from schemas import SongCreate, SongOut
from deps import get_database, get_current_user
from typing import List

router = APIRouter()

def parse_media(url: str):
    # Try YouTube
    if "youtube.com" in url or "youtu.be" in url:
        if "youtu.be" in url:
            video_id = urlparse(url).path.strip("/")
        else:
            query = parse_qs(urlparse(url).query)
            video_id = query.get("v", [None])[0]
        if video_id:
            return {"platform": "youtube", "media_id": video_id}

    # Try Spotify
    if "open.spotify.com" in url:
        path_parts = urlparse(url).path.strip("/").split("/")
        if len(path_parts) >= 2:
            media_type = path_parts[0]
            media_id = path_parts[1].split("?")[0]
            return {"platform": "spotify", "media_id": f"spotify:{media_type}:{media_id}"}

    return {"platform": "unknown", "media_id": ""}

@router.get("/queue", response_model=List[SongOut])
def get_queue(database: Session = Depends(get_database), user_id: int = Depends(get_current_user)):
    return database.query(QueueSong).filter(QueueSong.user_id == user_id).all()

@router.post("/queue", response_model=SongOut)
def add_song(song: SongCreate, database: Session = Depends(get_database), user_id: int = Depends(get_current_user)):
    parsed = parse_media(song.url)
    new_song = QueueSong(
        user_id=user_id,
        title=song.title,
        url=song.url,
        platform=parsed["platform"],
        media_id=parsed["media_id"]
    )
    database.add(new_song)
    database.commit()
    database.refresh(new_song)
    return new_song

@router.delete("/queue/{song_id}")
def delete_song(song_id: int, database: Session = Depends(get_database), user_id: int = Depends(get_current_user)):
    song = database.query(QueueSong).filter(QueueSong.id == song_id, QueueSong.user_id == user_id).first()
    if not song:
        raise HTTPException(status_code=404, detail="Song not found")
    database.delete(song)
    database.commit()
    return {"message": "Song removed"}