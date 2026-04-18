import { Link } from "react-router-dom";
import "./Landing.css";

const FEATURES = [
    { icon: "📝", label: "Notes", desc: "Create and manage study notes" },
    { icon: "📅", label: "Calendar", desc: "Plan your schedule" },
    { icon: "⏱", label: "Timer", desc: "Focus with Pomodoro sessions" },
    { icon: "🧠", label: "Flashcards", desc: "Revise efficiently" },
];

function Landing(){
    return(
        <div className="landing-page">
            <div className="landing-card">
                <h1 className="landing-eyebrow">Stoodie.io</h1>
                <h1 className="landing-title">Your student<br /><em>study space</em></h1>
                <p className="landing-description">
                    A productivity platform designed for students to stay organised and focused.
                </p>
 
                <div className="landing-features">
                    {FEATURES.map(f => (
                        <div key={f.label} className="feature-pill">
                            <span className="feature-icon">{f.icon}</span>
                            <div>
                                <strong>{f.label}</strong>
                                <span>{f.desc}</span>
                            </div>
                        </div>
                    ))}
                </div>
 
                <div className="landing-buttons">
                    <Link to="/login">
                        <button className="landing-btn landing-btn--primary">Log in</button>
                    </Link>
                    <Link to="/register">
                        <button className="landing-btn landing-btn--secondary">Create account</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
 
export default Landing;