import {Link, useLocation} from "react-router-dom";
import "./Taskbar.css";

const TABS = [
    { to: "/home",       icon: "⌂",  label: "Home" },
    { to: "/notes",      icon: "📝", label: "Notes" },
    { to: "/calendar",   icon: "📅", label: "Calendar" },
    { to: "/timer",      icon: "⏱",  label: "Timer" },
    { to: "/flashcards", icon: "🧠", label: "Cards" },
];

function Taskbar(){
    const {pathname} = useLocation();

    return(
        <nav className="taskbar">
            {TABS.map(tab => (
                <Link 
                    key={tab.to}
                    to={tab.to}
                    className={`taskbar-tab ${pathname === tab.to ? "taskbar-tab--active" : ""}`}
                >
                   <span className="taskbar-icon">{tab.icon}</span>
                   <span className="taskbar-label">{tab.label}</span> 
                </Link>
            ))}
        </nav>
    );

}

export default Taskbar;
