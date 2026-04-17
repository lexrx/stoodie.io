import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Notes from "./Notes";
import Calendar from "./Calendar";
import Flashcards from "./Flashcards";
import Landing from "./Landing";
import Timer from "./Timer";
import './App.css';

function App(){
    return(
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Landing />}/>
                    <Route path="/login" element={<Login />}/>
                    <Route path="/register" element={<Register />}/>
                    <Route path="/home" element={<Home />}/>
                    <Route path="/notes" element={<Notes />}/>
                    <Route path="/calendar" element={<Calendar />}/>
                    <Route path="/timer" element={<Timer />}/>
                    <Route path="/flashcards" element={<Flashcards />}/>
            </Routes>
            </div>
            
        </Router>
    );
}

export default App;