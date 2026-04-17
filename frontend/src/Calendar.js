import "./Calendar.css"
import axios from "axios";
import React, {useState, useEffect} from "react";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css"

function MyCalendar(){
    //storing all events from database
    const [events, setEvents] = useState([]);

    //storing input values
    const[title, setTitle] = useState("");
    const[date, setDate] = useState(new Date());

    //storing id of event being edited
    const[editingId, setEditingId] = useState(null);

    //getting events from backend
    const getEvents= () =>{
        axios.get("http://localhost:8000/events")
            .then(res => setEvents(res.data))
            .catch(err=>console.log(err));
    };

    //run when page loads
    useEffect(() => {
        getEvents();
    }, []);

    //safe date that handles edge cases, mkaes sure date is always a single date object
    const safeDate = Array.isArray(date) ? date[0] : date;

    const formatDate = (date) =>{
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() +1).padStart(2,"0");
        const day = String(d.getDate()).padStart(2,"0");

        return `${year}-${month}-${day}`;
    };

    //getting today's date
    const today = new Date();
    
    //getting date 7 days from now
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate()+7);

    //filter events within next 7 days
    const upcomingEvents = events
        .filter(event =>{
            const eventDate = new Date(event.date);
            eventDate.setHours(0,0,0,0);

            return eventDate >= today && eventDate <= nextWeek;
        })
        .sort((a,b)=> new Date(a.date) - new Date(b.date));

    const getDaysAway = (date) => {
        const today = new Date();
        const eventDate = new Date(date);

        //removing time
        today.setHours(0,0,0,0);
        eventDate.setHours(0,0,0,0);

        const diffTime = eventDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if(diffDays === 0) return "Today";
        if(diffDays === 1) return "Tomorrow";
        return `In ${diffDays} days`;
    };
        

    //adding an event
    const addEvent = () =>{
        if (!title.trim()){
            alert("Enter event title");
            return;
        }

        axios.post("http://localhost:8000/events",{
            title: title,
            date: formatDate(safeDate)
        }).then(()=>{
            getEvents();
            setTitle("");
        })
        .catch(() =>alert("Error adding event"));
    };

    //deleting an event
    const deleteEvent = (id) =>{
        axios.delete(`http://localhost:8000/events/${id}`)
            .then(() => {getEvents();

            })
            .catch(err=>{
                console.log(err);
                alert("Delete Failed")
            });
    };

    //start editing event
    const startEdit = (event) =>{
        setEditingId(event.id);
        setTitle(event.title);
    };

    //updating event
    const updateEvent = () => {
        axios.put(`http://localhost:8000/events/${editingId}`,{
            title: title,
            date: formatDate(safeDate)
        }).then(() => {
            setEditingId(null);
            setTitle("");
            getEvents();
        })
        .catch(()=> alert("Error updating event"));
    };

    //filtering events for a selected date
    const selectedEvents = events.filter(
        event => event.date === formatDate(safeDate));

    
    return(
        <div className="calendar-container">
            <div className="calendar-card">

                <h2>📅 Calendar</h2>

                <ReactCalendar
                    onChange={setDate}
                    value={date}
                    tileContent={({date,view}) =>{
                        if(view ==="month"){
                            const formatted = formatDate(date);
                            const hasEvent = events.some(
                                event=>event.date === formatted
                            );

                            return hasEvent ? <div className="dot"></div> : null;
                        }
                    }} 
                />

                <div className="event-input">
                    <input
                        type="text"
                        placeholder="Event title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    {editingId ?(
                        <button onClick={updateEvent}>Update Event</button>

                    ):(
                        <button onClick={addEvent}>Add Event</button>
                    )}
                </div>

                <div className="event-list">
                    <h3>Events on {safeDate.toDateString()}</h3>

                    {selectedEvents.length === 0 ? (
                        <p>No events for this day</p>
                    ) : (
                        selectedEvents.map(event => (
                            <div key={event.id} className="event">
                                <span>{event.title}</span>
                                <button onClick={() => startEdit(event)}>Edit</button>
                                <button onClick={() => deleteEvent(event.id)}>Delete</button>
                            </div>
                        ))
                    )}
                </div>

            </div>
            <div className ="upcoming-card">
                <h3>📌 Upcoming Events </h3>  
                {upcomingEvents.length === 0 ? (
                    <p>No upcoming events</p>
                ):(
                    upcomingEvents.map(event=>(
                        <div key={event.id} className="upcoming-item">
                            <p><strong>{event.title}</strong></p>
                            <small>{event.date}  • {getDaysAway(event.date)}</small>
                        </div>
                    ))
                )}
            </div>
        </div>
  );
}
export default MyCalendar;