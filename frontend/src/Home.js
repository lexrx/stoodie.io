import {Link} from "react-router-dom";
import "./App.css";

function Home(){
    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Stoodie.io</h1>
            <div className="dashboard-grid">
                <Link to="/notes" className="card">
                    <h2>📝 Notes </h2>
                    <p>Create and manage study notes</p>
                </Link>
                <Link to="/calendar" className="card">
                    <h2>📅 Calendar </h2>
                    <p>Plan your study schedule</p>
                </Link>
                <Link to="/timer" className="card">
                    <h2>⏱ Timer </h2>
                    <p> Focus with study sessions </p>
                </Link>
                <Link to="/flashcards" className="card">
                    <h2>🧠 Flashcards </h2>
                    <p> Revise with flashcards </p>
                </Link>
            </div>   
        </div>
    );
}
export default Home;