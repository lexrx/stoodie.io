import { useEffect, useState } from "react";
import axios from "axios";
import MusicPlayer from "./MusicPlayer";

function MusicQueue() {
    const [queue, setQueue] = useState([]);
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    async function fetchQueue() {
        try {
            const response = await axios.get("http://localhost:8000/queue");
            console.log("QUEUE DATA:", response.data);
            setQueue(response.data);
        } catch (error) {
            console.error("Error fetching queue:", error);
        }
    }

    useEffect(() => {
        fetchQueue();
    }, []);

    async function addSong() {
        if (!title || !url) {
            alert("Please enter both title and URL");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8000/queue", {
                title,
                url
            });

            console.log("Added song:", response.data);

            setTitle("");
            setUrl("");
            fetchQueue();
        } catch (error) {
            console.error("Error adding song:", error);

            if(error.response){
                console.error("Backend response:", error.response.data);
                alert("Add failed: "+JSON.stringify(error.response.data));
            }else{
                alert("Add failed. Check backend is running");
            }
        }
    }

    async function deleteSong(songId, indexToDelete) {
        try {
            await axios.delete(`http://localhost:8000/queue/${songId}`);

            const updatedQueue = queue.filter((song) => song.id !== songId);
            setQueue(updatedQueue);

            if (updatedQueue.length === 0) {
                setCurrentIndex(0);
            } else if (indexToDelete < currentIndex) {
                setCurrentIndex((prev) => prev - 1);
            } else if (indexToDelete === currentIndex) {
                setCurrentIndex(0);
            }
        } catch (error) {
            console.error("Error deleting song:", error);
        }
    }

    function nextSong() {
        if (queue.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % queue.length);
    }

    function previousSong() {
        if (queue.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + queue.length) % queue.length);
    }

    function selectSong(index) {
        setCurrentIndex(index);
    }

    const currentSong = queue.length > 0 ? queue[currentIndex] : null;

    return (
        <div className="music-layout">
            <div className="queue-card">
                <h2>🎵 Music Player</h2>

                <MusicPlayer currentSong={currentSong} onNext={nextSong} />

                <div className="player-controls">
                    <button onClick={previousSong} disabled={queue.length === 0}>
                        ⏮ Previous
                    </button>
                    <button onClick={nextSong} disabled={queue.length === 0}>
                        Next ⏭
                    </button>
                </div>

                <div className="add-song-form">
                    <input
                        type="text"
                        placeholder="Song title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Paste YouTube or Spotify link"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />

                    <button onClick={addSong}>Add to Queue</button>
                </div>
            </div>

            <div className="queue-sidebar">
                <h2>Queue</h2>

                {queue.length === 0 ? (
                    <p className="empty-queue">Your queue is empty.</p>
                ) : (
                    <ul className="queue-list">
                        {queue.map((song, index) => (
                            <li
                                key={song.id}
                                className={`queue-item ${index === currentIndex ? "active-song" : ""}`}
                            >
                                <div className="queue-song-info">
                                    <strong>{song.title}</strong>
                                    <p className="song-platform">
                                        {song.platform || "unknown"}
                                    </p>
                                </div>

                                <div className="queue-song-actions">
                                    <button onClick={() => selectSong(index)}>
                                        Play
                                    </button>
                                    <button onClick={() => deleteSong(song.id, index)}>
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default MusicQueue;