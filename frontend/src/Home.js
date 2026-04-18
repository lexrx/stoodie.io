import {Link} from "react-router-dom";
import "./Home.css";

const CARDS = [
    { to: "/notes",      icon: "📝", label: "Notes",      desc: "Create and manage study notes" },
    { to: "/calendar",   icon: "📅", label: "Calendar",   desc: "Plan your study schedule" },
    { to: "/timer",      icon: "⏱",  label: "Timer",      desc: "Focus with Pomodoro sessions" },
    { to: "/flashcards", icon: "🧠", label: "Flashcards", desc: "Revise with flashcards" },
];

function Home(){
    const username=localStorage.getItem("username") || "there";
    return (
        <div className="home-page">
            <div className="home-header">
                <p className="home-eyebrow">stoodie.io</p>
                <h1 className="home-title">Hey, {username} 👋</h1>
                <p className="home-subtitle">Where would you like to start today?</p>
            </div>
 
            <div className="home-grid">
                {CARDS.map(card => (
                    <Link key={card.to} to={card.to} className="home-card">
                        <span className="home-card-icon">{card.icon}</span>
                        <h2 className="home-card-label">{card.label}</h2>
                        <p className="home-card-desc">{card.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
export default Home;
