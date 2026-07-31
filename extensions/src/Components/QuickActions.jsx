import { motion } from "framer-motion";
import { CalendarDays, BarChart2, CheckSquare, Music, FileText, CalendarClock } from "lucide-react";
import { connectSpotify } from "../services/SpotifyService";

export default function QuickActions({ askAI, onPlan, loading }) {
    const ACTIONS = [
        {
            label: "Plan Today",
            Icon: CalendarDays,
            gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            glow: "rgba(99,102,241,0.35)",
            bg: "rgba(99,102,241,0.12)",
            handler: () => onPlan("Create a detailed study plan for today based on my tasks"),
        },
        {
            label: "Progress",
            Icon: BarChart2,
            gradient: "linear-gradient(135deg, #8b5cf6, #a855f7)",
            glow: "rgba(139,92,246,0.35)",
            bg: "rgba(139,92,246,0.12)",
            handler: () => askAI("Show my progress and focus stats"),
        },
        {
            label: "My Tasks",
            Icon: CheckSquare,
            gradient: "linear-gradient(135deg, #06b6d4, #0891b2)",
            glow: "rgba(6,182,212,0.35)",
            bg: "rgba(6,182,212,0.12)",
            handler: () => askAI("Show all my tasks"),
        },
        {
            label: "Spotify",
            Icon: Music,
            gradient: "linear-gradient(135deg, #22c55e, #16a34a)",
            glow: "rgba(34,197,94,0.35)",
            bg: "rgba(34,197,94,0.12)",
            handler: () => connectSpotify(),
        },
        {
            label: "Save Note",
            Icon: FileText,
            gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
            glow: "rgba(245,158,11,0.35)",
            bg: "rgba(245,158,11,0.12)",
            handler: () => askAI("Save a study session summary note to Notion"),
        },
        {
            label: "Schedule",
            Icon: CalendarClock,
            gradient: "linear-gradient(135deg, #ec4899, #db2777)",
            glow: "rgba(236,72,153,0.35)",
            bg: "rgba(236,72,153,0.12)",
            handler: () => askAI("Add a 2-hour study session to Google Calendar for tomorrow at 10am"),
        },
    ];

    return (
        <div style={{ padding: "16px 20px 0", flexShrink: 0 }}>
            <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 12,
            }}>
                <p style={{
                    fontSize: 10, fontWeight: 700, color: "#374151",
                    textTransform: "uppercase", letterSpacing: "1px",
                }}>
                    Quick Actions
                </p>
                <div style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: loading ? "#f59e0b" : "#22c55e",
                    boxShadow: loading ? "0 0 6px #f59e0b" : "0 0 6px #22c55e",
                }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 7 }}>
                {ACTIONS.map(({ label, Icon, gradient, glow, bg, handler }, i) => (
                    <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handler()}
                        disabled={loading}
                        style={{
                            display: "flex", flexDirection: "column", alignItems: "center",
                            gap: 8, padding: "12px 6px",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: 14, cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.5 : 1,
                            transition: "all 0.2s",
                            position: "relative", overflow: "hidden",
                        }}
                        onMouseEnter={e => {
                            if (loading) return;
                            e.currentTarget.style.background = bg;
                            e.currentTarget.style.borderColor = glow.replace("0.35", "0.4");
                            e.currentTarget.style.boxShadow = `0 4px 20px ${glow}`;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        {/* Gradient icon container */}
                        <div style={{
                            width: 32, height: 32, borderRadius: 10,
                            background: gradient,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: `0 4px 12px ${glow}`,
                        }}>
                            <Icon size={15} color="white" />
                        </div>
                        <span style={{
                            fontSize: 10, fontWeight: 600, color: "#94a3b8",
                            textAlign: "center", lineHeight: 1.2,
                        }}>
                            {label}
                        </span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
