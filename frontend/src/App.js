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
      title: title, content: content
    }).then(() => {
      getNotes();

      setTitle("");
      setContent("");

    });
  };

  return (
    <div className="Notes">
      <header className="Notes-header">
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


        {notes.map((notes, i) => (
          <div key={i}>
            <h3>{notes.title}</h3>
            <p>{notes.content}</p>
          </div>
        ))}

      </header>
    </div>
  );
}

export default App;
