import "./App.css"
import axios from "axios";
import {useState, useEffect} from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"

function Calendar(){
    //storing all events from database
    const [events, setEvents] = useState([]);

    //storing input values
    const[title, setTitle] = useState("");
    const[date, setDate] = useState("");

    //storing id of event being edited
    const[editingId, setEditingId] = useState(null);

    //getting events from backend
    const getEvents= () =>{
        axios.get("http://localhost:8000/events")
            .then(res => setEvents(res.data));
    };

    //run when page loads
    useEffect(() => {
        getEvents();
    }, []);

    //adding an event
    const addEvent = () =>{
        //basic validation
        if (!title){
            alert("Enter event title");
            return;
        }

        axios.post("http://localhost:8000/events",{
            title,
            date: date.toISOString().split("T")[0]
        }).then(()=>{
            getEvents();
            setTitle("");
        });
    };

    //deleting an event
    const deleteEvent = (id) =>{
        axios.delete(`http://localhost:8000/events/${id}`)
            .then(() => getEvents());
    };

    //start editing event
    const startEdit = (event) =>{
        setEditingId(event.id);
        setTitle(event.title);
        setDate(event.date);
    };

    //updating event
    const updateEvent = () => {
        axios.put(`http://localhost:8000/events/${editingId}`,{
            title,
            date
        }).then(() => {
            setEditingId(null);
            setTitle("");
            setDate("");
            getEvents();
        });
    };

    //filtering events for a selected date
    const selectedEvents = events.filter(
        event => event.date == date.toISOString().split("T")[0]
    );

    return(
        <div className="calendar-container">
            <h2>📅 Calendar </h2>
            <Calendar 
                onChange={setDate}
                value={date}
            />
            <div className="event-input"> 
                <input 
                    type="text"
                    placeholder="Event Title"
                    value={title}
                    onChange={e=>setTitle(e.target.value)}
                />
                <button onClick={addEvent}> Add Event </button>
            </div>

            <div className = "event-list">
                <h3>Events on {date.toDateString()}</h3>

                {selectedEvents.length === 0 ?(
                    <p>No events for this day</p>
                ) :(
                    selectedEvents.map(event => (
                        <div key={event.id} className="event">
                            <span>{event.title}</span>
                            <button onClick={() => deleteEvent(event.id)}>Delete</button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
export default Calendar;