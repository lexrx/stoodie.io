import { Link } from "react-router-dom";
import "./Landing.css";

function Landing(){
    return(
        <div className="landing-container">
            <div className="landing-card">
                <h1 className="landing-title">Stoodie.io</h1>
                <p className="landing-description">
                    A productivity platform designed for students to stay organised and focused
                </p>
                <div className="features">
                    <p>📝 Notes – Create and manage study notes</p>
                    <p>📅 Calendar – Plan your schedule</p>
                    <p>⏱ Timer – Stay focused with study sessions</p>
                    <p>🧠 Flashcards – Revise efficiently</p>
                </div>
                <div className="landing-buttons">
                    <Link to="/login">
                        <button className="primary-btn">Login</button>
                    </Link>
                    <Link to="/register">
                        <button className="secondary-btn"> Create Account </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Landing;