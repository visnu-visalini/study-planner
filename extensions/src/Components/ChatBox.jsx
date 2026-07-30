import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User } from "lucide-react";

export default function ChatBox({ messages, askAI, loading }) {
    const [message, setMessage] = useState("");
    const bottomRef  = useRef(null);
    const textareaRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    function send() {
        if (!message.trim() || loading) return;
        askAI(message.trim());
        setMessage("");
        if (textareaRef.current) {
            textareaRef.current.style.height = "40px";
        }
    }

    function handleKey(e) {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
    }

    function handleChange(e) {
        setMessage(e.target.value);
        e.target.style.height = "40px";
        e.target.style.height = Math.min(e.target.scrollHeight, 110) + "px";
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", padding: "0 12px 12px" }}>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", paddingTop: 8, display: "flex", flexDirection: "column", gap: 12 }}>

                {messages.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 10, paddingBottom: 20 }}
                    >
                        <div style={{
                            width: 52, height: 52, borderRadius: 16,
                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 0 24px rgba(99,102,241,0.35)",
                        }}>
                            <Bot size={24} color="white" />
                        </div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "#f1f5f9" }}>How can I help you study?</p>
                        <p style={{ fontSize: 12, color: "#4b5563", textAlign: "center", lineHeight: 1.6, maxWidth: 260 }}>
                            Create tasks, explain topics, track progress, start focus sessions, save notes to Notion, or schedule on Google Calendar.
                        </p>
                    </motion.div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{
                                display: "flex",
                                flexDirection: m.role === "user" ? "row-reverse" : "row",
                                alignItems: "flex-start", gap: 8,
                            }}
                        >
                            {/* Avatar */}
                            <div style={{
                                width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                                background: m.role === "user"
                                    ? "linear-gradient(135deg, #374151, #1f2937)"
                                    : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: m.role === "assistant" ? "0 0 8px rgba(99,102,241,0.3)" : "none",
                            }}>
                                {m.role === "user"
                                    ? <User size={13} color="#9ca3af" />
                                    : <Bot  size={13} color="white"   />
                                }
                            </div>

                            {/* Bubble */}
                            <div style={{
                                maxWidth: "78%",
                                padding: "9px 13px",
                                borderRadius: m.role === "user" ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
                                background: m.role === "user"
                                    ? "linear-gradient(135deg, #6366f1, #7c3aed)"
                                    : "rgba(255,255,255,0.04)",
                                border: m.role === "user"
                                    ? "none"
                                    : "1px solid rgba(255,255,255,0.07)",
                                fontSize: 13, lineHeight: 1.6,
                                color: m.role === "user" ? "#fff" : "#cbd5e1",
                                whiteSpace: "pre-wrap", wordBreak: "break-word",
                                backdropFilter: m.role === "assistant" ? "blur(8px)" : "none",
                            }}>
                                {m.content}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Typing indicator */}
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            style={{ display: "flex", alignItems: "flex-start", gap: 8 }}
                        >
                            <div style={{
                                width: 26, height: 26, borderRadius: 8,
                                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 0 8px rgba(99,102,241,0.3)",
                            }}>
                                <Bot size={13} color="white" />
                            </div>
                            <div style={{
                                padding: "12px 16px",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.07)",
                                borderRadius: "4px 14px 14px 14px",
                                display: "flex", gap: 4, alignItems: "center",
                            }}>
                                {[0, 0.2, 0.4].map((delay, i) => (
                                    <motion.div key={i}
                                        animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                                        transition={{ repeat: Infinity, duration: 0.9, delay }}
                                        style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1" }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div style={{
                display: "flex", alignItems: "flex-end", gap: 8,
                padding: "10px 12px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                backdropFilter: "blur(12px)",
                marginTop: 8,
            }}>
                <textarea
                    ref={textareaRef}
                    rows={1}
                    placeholder="Message AgentVerse AI..."
                    value={message}
                    onChange={handleChange}
                    onKeyDown={handleKey}
                    style={{
                        flex: 1, background: "transparent", border: "none", outline: "none",
                        color: "#e2e8f0", fontSize: 13, lineHeight: 1.5, resize: "none",
                        height: 40, maxHeight: 110, overflowY: "auto",
                        padding: "10px 0",
                    }}
                />
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={send}
                    disabled={loading || !message.trim()}
                    style={{
                        width: 36, height: 36, borderRadius: 10, border: "none",
                        background: loading || !message.trim()
                            ? "rgba(99,102,241,0.2)"
                            : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        color: "white", cursor: loading || !message.trim() ? "not-allowed" : "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, transition: "background 0.2s",
                        boxShadow: !loading && message.trim() ? "0 0 12px rgba(99,102,241,0.4)" : "none",
                    }}
                >
                    <Send size={14} />
                </motion.button>
            </div>
        </div>
    );
}
