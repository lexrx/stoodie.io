import { useEffect, useState } from "react";
import axios from "axios";

function MusicQueue(){
    //stores all songs from backend
    const[queue, setQueue] = useState([]);
    //input for song title
    const[title,setTitle] = useState("");
    //input for song url
    const[url,setUrl] = useState("");

    //get all songs from backend
    async function fetchQueue() {
        try{
            const response = await axios.get("http://localhost:8000/queue");
            setQueue(response.data);
        } catch (error){
            console.error("Error fetching queue:", error);
        }
        
    }

    //load queue when page opens
    useEffect(() =>{
        fetchQueue();
    }, []);

    //add a song to the backend
    async function addSong(){
        if(!title || !url) return;
        try{
            await axios("http://localhost:8000/queue", {
                title:title,
                url:url
            });

            setTitle("");
            setUrl("");
            fetchQueue();
        } catch (error){
            console.error("Error adding song:", error);
        }
    }

    //delete song from backend
    async function deleteSong(songId){
        try{
            await axios.delete(`http://localhost:8000/queue/${songId}`);
            fetchQueue();
        } catch(error){
            console.error("Error deleting song:", error);
        }
    }

    return(
        <div className="queue-card">
            <h2> 🎵 Music Queue </h2>
            <input 
                type="text"
                placeholder="Song Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <input
                type="text"
                placeholder="Song URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
            />

            <button onClick={addSong}>Add Song</button>
            <ul className="queue-list">
                {queue.map((song) => (
                    <li key={song.id} className="queue-time">
                        <span>{song.title}</span>
                        <div>
                            <a
                                href={song.url}
                                target="_blank"
                                rel="noreferrer"
                                className="play-link"
                            >
                                ▶
                            </a>
                            <button onClick={() => deleteSong(song.id)}>❌</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MusicQueue;