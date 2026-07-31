import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, ListTodo, Sparkles } from "lucide-react";
import { completeTaskById } from "../services/api";

function Section({ title, items, done, onRefresh }) {
    async function handleComplete(id) {
        await completeTaskById(id);
        await onRefresh();
    }

    return (
        <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <p style={{
                    fontSize: 10, fontWeight: 700, color: done ? "#374151" : "#6366f1",
                    textTransform: "uppercase", letterSpacing: "0.9px",
                }}>
                    {title}
                </p>
                <div style={{
                    padding: "1px 7px", borderRadius: 20,
                    background: done ? "rgba(55,65,81,0.3)" : "rgba(99,102,241,0.15)",
                    fontSize: 10, fontWeight: 600,
                    color: done ? "#4b5563" : "#818cf8",
                }}>
                    {items.length}
                </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <AnimatePresence>
                    {items.map((t, i) => (
                        <motion.div
                            key={t.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10, height: 0 }}
                            transition={{ delay: i * 0.04 }}
                            whileHover={{ x: 2 }}
                            style={{
                                display: "flex", alignItems: "flex-start", gap: 10,
                                padding: "10px 13px", borderRadius: 12,
                                background: done
                                    ? "rgba(255,255,255,0.015)"
                                    : "rgba(255,255,255,0.035)",
                                border: done
                                    ? "1px solid rgba(255,255,255,0.04)"
                                    : "1px solid rgba(99,102,241,0.12)",
                                transition: "all 0.2s",
                                cursor: done ? "default" : "pointer",
                            }}
                            onMouseEnter={e => {
                                if (!done) {
                                    e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
                                    e.currentTarget.style.background = "rgba(99,102,241,0.06)";
                                }
                            }}
                            onMouseLeave={e => {
                                if (!done) {
                                    e.currentTarget.style.borderColor = "rgba(99,102,241,0.12)";
                                    e.currentTarget.style.background = "rgba(255,255,255,0.035)";
                                }
                            }}
                        >
                            <button
                                onClick={() => !done && handleComplete(t.id)}
                                style={{
                                    background: "none", border: "none", padding: 0,
                                    cursor: done ? "default" : "pointer",
                                    flexShrink: 0, marginTop: 1, display: "flex",
                                    transition: "transform 0.15s",
                                }}
                                title={done ? "" : "Mark complete"}
                                onMouseEnter={e => { if (!done) e.currentTarget.style.transform = "scale(1.15)"; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                            >
                                {done
                                    ? <CheckCircle2 size={16} color="#22c55e" />
                                    : <Circle       size={16} color="#6366f1" />
                                }
                            </button>
                            <span style={{
                                fontSize: 12, lineHeight: 1.5,
                                color: done ? "#374151" : "#cbd5e1",
                                textDecoration: done ? "line-through" : "none",
                                flex: 1,
                            }}>
                                {t.task}
                            </span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default function TaskCard({ tasks, onRefresh }) {
    const pending = tasks.filter(t => !t.completed);
    const done    = tasks.filter(t =>  t.completed);
    const pct     = tasks.length === 0 ? 0 : Math.round((done.length / tasks.length) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
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
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
                }}>
                    <ListTodo size={15} color="white" />
                </div>
                <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Poppins, sans-serif" }}>
                        Tasks
                    </span>
                    <div style={{ fontSize: 10, color: "#4b5563", marginTop: 1 }}>
                        {done.length} of {tasks.length} completed
                    </div>
                </div>
                <div style={{
                    padding: "4px 10px", borderRadius: 20,
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    fontSize: 11, fontWeight: 700, color: "#818cf8",
                }}>
                    {tasks.length}
                </div>
            </div>

            {/* Progress bar */}
            {tasks.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 10, color: "#4b5563" }}>Completion</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#6366f1" }}>{pct}%</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(99,102,241,0.1)", borderRadius: 99, overflow: "hidden" }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            style={{
                                height: "100%", borderRadius: 99,
                                background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Empty state */}
            {tasks.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        display: "flex", flexDirection: "column", alignItems: "center",
                        gap: 8, padding: "20px 0",
                    }}
                >
                    <Sparkles size={24} color="#374151" />
                    <p style={{ fontSize: 12, color: "#374151", textAlign: "center" }}>
                        No tasks yet — ask AI to create some!
                    </p>
                </motion.div>
            )}

            {pending.length > 0 && <Section title="Pending"   items={pending} done={false} onRefresh={onRefresh} />}
            {done.length    > 0 && <Section title="Completed" items={done}    done={true}  onRefresh={onRefresh} />}
        </motion.div>
    );
}
