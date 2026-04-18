import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();

    function handleLogout() {
        // clear logged in user info
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        navigate("/login");
    }

    return (
        <div className="navbar">
            <h2 className="logo">stoodie.io</h2>

            <div className="nav-links">
                <Link to="/home">Home</Link>
                <Link to="/notes">Notes</Link>
                <Link to="/calendar">Calendar</Link>
                <Link to="/timer">Timer</Link>
                <Link to="/flashcards">Flashcards</Link>
                <Link to="/profile">Profile</Link>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Navbar;