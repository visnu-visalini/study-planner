import { motion } from "framer-motion";
import { CheckCircle2, Circle, ListTodo } from "lucide-react";

function Section({ title, items, done }) {
    return (
        <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 600, color: "#374151", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 8 }}>
                {title}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {items.map((t, i) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        style={{
                            display: "flex", alignItems: "flex-start", gap: 10,
                            padding: "9px 12px", borderRadius: 10,
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        {done
                            ? <CheckCircle2 size={15} color="#22c55e" style={{ flexShrink: 0, marginTop: 1 }} />
                            : <Circle       size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: 1 }} />
                        }
                        <span style={{
                            fontSize: 12, color: done ? "#4b5563" : "#cbd5e1",
                            textDecoration: done ? "line-through" : "none",
                            lineHeight: 1.4,
                        }}>
                            {t.task}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default function TaskCard({ tasks }) {
    const pending = tasks.filter(t => !t.completed);
    const done    = tasks.filter(t =>  t.completed);

    return (
        <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16, padding: 16, marginBottom: 12,
        }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: "rgba(99,102,241,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <ListTodo size={14} color="#818cf8" />
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>Tasks</span>
                <span style={{
                    marginLeft: "auto", fontSize: 11, fontWeight: 600,
                    padding: "2px 8px", borderRadius: 20,
                    background: "rgba(99,102,241,0.15)", color: "#818cf8",
                }}>
                    {tasks.length}
                </span>
            </div>

            {tasks.length === 0 && (
                <p style={{ fontSize: 12, color: "#374151", textAlign: "center", padding: "16px 0" }}>
                    No tasks yet — ask AI to create some!
                </p>
            )}

            {pending.length > 0 && <Section title="Pending" items={pending} done={false} />}
            {done.length    > 0 && <Section title="Completed" items={done}    done={true}  />}
        </div>
    );
}
