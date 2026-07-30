import { motion } from "framer-motion";
import { CalendarDays, BarChart2, CheckSquare, Music, FileText, CalendarClock } from "lucide-react";
import { connectSpotify } from "../services/SpotifyService";

export default function QuickActions({ askAI, onPlan, loading }) {
    const ACTIONS = [
        { label: "Plan Today",  Icon: CalendarDays,  color: "#6366f1", handler: () => onPlan("Create a detailed study plan for today based on my tasks") },
        { label: "Progress",    Icon: BarChart2,      color: "#8b5cf6", handler: () => askAI("Show my progress and focus stats") },
        { label: "My Tasks",    Icon: CheckSquare,    color: "#06b6d4", handler: () => askAI("Show all my tasks") },
         {
    label: "Spotify",
    Icon: Music,
    color: "#22c55e",
    handler: () => connectSpotify()
},
        { label: "Save Note",   Icon: FileText,       color: "#f59e0b", handler: () => askAI("Save a study session summary note to Notion") },
        { label: "Schedule",    Icon: CalendarClock,  color: "#ec4899", handler: () => askAI("Add a 2-hour study session to Google Calendar for tomorrow at 10am") },
    ];

    return (
        <div style={{ padding: "10px 12px 0", flexShrink: 0 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>
                Quick Actions
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                {ACTIONS.map(({ label, Icon, color, handler }, i) => (
                    <motion.button
                        key={i}
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handler()}
                        disabled={loading}
                        style={{
                            display: "flex", flexDirection: "column", alignItems: "center",
                            gap: 6, padding: "10px 6px",
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.07)",
                            borderRadius: 12, cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.5 : 1,
                            transition: "border-color 0.2s, box-shadow 0.2s",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = color + "55";
                            e.currentTarget.style.boxShadow = `0 0 12px ${color}22`;
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >
                        <div style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: color + "22",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <Icon size={14} color={color} />
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 500, color: "#94a3b8", textAlign: "center", lineHeight: 1.2 }}>
                            {label}
                        </span>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
