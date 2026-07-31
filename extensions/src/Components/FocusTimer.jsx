import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Square, Timer, Flame, Clock, BookOpen } from "lucide-react";

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

    const maxSecs   = 3600;
    const r         = 56;
    const circ      = 2 * Math.PI * r;
    const progress  = Math.min(elapsed / maxSecs, 1);
    const dashOffset = circ - progress * circ;

    return (
        <div>
            {/* Timer card */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 18, padding: 20, marginBottom: 12,
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 10,
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
                    }}>
                        <Timer size={15} color="white" />
                    </div>
                    <div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Poppins, sans-serif" }}>
                            Focus Timer
                        </span>
                        <div style={{ fontSize: 10, color: "#4b5563", marginTop: 1 }}>
                            Deep work sessions
                        </div>
                    </div>
                    {stats.focusSessions?.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                marginLeft: "auto", display: "flex", alignItems: "center", gap: 5,
                                padding: "4px 10px", borderRadius: 20,
                                background: "rgba(245,158,11,0.12)",
                                border: "1px solid rgba(245,158,11,0.25)",
                            }}
                        >
                            <Flame size={12} color="#f59e0b" />
                            <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 600 }}>
                                {stats.studyHours}h today
                            </span>
                        </motion.div>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {active ? (
                        <motion.div
                            key="active"
                            initial={{ opacity: 0, scale: 0.93 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.93 }}
                            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}
                        >
                            {/* Animated ring */}
                            <div style={{ position: "relative", width: 140, height: 140 }}>
                                {/* Outer glow */}
                                <div style={{
                                    position: "absolute", inset: -8,
                                    borderRadius: "50%",
                                    background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
                                    pointerEvents: "none",
                                }} />
                                <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)" }}>
                                    <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(99,102,241,0.08)" strokeWidth="9" />
                                    <motion.circle
                                        cx="70" cy="70" r={r}
                                        fill="none"
                                        stroke="url(#timerGrad)"
                                        strokeWidth="9"
                                        strokeLinecap="round"
                                        strokeDasharray={circ}
                                        strokeDashoffset={dashOffset}
                                        style={{ transition: "stroke-dashoffset 1s linear" }}
                                    />
                                    <defs>
                                        <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%">
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
                                    <span style={{
                                        fontSize: 28, fontWeight: 800, color: "#f1f5f9",
                                        fontVariantNumeric: "tabular-nums", letterSpacing: 1,
                                        fontFamily: "Poppins, sans-serif",
                                    }}>
                                        {fmt(elapsed)}
                                    </span>
                                    <span style={{ fontSize: 10, color: "#4b5563", marginTop: 2 }}>elapsed</span>
                                </div>
                            </div>

                            {/* Subject badge */}
                            <div style={{
                                display: "flex", alignItems: "center", gap: 7,
                                padding: "7px 14px", borderRadius: 20,
                                background: "rgba(99,102,241,0.1)",
                                border: "1px solid rgba(99,102,241,0.2)",
                            }}>
                                <BookOpen size={12} color="#818cf8" />
                                <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
                                    {active.subject}
                                </span>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={handleStop}
                                style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "11px 32px", borderRadius: 13, border: "none",
                                    background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                                    color: "white", fontSize: 13, fontWeight: 600,
                                    cursor: "pointer",
                                    boxShadow: "0 4px 20px rgba(220,38,38,0.35)",
                                }}
                            >
                                <Square size={14} /> Stop Session
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0, scale: 0.93 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.93 }}
                            style={{ display: "flex", flexDirection: "column", gap: 12 }}
                        >
                            <p style={{ fontSize: 12, color: "#4b5563", textAlign: "center", lineHeight: 1.6 }}>
                                Start a focused study session to track your time.
                            </p>
                            <input
                                type="text"
                                placeholder="Subject (e.g. DBMS, OS, Maths...)"
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleStart()}
                                style={{
                                    width: "100%", padding: "11px 14px",
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.1)",
                                    borderRadius: 12, color: "#e2e8f0",
                                    fontSize: 13, outline: "none",
                                    transition: "border-color 0.2s, box-shadow 0.2s",
                                }}
                                onFocus={e => {
                                    e.target.style.borderColor = "rgba(99,102,241,0.5)";
                                    e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.1)";
                                }}
                                onBlur={e => {
                                    e.target.style.borderColor = "rgba(255,255,255,0.1)";
                                    e.target.style.boxShadow = "none";
                                }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleStart}
                                style={{
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                    padding: "12px", borderRadius: 13, border: "none",
                                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                    color: "white", fontSize: 13, fontWeight: 600,
                                    cursor: "pointer",
                                    boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
                                }}
                            >
                                <Play size={14} /> Start Focus Session
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Session history */}
            <AnimatePresence>
                {stats.focusSessions?.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: 18, padding: 16,
                            backdropFilter: "blur(16px)",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                            <Clock size={13} color="#4b5563" />
                            <p style={{
                                fontSize: 10, fontWeight: 700, color: "#374151",
                                textTransform: "uppercase", letterSpacing: "0.9px",
                            }}>
                                Session History
                            </p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                            {[...stats.focusSessions].reverse().slice(0, 4).map((s, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    style={{
                                        display: "flex", justifyContent: "space-between", alignItems: "center",
                                        padding: "9px 12px", borderRadius: 10,
                                        background: "rgba(255,255,255,0.025)",
                                        border: "1px solid rgba(255,255,255,0.05)",
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <BookOpen size={12} color="#6366f1" />
                                        <span style={{ fontSize: 12, color: "#94a3b8" }}>{s.subject}</span>
                                    </div>
                                    <span style={{
                                        fontSize: 11, fontWeight: 700, color: "#22d3ee",
                                        padding: "2px 8px", borderRadius: 20,
                                        background: "rgba(6,182,212,0.1)",
                                        border: "1px solid rgba(6,182,212,0.2)",
                                    }}>
                                        {s.minutes}m
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
