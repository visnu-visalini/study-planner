import { useState, useEffect, useRef } from "react";

function FocusTimer({ stats, onAction, onRefresh }) {
    const [subject, setSubject] = useState("");
    const [elapsed, setElapsed] = useState(0);
    const intervalRef = useRef(null);
    const active = stats.activeSession;

    useEffect(() => {
        if (active) {
            const start = new Date(active.startTime).getTime();
            intervalRef.current = setInterval(() => {
                setElapsed(Math.floor((Date.now() - start) / 1000));
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
            setElapsed(0);
        }
        return () => clearInterval(intervalRef.current);
    }, [active]);

    function fmt(secs) {
        const m = Math.floor(secs / 60).toString().padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    async function handleStart() {
        if (!subject.trim()) return;
        await onAction(`Start focus session for ${subject}`);
        setSubject("");
    }

    async function handleStop() {
        await onAction("Stop focus session");
        await onRefresh();
    }

    return (
        <div className="card">
            <h3>⏱️ Focus Timer</h3>
            <br />
            {active ? (
                <>
                    <p>📖 Studying: <strong>{active.subject}</strong></p>
                    <p className="timerDisplay">{fmt(elapsed)}</p>
                    <button onClick={handleStop} style={{ background: "#dc2626", marginTop: 10 }}>
                        ⏹ Stop Session
                    </button>
                </>
            ) : (
                <>
                    <input
                        type="text"
                        placeholder="Subject (e.g. DBMS)"
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleStart()}
                        style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ddd", marginBottom: 10 }}
                    />
                    <button onClick={handleStart}>▶ Start Focus</button>
                </>
            )}
        </div>
    );
}

export default FocusTimer;
