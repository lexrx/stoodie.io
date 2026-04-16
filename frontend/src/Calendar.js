import "./App.css"
import axios from "axios";
import {useState, useEffect} from "react";

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
        if (!title || !date){
            alert("Please fill in all fields");
            return;
        }

        axios.post("http://localhost:8000/events",{
            title,
            date
        }).then(()=>{
            getEvents();
            setTitle("");
            setDate("")
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

    return(
        <div className="calendar-container">
            <div className="calendar-card">
                <h2>📅 Calendar </h2>
                <input 
                    type="text"
                    placeholder="Event Title"
                    value={title}
                    onChange={e=>setTitle(e.target.value)}
                />

                <input
                    type="date"
                    value={date}
                    onChange={e=>setDate(e.target.value)}
                />
                {editingId ?(
                    <button onClick={updateEvent}> Update Event </button>
                ) : (
                    <button onClick={addEvent}> Add Event </button>
                )}

                <div className="events-list">
                    {events.map(event=>(
                        <div key={event.id} className="event"> 
                            <h4>{event.title}</h4>
                            <p>{event.date}</p>
                            <button onClick={()=> startEdit(event)}> Edit </button>
                            <button onClick={()=> deleteEvent(event.id)}> Delete </button>
                        </div>

                    ))}
                </div>
            </div>
        </div>
    );
}
export default Calendar;