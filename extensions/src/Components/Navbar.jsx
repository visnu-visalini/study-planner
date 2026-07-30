import { Sparkles, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar({ stats }) {
    const active = stats?.activeSession;

    return (
        <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "13px 16px",
            background: "rgba(8,12,20,0.95)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0, zIndex: 10,
        }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{
                    width: 30, height: 30, borderRadius: 9,
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 0 12px rgba(99,102,241,0.4)",
                }}>
                    <Sparkles size={15} color="white" />
                </div>
                <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.3px" }}>
                        AgentVerse AI
                    </div>
                    <div style={{ fontSize: 10, color: "#4b5563", fontWeight: 400 }}>
                        Study Assistant
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <AnimatePresence>
                    {active && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            style={{
                                display: "flex", alignItems: "center", gap: 5,
                                padding: "4px 9px", borderRadius: 20,
                                background: "rgba(34,197,94,0.12)",
                                border: "1px solid rgba(34,197,94,0.25)",
                            }}
                        >
                            <motion.div
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }}
                            />
                            <span style={{ fontSize: 10, color: "#22c55e", fontWeight: 600 }}>
                                Focusing
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div style={{
                    padding: "3px 8px", borderRadius: 6,
                    background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))",
                    border: "1px solid rgba(99,102,241,0.3)",
                    fontSize: 10, fontWeight: 700, color: "#818cf8",
                    letterSpacing: "0.5px",
                }}>
                    GPT-4.1
                </div>
            </div>
        </div>
    );
}
