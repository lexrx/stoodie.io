import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    function handleLogout() {
        // clear logged in user info
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        navigate("/login");
    }

    return (
        <nav className="navbar">
            <h2 className="logo">stoodie.io</h2>

            <div className="nav-links">
                <Link to="/home">Home</Link>
                <Link to="/notes">Notes</Link>
                <Link to="/calendar">Calendar</Link>
                <Link to="/timer">Timer</Link>
                <Link to="/flashcards">Flashcards</Link>
                <Link to="/profile">Profile</Link>
            </div>
            <div className="nav-right">
                {username && <span className="nav-username">{username}</span>}
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;