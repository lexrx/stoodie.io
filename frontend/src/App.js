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
import Taskbar from "./Taskbar";
import './App.css';

function Layout({children}){
    return(
        <>
            <Navbar />
            {children}
            <Taskbar />
        </>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
 
                <Route path="/home"       element={<Layout><Home /></Layout>} />
                <Route path="/notes"      element={<Layout><Notes /></Layout>} />
                <Route path="/calendar"   element={<Layout><Calendar /></Layout>} />
                <Route path="/timer"      element={<Layout><Timer /></Layout>} />
                <Route path="/flashcards" element={<Layout><Flashcards /></Layout>} />
                <Route path="/profile"    element={<Layout><Profile /></Layout>} />
 
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}
 
export default App;