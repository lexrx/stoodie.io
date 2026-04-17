import { useEffect, useState } from "react";
import MusicQueue from "./MusicQueue";
import "./Timer.css";

function Timer(){
    //storing total secs left on timer
    const [seconds, setSeconds]=useState(1500);

    //tracks if timer is running
    const[running, setRunning]=useState(false);

    //runs timer every second when running is true
    useEffect(() =>{
        let timer;
        if(running &&seconds > 0){
            timer=setInterval(() =>{
                setSeconds((prev)=> prev-1);
            }, 1000);
        }
        //cleanup to stop multiple intervals
        return()=>clearInterval(timer);
    }, [running, seconds]);

    //converting secs into MM:SS format
    function formatTime(totalSeconds){
        const minutes = Math.floor(totalSeconds/60);
        const remainingSeconds = totalSeconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }

    return(
        <div className ="timer-page">
            <h1 className="timer-title"> 🍑 Pastel Pomodoro </h1>
            <div className="timer-card">
                <h2 className="timer-display">{formatTime(seconds)}</h2>
                <div className="timer-buttons">
                    <button onClick={() => setRunning(true)}>Start</button>
                    <button onClick={() => setRunning(false)}>Pause</button>
                    <button onClick={() =>{
                        setRunning(false);
                        setSeconds(1500);
                    }}>
                        Reset
                    </button>
                </div>
            </div>
            <MusicQueue />
        </div>
    )



}

export default Timer;