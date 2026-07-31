import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, Bell, Zap, Timer } from "lucide-react";

export default function Navbar({ stats }) {
    const [searchFocused, setSearchFocused] = useState(false);
    const active = stats?.activeSession;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 20px",
                background: "rgba(11, 17, 32, 0.95)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(20px)",
                flexShrink: 0, zIndex: 100,
                position: "sticky", top: 0,
            }}
        >
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    style={{
                        width: 34, height: 34, borderRadius: 10,
                        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #3b82f6 100%)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 0 16px rgba(99,102,241,0.5)",
                        flexShrink: 0,
                    }}
                >
                    <Sparkles size={16} color="white" />
                </motion.div>
                <div>
                    <div style={{
                        fontSize: 14, fontWeight: 700, color: "#f1f5f9",
                        letterSpacing: "-0.4px", fontFamily: "Poppins, sans-serif",
                        lineHeight: 1.2,
                    }}>
                        AgentVerse
                    </div>
                    <div style={{ fontSize: 9, color: "#4b5563", fontWeight: 500, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                        AI Workspace
                    </div>
                </div>
            </div>

            {/* Search bar */}
            <motion.div
                animate={{ borderColor: searchFocused ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.07)" }}
                style={{
                    flex: 1, display: "flex", alignItems: "center", gap: 8,
                    padding: "7px 12px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 10,
                    transition: "border-color 0.2s",
                }}
            >
                <Search size={12} color="#4b5563" />
                <input
                    placeholder="Search tasks, notes..."
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    style={{
                        flex: 1, background: "transparent", border: "none", outline: "none",
                        fontSize: 12, color: "#e2e8f0", minWidth: 0,
                    }}
                />
            </motion.div>

            {/* Right side */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                {/* Focus indicator */}
                <AnimatePresence>
                    {active && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, width: 0 }}
                            animate={{ opacity: 1, scale: 1, width: "auto" }}
                            exit={{ opacity: 0, scale: 0.8, width: 0 }}
                            style={{
                                display: "flex", alignItems: "center", gap: 5,
                                padding: "4px 9px", borderRadius: 20,
                                background: "rgba(34,197,94,0.1)",
                                border: "1px solid rgba(34,197,94,0.25)",
                                overflow: "hidden", whiteSpace: "nowrap",
                            }}
                        >
                            <motion.div
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }}
                            />
                            <span style={{ fontSize: 10, color: "#22c55e", fontWeight: 600 }}>Focusing</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Notification bell */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    style={{
                        width: 30, height: 30, borderRadius: 8, border: "none",
                        background: "rgba(255,255,255,0.04)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        position: "relative",
                    }}
                >
                    <Bell size={13} color="#4b5563" />
                    <div style={{
                        position: "absolute", top: 5, right: 5,
                        width: 6, height: 6, borderRadius: "50%",
                        background: "#8b5cf6",
                        border: "1.5px solid #0b1120",
                    }} />
                </motion.button>

                {/* AI badge */}
                <div style={{
                    padding: "4px 9px", borderRadius: 7,
                    background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))",
                    border: "1px solid rgba(99,102,241,0.3)",
                    fontSize: 10, fontWeight: 700, color: "#818cf8",
                    letterSpacing: "0.3px", display: "flex", alignItems: "center", gap: 4,
                }}>
                    <Zap size={9} color="#818cf8" />
                    GPT-4.1
                </div>

                {/* Avatar */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    style={{
                        width: 30, height: 30, borderRadius: 9,
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 12, fontWeight: 700, color: "white",
                        boxShadow: "0 0 10px rgba(99,102,241,0.3)",
                        cursor: "pointer", flexShrink: 0,
                    }}
                >
                    U
                </motion.div>
            </div>
        </motion.div>
    );
}
