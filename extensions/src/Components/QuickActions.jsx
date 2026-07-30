import { motion } from "framer-motion";
import { CalendarDays, BarChart2, CheckSquare, Music, FileText, CalendarClock } from "lucide-react";

const ACTIONS = [
    { label: "Plan Today",  Icon: CalendarDays,  prompt: "Create a study plan for today",                                              color: "#6366f1" },
    { label: "Progress",    Icon: BarChart2,      prompt: "Show my progress and focus stats",                                          color: "#8b5cf6" },
    { label: "My Tasks",    Icon: CheckSquare,    prompt: "Show all my tasks",                                                         color: "#06b6d4" },
    { label: "Spotify",     Icon: Music,          prompt: "Play a lo-fi study playlist on Spotify",                                    color: "#22c55e" },
    { label: "Save Note",   Icon: FileText,       prompt: "Save a study session summary note to Notion",                              color: "#f59e0b" },
    { label: "Schedule",    Icon: CalendarClock,  prompt: "Add a 2-hour study session to Google Calendar for tomorrow at 10am",       color: "#ec4899" },
];

export default function QuickActions({ askAI, loading }) {
    return (
        <div style={{ padding: "10px 12px 0", flexShrink: 0 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>
                Quick Actions
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                {ACTIONS.map(({ label, Icon, prompt, color }, i) => (
                    <motion.button
                        key={i}
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => askAI(prompt)}
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
