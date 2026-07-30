import { motion } from "framer-motion";
import { History, BookOpen } from "lucide-react";

export default function PlannerCard({ sessions = [] }) {
    const recent = [...sessions].reverse().slice(0, 5);

    return (
        <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16, padding: 16, marginBottom: 12,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: "rgba(6,182,212,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <History size={14} color="#22d3ee" />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>Recent Sessions</span>
            </div>

            {recent.length === 0 && (
                <p style={{ fontSize: 12, color: "#374151", textAlign: "center", padding: "12px 0" }}>
                    No sessions yet — start a focus timer!
                </p>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {recent.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "9px 12px", borderRadius: 10,
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                            <BookOpen size={13} color="#818cf8" />
                            <div>
                                <p style={{ fontSize: 12, fontWeight: 500, color: "#cbd5e1" }}>{s.subject}</p>
                                <p style={{ fontSize: 10, color: "#374151" }}>
                                    {new Date(s.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </p>
                            </div>
                        </div>
                        <span style={{
                            fontSize: 11, fontWeight: 600, color: "#22d3ee",
                            padding: "3px 8px", borderRadius: 20,
                            background: "rgba(6,182,212,0.12)",
                            border: "1px solid rgba(6,182,212,0.2)",
                        }}>
                            {s.minutes}m
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
