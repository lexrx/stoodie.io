import "./Calendar.css"
import axios from "axios";
import React, {useState, useEffect} from "react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css"

function authHeader() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

function MyCalendar(){
    //storing all events from database
    const [events, setEvents] = useState([]);

    //storing input values
    const[title, setTitle] = useState("");
    const[date, setDate] = useState(new Date());

    //storing id of event being edited
    const[editingId, setEditingId] = useState(null);

    //getting events from backend
    const getEvents = () => {
        axios.get("http://localhost:8000/events", { headers: authHeader() })
            .then(res => setEvents(res.data))
            .catch(err => {
                if (err.response?.status === 401) setError("Session expired — please log in again.");
            });
    };

    //run when page loads
    useEffect(() => {
        getEvents();
    }, []);

    //safe date that handles edge cases, mkaes sure date is always a single date object
    const safeDate = Array.isArray(date) ? date[0] : date;

    const formatDate = (d) => {
        const date = new Date(d);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };
 
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
 
    const upcomingEvents = events
        .filter(event => {
            const d = new Date(event.date);
            d.setHours(0, 0, 0, 0);
            const t = new Date();
            t.setHours(0, 0, 0, 0);
            return d >= t && d <= nextWeek;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
 
    const getDaysAway = (dateStr) => {
        const t = new Date(); t.setHours(0, 0, 0, 0);
        const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
        const days = Math.ceil((d - t) / (1000 * 60 * 60 * 24));
        if (days === 0) return "Today";
        if (days === 1) return "Tomorrow";
        return `In ${days} days`;
    };
 
    const addEvent = () => {
        if (!title.trim()) { setError("Please enter an event title"); return; }
        setError("");
        axios.post("http://localhost:8000/events", { title, date: formatDate(safeDate) }, { headers: authHeader() })
            .then(() => { getEvents(); setTitle(""); })
            .catch(() => setError("Failed to add event."));
    };
 
    const deleteEvent = (id) => {
        axios.delete(`http://localhost:8000/events/${id}`, { headers: authHeader() })
            .then(() => getEvents())
            .catch(() => setError("Failed to delete event."));
    };
 
    const startEdit = (event) => {
        setEditingId(event.id);
        setTitle(event.title);
    };
 
    const cancelEdit = () => {
        setEditingId(null);
        setTitle("");
    };
 
    const updateEvent = () => {
        setError("");
        axios.put(`http://localhost:8000/events/${editingId}`, { title, date: formatDate(safeDate) }, { headers: authHeader() })
            .then(() => { setEditingId(null); setTitle(""); getEvents(); })
            .catch(() => setError("Failed to update event."));
    };
 
    const selectedEvents = events.filter(e => e.date === formatDate(safeDate));
 
    return (
        <div className="cal-page">
            <div className="cal-main">
                <h1 className="cal-title">Calendar</h1>
 
                <div className="cal-card">
                    <ReactCalendar
                        onChange={setDate}
                        value={date}
                        tileContent={({ date, view }) => {
                            if (view === "month") {
                                const formatted = formatDate(date);
                                return events.some(e => e.date === formatted)
                                    ? <div className="cal-dot" />
                                    : null;
                            }
                        }}
                    />
                </div>
 
                <div className="cal-input-section">
                    <h2 className="cal-date-heading">{safeDate.toDateString()}</h2>
 
                    <div className="cal-input-row">
                        <input
                            className="cal-input"
                            type="text"
                            placeholder={editingId ? "Edit event title..." : "Add an event..."}
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") editingId ? updateEvent() : addEvent(); }}
                        />
                        <button className="cal-btn cal-btn--primary" onClick={editingId ? updateEvent : addEvent}>
                            {editingId ? "Update" : "Add"}
                        </button>
                        {editingId && (
                            <button className="cal-btn cal-btn--ghost" onClick={cancelEdit}>Cancel</button>
                        )}
                    </div>
 
                    {error && <p className="cal-error">{error}</p>}
 
                    <div className="cal-events">
                        {selectedEvents.length === 0 ? (
                            <p className="cal-empty">No events for this day</p>
                        ) : (
                            selectedEvents.map(event => (
                                <div key={event.id} className="cal-event">
                                    <span className="cal-event-title">{event.title}</span>
                                    <div className="cal-event-actions">
                                        <button onClick={() => startEdit(event)}>Edit</button>
                                        <button onClick={() => deleteEvent(event.id)}>Delete</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
 
            <div className="cal-sidebar">
                <h2 className="cal-sidebar-title">Upcoming</h2>
                {upcomingEvents.length === 0 ? (
                    <p className="cal-empty">No events in the next 7 days</p>
                ) : (
                    upcomingEvents.map(event => (
                        <div key={event.id} className="cal-upcoming-item">
                            <strong>{event.title}</strong>
                            <span>{event.date} · {getDaysAway(event.date)}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
 
export default MyCalendar;