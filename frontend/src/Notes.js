import './Notes.css';
import { useState, useEffect } from "react";
import axios from "axios";

function authHeader() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

function Notes() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState("");

    const getNotes = () => {
        axios.get("https://stoodie-backend.onrender.com/notes", { headers: authHeader() })
            .then(res => setNotes(res.data))
            .catch(err => {
                if (err.response?.status === 401) setError("Session expired — please log in again.");
            });
    };

    useEffect(() => {
        getNotes();
    }, []);

    const addNote = () => {
        if (!title.trim() || !content.trim()) {
            setError("Please enter both a title and content");
            return;
        }
        setError("");
        axios.post("https://stoodie-backend.onrender.com/notes", { title, content }, { headers: authHeader() })
            .then(() => {
                getNotes();
                setTitle("");
                setContent("");
            })
            .catch(() => setError("Failed to add note. Please try again."));
    };

    const deleteNote = (id) => {
        axios.delete(`https://stoodie-backend.onrender.com/notes/${id}`, { headers: authHeader() })
            .then(() => getNotes())
            .catch(() => setError("Failed to delete note."));
    };

    const startEdit = (note) => {
        setEditingId(note.id);
        setTitle(note.title);
        setContent(note.content);
    };
 
    const cancelEdit = () => {
        setEditingId(null);
        setTitle("");
        setContent("");
        setError("");
    };
 
    const saveEdit = () => {
        if (!title.trim() || !content.trim()) {
            setError("Please enter both a title and content");
            return;
        }
        setError("");
        axios.put(`${API}/notes/${editingId}`, { title, content }, { headers: authHeader() })
            .then(() => {
                getNotes();
                setEditingId(null);
                setTitle("");
                setContent("");
            })
            .catch(() => setError("Failed to update note. Please try again."));
    };
        


    return (
        <div className="notes-page">
            <div className="notes-container">
                <div className="notes-form-card">
                    <h1>Study Notes</h1>

                    <input
                        className="notes-input"
                        placeholder="Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <textarea
                        className="notes-textarea"
                        placeholder="Write your note..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                    {error && <p className="notes-error">{error}</p>}
                    <button className="notes-add-btn" onClick={addNote}>Add Note</button>
                </div>

                <div className="notes-grid">
                    {notes.length === 0 && (
                        <p className="notes-empty">No notes yet — add one above!</p>
                    )}
                    {notes.map((note) => (
                        <div key={note.id} className="note-card">
                            <div className="note-card-body">
                                <h3>{note.title}</h3>
                                <p>{note.content}</p>
                            </div>
                            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                <button className="note-edit-btn" onClick={() => startEdit(note)}>Edit</button>
                                <button className="note-delete-btn" onClick={() => deleteNote(note.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Notes;
