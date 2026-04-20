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

    const [error, setError] = useState("");


    //getting events from backend
    const getEvents = () => {
        axios.get("https://stoodie-backend.onrender.com/events", { headers: authHeader() })
            .then(res => setEvents(res.data))
            .catch(err => {
                if (err.response?.status === 401) setError("Session expired — please log in again.");
            });
    };

    //run when page loads
    useEffect(() => {getEvents();}, []);

    //safe date that handles edge cases, mkaes sure date is always a single date object
    const safeDate = Array.isArray(date) ? date[0] : date;

    const formatDate = (d) => {
        const date = new Date(d);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    }; 
 
    const upcomingEvents = events
        .filter(event => {
            const d = new Date(event.date); d.setHours(0, 0, 0, 0);
            const t = new Date(); t.setHours(0, 0, 0, 0);
            const nw = new Date(); nw.setDate(nw.getDate() + 7); nw.setHours(0, 0, 0, 0);
            return d >= t && d <= nw;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
 
    const getDaysAway = (dateStr) => {
        const t = new Date(); t.setHours(0, 0, 0, 0);
        const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
        const days = Math.ceil((d - t) / 86400000);
        if (days === 0) return "Today";
        if (days === 1) return "Tomorrow";
        return `${days}d`;
    };
 
    const addEvent = () => {
        if (!title.trim()) { setError("Please enter an event title"); return; }
        setError("");
        axios.post("https://stoodie-backend.onrender.com/events", { title, date: formatDate(safeDate) }, { headers: authHeader() })
            .then(() => { getEvents(); setTitle(""); })
            .catch(() => setError("Failed to add event."));
    };
 
    const deleteEvent = (id) => {
        axios.delete(`https://stoodie-backend.onrender.com/events/${id}`, { headers: authHeader() })
            .then(() => getEvents())
            .catch(() => setError("Failed to delete."));
    };
 
    const startEdit = (event) => { setEditingId(event.id); setTitle(event.title); };
    const cancelEdit = () => { setEditingId(null); setTitle(""); };
 
    const updateEvent = () => {
        axios.put(`https://stoodie-backend.onrender.com/events/${editingId}`, { title, date: formatDate(safeDate) }, { headers: authHeader() })
            .then(() => { setEditingId(null); setTitle(""); getEvents(); })
            .catch(() => setError("Failed to update."));
    };
 
    const selectedEvents = events.filter(e => e.date === formatDate(safeDate));
 
    return (
        <div className="cal-page">
            <div className="cal-layout">
 
                <div className="cal-left">
                    <div className="cal-header">
                        <h1 className="cal-title">Calendar</h1>
                    </div>
 
                    <div className="cal-widget-wrap">
                        <ReactCalendar
                            onChange={setDate}
                            value={date}
                            tileContent={({ date, view }) => {
                                if (view === "month") {
                                    const count = events.filter(e => e.date === formatDate(date)).length;
                                    if (!count) return null;
                                    return <div className="cal-dot-row">{[...Array(Math.min(count, 3))].map((_, i) => <span key={i} className="cal-dot" />)}</div>;
                                }
                            }}
                        />
                    </div>
 
                    <div className="cal-form">
                        <p className="cal-selected-label">
                            {editingId ? "Editing — " : ""}<strong>{safeDate.toDateString()}</strong>
                        </p>
                        <div className="cal-input-row">
                            <input
                                className="cal-input"
                                placeholder="Event title..."
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && (editingId ? updateEvent() : addEvent())}
                            />
                            <button className="cal-btn-add" onClick={editingId ? updateEvent : addEvent}>
                                {editingId ? "Update" : "Add"}
                            </button>
                            {editingId && <button className="cal-btn-cancel" onClick={cancelEdit}>✕</button>}
                        </div>
                        {error && <p className="cal-error">{error}</p>}
                    </div>
 
                    <div className="cal-day-events">
                        {selectedEvents.length === 0 ? (
                            <p className="cal-empty">No events on this day</p>
                        ) : (
                            selectedEvents.map(event => (
                                <div key={event.id} className="cal-event-row">
                                    <span className="cal-event-pip" />
                                    <span className="cal-event-name">{event.title}</span>
                                    <div className="cal-event-btns">
                                        <button onClick={() => startEdit(event)}>Edit</button>
                                        <button className="cal-delete-btn" onClick={() => deleteEvent(event.id)}>Delete</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
 
                <div className="cal-right">
                    <div className="cal-stats-row">
                        <div className="cal-stat-card">
                            <span className="cal-stat-num">{events.length}</span>
                            <span className="cal-stat-label">Total</span>
                        </div>
                        <div className="cal-stat-card">
                            <span className="cal-stat-num">{upcomingEvents.length}</span>
                            <span className="cal-stat-label">This week</span>
                        </div>
                    </div>
 
                    <h2 className="cal-upcoming-title">Upcoming</h2>
                    <p className="cal-upcoming-sub">Next 7 days</p>
 
                    {upcomingEvents.length === 0 ? (
                        <p className="cal-empty">Nothing coming up</p>
                    ) : (
                        <div className="cal-upcoming-list">
                            {upcomingEvents.map(event => (
                                <div key={event.id} className="cal-upcoming-item">
                                    <div className="cal-upcoming-badge">{getDaysAway(event.date)}</div>
                                    <div className="cal-upcoming-info">
                                        <strong>{event.title}</strong>
                                        <span>{new Date(event.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
 
export default MyCalendar;