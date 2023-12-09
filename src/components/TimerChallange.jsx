import { useRef, useState } from "react";
import ResultModal from "./ResultModal";

export default function TimerChallange({ title, targetTime }) {
    const timerId = useRef();
    const dialog = useRef();
    
    // maintain timeRemaining state and keep decreasing it after every 10 ms using setInterval() to get the remaining
    // time when timer expires or is stopped manually
    const [timeRemaining, setTimeRemaining] = useState(targetTime * 1000);

    // derive timerIsActive state from timeRemaining state as timeRemaining state updates after every 10 ms 
    // so timerIsActive state also updates as component rerender after every 10 ms
    const timerIsActive =
        timeRemaining < targetTime * 1000 && timeRemaining > 0;

    // timer expired (we lost)
    if (timeRemaining <= 0) {
        dialog.current.open();
        clearInterval(timerId.current);
    }

    // timer started
    function handleStart() {
        timerId.current = setInterval(() => {
            setTimeRemaining((prevTimeRemaining) => prevTimeRemaining - 10);
        }, 10);
    }

    // timer stopped manually (we won)
    function handleStop() {
        dialog.current.open();
        clearInterval(timerId.current);
    }

    function handleReset() {
        // set the timeRemaining state to target time so that it can be restared and timerIsActive become false
        setTimeRemaining(targetTime * 1000);
    }

    return (
        <>
            {/* dialog ref is forwarded to ResultModal and it expose the component using useImperativeHandle 
            and provide open() method to display modal */}
            {/* remainingTime is passed to component everytime(10ms) it is rerendered so latest remaining time is sent
            when timer expires or is stopped */}
            {/* handleReset also passed to reset after pressing close button on dialog box(modal) */}
            <ResultModal
                ref={dialog}
                targetTime={targetTime}
                remainingTime={timeRemaining}
                onReset={handleReset}
            />

            <section className="challenge">
                <h2>{title}</h2>

                <p className="challenge-time">
                    {targetTime} second{targetTime > 1 ? "s" : ""}
                </p>
                <p>
                    <button onClick={timerIsActive ? handleStop : handleStart}>
                        {timerIsActive ? "stop" : "start"} challange
                    </button>
                </p>

                <p className={timerIsActive ? "active" : undefined}>
                    {timerIsActive ? "timer is running" : "timer inactive"}
                </p>
            </section>
        </>
    );
}
