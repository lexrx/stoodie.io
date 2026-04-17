import "./App.css"
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

    //formatted date for backend comparison
    const formattedDate = safeDate.toISOString().split("T")[0];



    //adding an event
    const addEvent = () =>{
        if (!title.trim()){
            alert("Enter event title");
            return;
        }

        axios.post("http://localhost:8000/events",{
            title: title,
            date: formattedDate
        }).then(()=>{
            getEvents();
            setTitle("");
        })
        .catch(() =>alert("Error adding event"));
    };

    //deleting an event
    const deleteEvent = (id) =>{
        axios.delete(`http://localhost:8000/events/${id}`)
            .then(() => getEvents())
            .catch(()=>alert("Error deleting event"));
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
            date: formattedDate
        }).then(() => {
            setEditingId(null);
            setTitle("");
            getEvents();
        })
        .catch(()=> alert("Error updating event"));
    };

    //filtering events for a selected date
    const selectedEvents = events.filter(
        event => event.date === formattedDate);

    return(
        <div className="calendar-container">
            <div className="calendar-card">

                <h2>📅 Calendar</h2>

                <ReactCalendar
                    onChange={setDate}
                    value={date}
                    tileContent={({date,view}) =>{
                        if(view ==="month"){
                            const formatted = date.toLocaleDateString("en-CA");
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
        </div>
  );
}
export default MyCalendar;