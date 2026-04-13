import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from "react";
import axios from "axios";

function App() {
  const [notes, setNotes] = useState([]); //storing list of notes, useState is a react hook allowing to add a state variable to component

  //storing the input values
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  //this function gets the notes from the backend
  const getNotes = () => {
    axios.get("http://localhost:8000/notes")
    .then(res => {
      setNotes(res.data);
    });
  };

  //runs when page loads, useeffect tells react that component needs to do something after render
  useEffect(() => {
    getNotes();
  }, []);

  const addNote = () => {
    axios.post("http://localhost:8000/notes", {
      title: title, 
      content: content
    }).then(() => {
      getNotes();
      setTitle("");
      setContent("");

    });
  };

  const deleteNote = (index) => {
    axios.delete(`http://localhost:8000/notes/${index}`)
    .then(() => {
      getNotes();
    });
  }

  return (
    <div className="Notes">
      <div className="Notes-header">
        <h1>Study Notes</h1>

        <input
          placeholder = "Title"
          value ={title}
          onChange={e => setTitle(e.target.value)}
        />

        <br />

        <textarea
          placeholder = "Content"
          value ={content}
          onChange={e => setContent(e.target.value)}
        />

        <br />

        <button onClick={addNote}> Add Note</button>

        <h2>Notes</h2>

        {notes.map((notes, i) => (
          <div key={i} className ="note">
            <h3>{notes.title}</h3>
            <p>{notes.content}</p>

            <button onClick={()=> deleteNote(i)}>Delete</button>
          </div>
        ))}

      </div>
    </div>
  );
}

export default App;
