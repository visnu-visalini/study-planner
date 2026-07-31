import { motion } from "framer-motion";
import { TrendingUp, CheckCircle2, Clock, Zap, Target, Award } from "lucide-react";

function StatBox({ icon: Icon, value, label, color, gradient }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2, scale: 1.02 }}
            style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 7, padding: "14px 8px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                transition: "all 0.2s",
                cursor: "default",
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = color + "40";
                e.currentTarget.style.boxShadow = `0 4px 16px ${color}20`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.boxShadow = "none";
            }}
        >
            <div style={{
                width: 34, height: 34, borderRadius: 10,
                background: gradient || `${color}20`,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: `0 4px 10px ${color}30`,
            }}>
                <Icon size={15} color={gradient ? "white" : color} />
            </div>
            <span style={{
                fontSize: 20, fontWeight: 800, color: "#f1f5f9",
                fontVariantNumeric: "tabular-nums", fontFamily: "Poppins, sans-serif",
                letterSpacing: "-0.5px",
            }}>
                {value}
            </span>
            <span style={{ fontSize: 10, color: "#4b5563", fontWeight: 500, textAlign: "center" }}>
                {label}
            </span>
        </motion.div>
    );
}

export default function ProgressCard({ stats }) {
    const pct  = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);
    const r    = 52;
    const circ = 2 * Math.PI * r;
    const dash = circ - (pct / 100) * circ;

    return (
        <div>
            {/* Main ring card */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 18, padding: 20, marginBottom: 12,
                    backdropFilter: "blur(16px)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                }}
            >
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: 10,
                        background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(99,102,241,0.35)",
                    }}>
                        <TrendingUp size={15} color="white" />
                    </div>
                    <div>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9", fontFamily: "Poppins, sans-serif" }}>
                            Overall Progress
                        </span>
                        <div style={{ fontSize: 10, color: "#4b5563", marginTop: 1 }}>
                            Your productivity overview
                        </div>
                    </div>
                    {pct >= 80 && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{ marginLeft: "auto" }}
                        >
                            <Award size={18} color="#f59e0b" />
                        </motion.div>
                    )}
                </div>

                {/* Ring + stats */}
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    {/* SVG Ring */}
                    <div style={{ position: "relative", width: 124, height: 124, flexShrink: 0 }}>
                        <svg width="124" height="124" viewBox="0 0 124 124" style={{ transform: "rotate(-90deg)" }}>
                            <circle cx="62" cy="62" r={r} fill="none" stroke="rgba(99,102,241,0.08)" strokeWidth="10" />
                            <motion.circle
                                cx="62" cy="62" r={r}
                                fill="none"
                                stroke="url(#progGrad)"
                                strokeWidth="10"
                                strokeLinecap="round"
                                strokeDasharray={circ}
                                initial={{ strokeDashoffset: circ }}
                                animate={{ strokeDashoffset: dash }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
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
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                style={{
                                    fontSize: 26, fontWeight: 800, color: "#f1f5f9",
                                    fontFamily: "Poppins, sans-serif", letterSpacing: "-1px",
                                }}
                            >
                                {pct}%
                            </motion.span>
                            <span style={{ fontSize: 10, color: "#4b5563", marginTop: 1 }}>complete</span>
                        </div>
                    </div>

                    {/* Stat rows */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 11 }}>
                        {[
                            { label: "Tasks Done",  value: stats.completed,                    color: "#22c55e" },
                            { label: "Pending",     value: stats.pending,                      color: "#f59e0b" },
                            { label: "Study Hours", value: `${stats.studyHours}h`,             color: "#6366f1" },
                            { label: "Sessions",    value: (stats.focusSessions || []).length, color: "#22d3ee" },
                        ].map(({ label, value, color }, i) => (
                            <motion.div
                                key={label}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + i * 0.07 }}
                                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                                    <div style={{
                                        width: 6, height: 6, borderRadius: "50%",
                                        background: color, boxShadow: `0 0 6px ${color}`,
                                    }} />
                                    <span style={{ fontSize: 12, color: "#4b5563" }}>{label}</span>
                                </div>
                                <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Stat grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 12 }}>
                <StatBox icon={CheckCircle2} value={stats.completed}                    label="Done"     color="#22c55e" gradient="linear-gradient(135deg,#22c55e,#16a34a)" />
                <StatBox icon={Target}       value={stats.pending}                      label="Pending"  color="#f59e0b" gradient="linear-gradient(135deg,#f59e0b,#d97706)" />
                <StatBox icon={Clock}        value={`${stats.studyHours}h`}             label="Hours"    color="#6366f1" gradient="linear-gradient(135deg,#6366f1,#8b5cf6)" />
                <StatBox icon={Zap}          value={(stats.focusSessions || []).length} label="Sessions" color="#22d3ee" gradient="linear-gradient(135deg,#06b6d4,#0891b2)" />
            </div>

            {/* Progress bar card */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 18, padding: 16,
                    backdropFilter: "blur(16px)",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Task Completion Rate</span>
                    <span style={{ fontSize: 12, color: "#818cf8", fontWeight: 700 }}>{pct}%</span>
                </div>
                <div style={{ height: 7, background: "rgba(99,102,241,0.08)", borderRadius: 99, overflow: "hidden" }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        style={{
                            height: "100%", borderRadius: 99,
                            background: "linear-gradient(90deg, #6366f1, #8b5cf6, #3b82f6)",
                        }}
                    />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                    <span style={{ fontSize: 10, color: "#374151" }}>0%</span>
                    <span style={{ fontSize: 10, color: "#374151" }}>100%</span>
                </div>
            </motion.div>
        </div>
    );
}
