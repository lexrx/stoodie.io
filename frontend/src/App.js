import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Notes from "./Notes";
import Calendar from "./Calendar";
import Flashcards from "./Flashcards";
import Landing from "./Landing";
import Timer from "./Timer";
import Profile from "./Profile";
import Navbar from "./Navbar";
import './App.css';

function Layout({children}){
    return(
        <>
            <Navbar />
            {children}
        </>
    );
}

function App(){
    return(
        <Router>
            <Routes>
                <Route path="/" element={<Landing />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/register" element={<Register />}/>
                <Route path="/home" element={<Home />}/>
                <Route path="/notes" element={<Notes />}/>
                <Route path="/calendar" element={<Calendar />}/>
                <Route path="/timer" element={<Timer />}/>
                <Route path="/flashcards" element={<Flashcards />}/>
                <Route path="/profile" element={<Profile />}/>
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;