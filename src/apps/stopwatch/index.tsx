import { useEffect, useState } from "react";
import "./stopwatch.css";

// Format centiseconds (1/100s) into hh:mm:ss
function format(cs: number) {
  const hours = Math.floor(cs / 360000);
  const minutes = Math.floor((cs % 360000) / 6000);
  const seconds = Math.floor((cs % 6000) / 100);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export default function Stopwatch() {
  const [time, setTime] = useState(0); // elapsed in centiseconds
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    // functional updater => no stale closure; interval id is local to the effect
    const id = setInterval(() => setTime((c) => c + 1), 10);
    // cleanup runs on pause (running -> false) AND on unmount
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="sw">
      <div className="sw-display">{format(time)}</div>
      <div className="sw-controls">
        {running ? (
          <button className="sw-btn stop" onClick={() => setRunning(false)}>
            Stop
          </button>
        ) : (
          <button className="sw-btn start" onClick={() => setRunning(true)}>
            Start
          </button>
        )}
        <button
          className="sw-btn"
          onClick={() => {
            setRunning(false);
            setTime(0);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
