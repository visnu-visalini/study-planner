import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, BookOpen, Target, Clock, Zap } from "lucide-react";

const SUGGESTIONS = [
    { icon: BookOpen, label: "Explain React hooks", color: "#6366f1" },
    { icon: Target,   label: "Create study plan",  color: "#8b5cf6" },
    { icon: Clock,    label: "Start focus timer",  color: "#3b82f6" },
    { icon: Zap,      label: "Show my progress",   color: "#06b6d4" },
];

export default function ChatBox({ messages, askAI, loading }) {
    const [message, setMessage] = useState("");
    const bottomRef   = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    function send() {
        if (!message.trim() || loading) return;
        askAI(message.trim());
        setMessage("");
        if (textareaRef.current) textareaRef.current.style.height = "40px";
    }

    function handleKey(e) {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
    }

    function handleChange(e) {
        setMessage(e.target.value);
        e.target.style.height = "40px";
        e.target.style.height = Math.min(e.target.scrollHeight, 110) + "px";
    }

    const canSend = !loading && message.trim().length > 0;

    return (
        <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>

            {/* Messages area */}
            <div style={{
                flex: 1, overflowY: "auto", padding: "16px 20px",
                display: "flex", flexDirection: "column", gap: 16,
            }}>

                {/* Empty state */}
                {messages.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        style={{
                            display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center",
                            flex: 1, gap: 20, paddingBottom: 24, minHeight: 200,
                        }}
                    >
                        {/* AI orb */}
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            style={{
                                width: 72, height: 72, borderRadius: 22,
                                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #3b82f6 100%)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 0 40px rgba(99,102,241,0.4), 0 0 80px rgba(99,102,241,0.15)",
                            }}
                        >
                            <Sparkles size={30} color="white" />
                        </motion.div>

                        <div style={{ textAlign: "center" }}>
                            <p style={{
                                fontSize: 18, fontWeight: 700, color: "#f1f5f9",
                                fontFamily: "Poppins, sans-serif", marginBottom: 8,
                                letterSpacing: "-0.3px",
                            }}>
                                How can I help you today?
                            </p>
                            <p style={{
                                fontSize: 13, color: "#4b5563", lineHeight: 1.7,
                                maxWidth: 300,
                            }}>
                                Create tasks, explain topics, track progress, start focus sessions, or save notes to Notion.
                            </p>
                        </div>

                        {/* Suggestion chips */}
                        <div style={{
                            display: "grid", gridTemplateColumns: "1fr 1fr",
                            gap: 8, width: "100%", maxWidth: 340,
                        }}>
                            {SUGGESTIONS.map(({ icon: Icon, label, color }, i) => (
                                <motion.button
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.07 }}
                                    whileHover={{ scale: 1.02, y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => askAI(label)}
                                    disabled={loading}
                                    style={{
                                        display: "flex", alignItems: "center", gap: 9,
                                        padding: "11px 14px",
                                        background: "rgba(255,255,255,0.03)",
                                        border: `1px solid ${color}30`,
                                        borderRadius: 12, cursor: "pointer",
                                        textAlign: "left",
                                        transition: "all 0.2s",
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = `${color}10`;
                                        e.currentTarget.style.borderColor = `${color}50`;
                                        e.currentTarget.style.boxShadow = `0 0 16px ${color}20`;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                                        e.currentTarget.style.borderColor = `${color}30`;
                                        e.currentTarget.style.boxShadow = "none";
                                    }}
                                >
                                    <div style={{
                                        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                                        background: `${color}20`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <Icon size={13} color={color} />
                                    </div>
                                    <span style={{ fontSize: 11, fontWeight: 500, color: "#94a3b8", lineHeight: 1.3 }}>
                                        {label}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Messages */}
                <AnimatePresence initial={false}>
                    {messages.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 12, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            style={{
                                display: "flex",
                                flexDirection: m.role === "user" ? "row-reverse" : "row",
                                alignItems: "flex-end", gap: 10,
                            }}
                        >
                            {/* Avatar */}
                            <div style={{
                                width: 30, height: 30, borderRadius: 10, flexShrink: 0,
                                background: m.role === "user"
                                    ? "linear-gradient(135deg, #374151, #1f2937)"
                                    : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: m.role === "assistant" ? "0 0 12px rgba(99,102,241,0.35)" : "none",
                                border: m.role === "user" ? "1px solid rgba(255,255,255,0.08)" : "none",
                            }}>
                                {m.role === "user"
                                    ? <User size={14} color="#9ca3af" />
                                    : <Bot  size={14} color="white"   />
                                }
                            </div>

                            {/* Bubble */}
                            <motion.div
                                whileHover={{ scale: 1.005 }}
                                style={{
                                    maxWidth: "75%",
                                    padding: "11px 15px",
                                    borderRadius: m.role === "user"
                                        ? "18px 4px 18px 18px"
                                        : "4px 18px 18px 18px",
                                    background: m.role === "user"
                                        ? "linear-gradient(135deg, #6366f1, #7c3aed)"
                                        : "rgba(255,255,255,0.04)",
                                    border: m.role === "user"
                                        ? "none"
                                        : "1px solid rgba(255,255,255,0.08)",
                                    fontSize: 13, lineHeight: 1.65,
                                    color: m.role === "user" ? "#fff" : "#cbd5e1",
                                    whiteSpace: "pre-wrap", wordBreak: "break-word",
                                    backdropFilter: m.role === "assistant" ? "blur(12px)" : "none",
                                    boxShadow: m.role === "user"
                                        ? "0 4px 16px rgba(99,102,241,0.3)"
                                        : "0 2px 12px rgba(0,0,0,0.2)",
                                }}
                            >
                                {m.content}
                            </motion.div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing indicator */}
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            style={{ display: "flex", alignItems: "flex-end", gap: 10 }}
                        >
                            <div style={{
                                width: 30, height: 30, borderRadius: 10,
                                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 0 12px rgba(99,102,241,0.35)",
                            }}>
                                <Bot size={14} color="white" />
                            </div>
                            <div style={{
                                padding: "14px 18px",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "4px 18px 18px 18px",
                                display: "flex", gap: 5, alignItems: "center",
                                backdropFilter: "blur(12px)",
                            }}>
                                {[0, 0.18, 0.36].map((delay, i) => (
                                    <motion.div key={i}
                                        animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                                        transition={{ repeat: Infinity, duration: 0.8, delay }}
                                        style={{
                                            width: 7, height: 7, borderRadius: "50%",
                                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                        }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div style={{ padding: "0 16px 16px", flexShrink: 0 }}>
                <motion.div
                    animate={{
                        borderColor: message.trim()
                            ? "rgba(99,102,241,0.4)"
                            : "rgba(255,255,255,0.08)",
                        boxShadow: message.trim()
                            ? "0 0 20px rgba(99,102,241,0.12)"
                            : "none",
                    }}
                    style={{
                        display: "flex", alignItems: "flex-end", gap: 10,
                        padding: "12px 14px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 16,
                        backdropFilter: "blur(16px)",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                >
                    <textarea
                        ref={textareaRef}
                        rows={1}
                        placeholder="Message AgentVerse AI..."
                        value={message}
                        onChange={handleChange}
                        onKeyDown={handleKey}
                        style={{
                            flex: 1, background: "transparent", border: "none", outline: "none",
                            color: "#e2e8f0", fontSize: 13, lineHeight: 1.55, resize: "none",
                            height: 40, maxHeight: 110, overflowY: "auto",
                            padding: "9px 0",
                        }}
                    />
                    <motion.button
                        whileHover={canSend ? { scale: 1.08 } : {}}
                        whileTap={canSend ? { scale: 0.92 } : {}}
                        onClick={send}
                        disabled={!canSend}
                        style={{
                            width: 38, height: 38, borderRadius: 11, border: "none",
                            background: canSend
                                ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                                : "rgba(99,102,241,0.15)",
                            color: "white", cursor: canSend ? "pointer" : "not-allowed",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, transition: "background 0.2s",
                            boxShadow: canSend ? "0 0 16px rgba(99,102,241,0.45)" : "none",
                        }}
                    >
                        <Send size={15} color={canSend ? "white" : "#4b5563"} />
                    </motion.button>
                </motion.div>
            </div>
        </div>
    );
}
