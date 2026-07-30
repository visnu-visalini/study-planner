import { motion } from "framer-motion";
import { TrendingUp, CheckCircle2, Clock, Zap, Target } from "lucide-react";

function StatBox({ icon: Icon, value, label, color }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 6, padding: "14px 8px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 12,
            }}
        >
            <div style={{
                width: 32, height: 32, borderRadius: 9,
                background: color + "22",
                display: "flex", alignItems: "center", justifyContent: "center",
            }}>
                <Icon size={15} color={color} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9", fontVariantNumeric: "tabular-nums" }}>
                {value}
            </span>
            <span style={{ fontSize: 10, color: "#4b5563", fontWeight: 500, textAlign: "center" }}>
                {label}
            </span>
        </motion.div>
    );
}

export default function ProgressCard({ stats }) {
    const pct   = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);
    const r     = 52;
    const circ  = 2 * Math.PI * r;
    const dash  = circ - (pct / 100) * circ;

    return (
        <div>
            {/* Ring card */}
            <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16, padding: 20, marginBottom: 12,
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                    <div style={{
                        width: 28, height: 28, borderRadius: 8,
                        background: "rgba(99,102,241,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <TrendingUp size={14} color="#818cf8" />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>Overall Progress</span>
                </div>

                {/* Ring */}
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    <div style={{ position: "relative", width: 120, height: 120, flexShrink: 0 }}>
                        <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                            <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="10" />
                            <motion.circle
                                cx="60" cy="60" r={r}
                                fill="none"
                                stroke="url(#progGrad)"
                                strokeWidth="10"
                                strokeLinecap="round"
                                strokeDasharray={circ}
                                initial={{ strokeDashoffset: circ }}
                                animate={{ strokeDashoffset: dash }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                            <defs>
                                <linearGradient id="progGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <div style={{
                            position: "absolute", inset: 0,
                            display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center",
                        }}>
                            <span style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>{pct}%</span>
                            <span style={{ fontSize: 10, color: "#4b5563" }}>complete</span>
                        </div>
                    </div>

                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                        {[
                            { label: "Tasks Done",    value: stats.completed,                          color: "#22c55e" },
                            { label: "Pending",       value: stats.pending,                            color: "#f59e0b" },
                            { label: "Study Hours",   value: `${stats.studyHours}h`,                   color: "#6366f1" },
                            { label: "Sessions",      value: (stats.focusSessions || []).length,       color: "#22d3ee" },
                        ].map(({ label, value, color }) => (
                            <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontSize: 12, color: "#4b5563" }}>{label}</span>
                                <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stat grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 12 }}>
                <StatBox icon={CheckCircle2} value={stats.completed}                        label="Done"     color="#22c55e" />
                <StatBox icon={Target}       value={stats.pending}                          label="Pending"  color="#f59e0b" />
                <StatBox icon={Clock}        value={`${stats.studyHours}h`}                 label="Hours"    color="#6366f1" />
                <StatBox icon={Zap}          value={(stats.focusSessions || []).length}     label="Sessions" color="#22d3ee" />
            </div>

            {/* Progress bar */}
            <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16, padding: 16,
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Task Completion</span>
                    <span style={{ fontSize: 12, color: "#818cf8", fontWeight: 600 }}>{pct}%</span>
                </div>
                <div style={{ height: 6, background: "rgba(99,102,241,0.1)", borderRadius: 99, overflow: "hidden" }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        style={{
                            height: "100%", borderRadius: 99,
                            background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
