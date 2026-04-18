import { useEffect, useState } from "react";
import WhiteNoisePlayer from "./Whitenoiseplayer"
import "./Timer.css";

const MODES = [
    {label: "Focus", seconds: 25*60},
    {label: "Short Break", seconds: 5*60},
    {label: "Long Break", seconds: 15*60},
];

function Timer(){
    const [modeIndex, setModeIndex] = useState(0);
    //storing total secs left on timer
    const [seconds, setSeconds]=useState(1500);

    //tracks if timer is running
    const[running, setRunning]=useState(false);

    // Reset timer when mode changes
    useEffect(() => {
        setRunning(false);
        setSeconds(MODES[modeIndex].seconds);
    }, [modeIndex]);

    //runs timer every second when running is true
    useEffect(() => {
        if (!running || seconds <= 0) {
            if (seconds <= 0) setRunning(false);
            return;
        }
        const timer = setInterval(() => {
            setSeconds(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [running, seconds]);


    //converting secs into MM:SS format
    function formatTime(total){
        const minutes = Math.floor(total/60);
        const remainingSeconds = total % 60;
        return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    }

    function reset(){
        setRunning(false);
        setSeconds(MODES[modeIndex].seconds);
    }

    const progress = 1 - seconds/MODES[modeIndex].seconds;
    const circumference = 2*Math.PI*90;

    return(
        <div className ="timer-page">
            <h1 className="timer-title"> 🍑 Pastel Pomodoro </h1>
            <div className="timer-mode-tabs">
                {MODES.map((mode, i) => (
                    <button
                        key={mode.label}
                        className={`mode-tab ${modeIndex === i ? "mode-tab--active" : ""}`}
                        onClick={() => setModeIndex(i)}
                    >
                        {mode.label}
                    </button>
                ))}
            </div>
 
            <div className="timer-card">
                <svg className="timer-ring" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="90" className="ring-bg" />
                    <circle
                        cx="100" cy="100" r="90"
                        className="ring-fill"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - progress)}
                        transform="rotate(-90 100 100)"
                    />
                </svg>
                <div className="timer-display">{formatTime(seconds)}</div>
                <div className="timer-mode-label">{MODES[modeIndex].label}</div>
            </div>
 
            <div className="timer-controls">
                <button className="timer-btn" onClick={reset}>↺ Reset</button>
                <button className="timer-btn timer-btn--primary" onClick={() => setRunning(r => !r)}>
                    {running ? "⏸ Pause" : "▶ Start"}
                </button>
            </div>
 
            <WhiteNoisePlayer />
        </div>
    );
}
 
export default Timer;