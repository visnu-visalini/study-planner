import { motion, AnimatePresence } from "framer-motion";
import { History, BookOpen, Clock, Sparkles } from "lucide-react";

export default function PlannerCard({ sessions = [] }) {
    const recent = [...sessions].reverse().slice(0, 5);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 18, padding: 18, marginBottom: 12,
                backdropFilter: "blur(16px)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
            }}
        >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: "linear-gradient(135deg, #06b6d4, #0891b2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(6,182,212,0.35)",
                }}>
                    <History size={15} color="white" />
                </div>
                <div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Poppins, sans-serif" }}>
                        Recent Sessions
                    </span>
                    <div style={{ fontSize: 10, color: "#4b5563", marginTop: 1 }}>
                        {recent.length} session{recent.length !== 1 ? "s" : ""} recorded
                    </div>
                </div>
                {recent.length > 0 && (
                    <div style={{
                        marginLeft: "auto", padding: "3px 9px", borderRadius: 20,
                        background: "rgba(6,182,212,0.1)",
                        border: "1px solid rgba(6,182,212,0.2)",
                        fontSize: 10, fontWeight: 700, color: "#22d3ee",
                    }}>
                        {recent.length}
                    </div>
                )}
            </div>

            {/* Empty state */}
            {recent.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        display: "flex", flexDirection: "column", alignItems: "center",
                        gap: 8, padding: "20px 0",
                    }}
                >
                    <Sparkles size={22} color="#374151" />
                    <p style={{ fontSize: 12, color: "#374151", textAlign: "center" }}>
                        No sessions yet — start a focus timer!
                    </p>
                </motion.div>
            )}

            {/* Session list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <AnimatePresence>
                    {recent.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            whileHover={{ x: 3 }}
                            style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "10px 13px", borderRadius: 12,
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(6,182,212,0.1)",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = "rgba(6,182,212,0.25)";
                                e.currentTarget.style.background = "rgba(6,182,212,0.05)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = "rgba(6,182,212,0.1)";
                                e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{
                                    width: 28, height: 28, borderRadius: 8,
                                    background: "rgba(6,182,212,0.12)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <BookOpen size={13} color="#22d3ee" />
                                </div>
                                <div>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: "#cbd5e1" }}>{s.subject}</p>
                                    <p style={{ fontSize: 10, color: "#374151", display: "flex", alignItems: "center", gap: 4, marginTop: 1 }}>
                                        <Clock size={9} color="#374151" />
                                        {new Date(s.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                    </p>
                                </div>
                            </div>
                            <span style={{
                                fontSize: 11, fontWeight: 700, color: "#22d3ee",
                                padding: "3px 9px", borderRadius: 20,
                                background: "rgba(6,182,212,0.12)",
                                border: "1px solid rgba(6,182,212,0.2)",
                            }}>
                                {s.minutes}m
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}
