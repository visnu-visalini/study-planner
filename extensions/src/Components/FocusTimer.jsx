import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, Timer, Flame } from "lucide-react";

export default function FocusTimer({ stats, onAction, onRefresh }) {
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
        const h = Math.floor(secs / 3600).toString().padStart(2, "0");
        const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return secs >= 3600 ? `${h}:${m}:${s}` : `${m}:${s}`;
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

    // Ring progress (max 60 min)
    const maxSecs = 3600;
    const r = 54;
    const circ = 2 * Math.PI * r;
    const progress = Math.min(elapsed / maxSecs, 1);
    const dashOffset = circ - progress * circ;

    return (
        <div>
            {/* Timer card */}
            <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16, padding: 20, marginBottom: 12,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: "rgba(99,102,241,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <Timer size={14} color="#818cf8" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>Focus Timer</span>
                    {stats.focusSessions?.length > 0 && (
                        <span style={{
                            marginLeft: "auto", fontSize: 11, color: "#f59e0b",
                            display: "flex", alignItems: "center", gap: 4,
                        }}>
                            <Flame size={12} color="#f59e0b" />
                            {stats.studyHours}h today
                        </span>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {active ? (
                        <motion.div
                            key="active"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
                        >
                            {/* Ring */}
                            <div style={{ position: "relative", width: 130, height: 130 }}>
                                <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: "rotate(-90deg)" }}>
                                    <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="8" />
                                    <motion.circle
                                        cx="65" cy="65" r={r}
                                        fill="none"
                                        stroke="url(#timerGrad)"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={circ}
                                        strokeDashoffset={dashOffset}
                                        style={{ transition: "stroke-dashoffset 1s linear" }}
                                    />
                                    <defs>
                                        <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#6366f1" />
                                            <stop offset="100%" stopColor="#8b5cf6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div style={{
                                    position: "absolute", inset: 0,
                                    display: "flex", flexDirection: "column",
                                    alignItems: "center", justifyContent: "center",
                                }}>
                                    <span style={{ fontSize: 26, fontWeight: 700, color: "#f1f5f9", fontVariantNumeric: "tabular-nums", letterSpacing: 1 }}>
                                        {fmt(elapsed)}
                                    </span>
                                    <span style={{ fontSize: 10, color: "#4b5563", marginTop: 2 }}>elapsed</span>
                                </div>
                            </div>

                            <p style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
                                📖 {active.subject}
                            </p>

                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleStop}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "10px 28px", borderRadius: 12, border: "none",
                                    background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                                    color: "white", fontSize: 13, fontWeight: 600,
                                    cursor: "pointer",
                                    boxShadow: "0 0 16px rgba(220,38,38,0.3)",
                                }}
                            >
                                <Square size={14} /> Stop Session
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            style={{ display: "flex", flexDirection: "column", gap: 10 }}
                        >
                            <p style={{ fontSize: 12, color: "#4b5563", textAlign: "center", marginBottom: 4 }}>
                                Start a focused study session to track your time.
                            </p>
                            <input
                                type="text"
                                placeholder="Subject (e.g. DBMS, OS, Maths...)"
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleStart()}
                                style={{
                                    width: "100%", padding: "10px 14px",
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: 10, color: "#e2e8f0",
                                    fontSize: 13, outline: "none",
                                    transition: "border-color 0.2s",
                                }}
                                onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.5)"}
                                onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                            />
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleStart}
                                style={{
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                    padding: "11px", borderRadius: 12, border: "none",
                                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                    color: "white", fontSize: 13, fontWeight: 600,
                                    cursor: "pointer",
                                    boxShadow: "0 0 16px rgba(99,102,241,0.3)",
                                }}
                            >
                                <Play size={14} /> Start Focus Session
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Session history */}
            {stats.focusSessions?.length > 0 && (
                <div style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 16, padding: 16,
                }}>
                    <p style={{ fontSize: 10, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10 }}>
                        Session History
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {[...stats.focusSessions].reverse().slice(0, 4).map((s, i) => (
                            <div key={i} style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "7px 10px", borderRadius: 8,
                                background: "rgba(255,255,255,0.02)",
                            }}>
                                <span style={{ fontSize: 12, color: "#94a3b8" }}>{s.subject}</span>
                                <span style={{ fontSize: 11, color: "#6366f1", fontWeight: 600 }}>{s.minutes}m</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
