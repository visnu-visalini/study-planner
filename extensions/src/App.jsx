import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, CheckSquare, Timer, BarChart2 } from "lucide-react";
import Navbar from "./Components/Navbar";
import ChatBox from "./Components/ChatBox";
import QuickActions from "./Components/QuickActions";
import ProgressCard from "./Components/ProgressCard";
import TaskCard from "./Components/TaskCard";
import FocusTimer from "./Components/FocusTimer";
import PlannerCard from "./Components/PlannerCard";
import { askAI, fetchTasks, callPlanner, callTutor } from "./services/api";



import {
    connectSpotify,
    playMusic,
    pauseMusic,
    getCurrentSong
} from "./services/SpotifyService";

const TABS = [
    { id: "Chat",     label: "Chat",     Icon: MessageSquare },
    { id: "Tasks",    label: "Tasks",    Icon: CheckSquare   },
    { id: "Focus",    label: "Focus",    Icon: Timer         },
    { id: "Progress", label: "Stats",    Icon: BarChart2     },
];

const pageVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
    exit:    { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

export default function App() {
    const [tab, setTab]         = useState("Chat");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading]   = useState(false);
    const [tasks, setTasks]       = useState([]);
    const [stats, setStats]       = useState({
        completed: 0, pending: 0, total: 0,
        studyHours: 0, activeSession: null, focusSessions: [],
    });

    async function loadData() {
        const data = await fetchTasks();
        if (data) {
            setTasks(data.tasks || []);
            setStats({
                completed:      data.completed,
                pending:        data.pending,
                total:          data.total,
                studyHours:     data.studyHours,
                activeSession:  data.activeSession,
                focusSessions:  data.focusSessions || [],
            });
        }
    }

    useEffect(() => { loadData(); }, []);

    async function handleAI(message) {
        if (tab !== "Chat") setTab("Chat");
        setMessages(prev => [...prev, { role: "user", content: message }]);
        setLoading(true);
        try {
            const data = await askAI(message);
            setMessages(prev => [...prev, { role: "assistant", content: data.reply ?? "❌ No response." }]);
            await loadData();
        } finally {
            setLoading(false);
        }
    }

    async function handlePlanner(message) {
        if (tab !== "Chat") setTab("Chat");
        setMessages(prev => [...prev, { role: "user", content: message }]);
        setLoading(true);
        try {
            const data = await callPlanner(message);
            setMessages(prev => [...prev, { role: "assistant", content: data.reply ?? "❌ No response." }]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{
            display: "flex", flexDirection: "column",
            width: 440, height: 600,
            background: "#080c14", overflow: "hidden",
            position: "relative",
        }}>
            {/* Ambient glow */}
            <div style={{
                position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)",
                width: 300, height: 200,
                background: "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)",
                pointerEvents: "none", zIndex: 0,
            }} />

            <Navbar stats={stats} />

            {/* Tab bar */}
            <div style={{
                display: "flex", gap: 2, padding: "0 12px",
                background: "rgba(15,20,35,0.8)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                flexShrink: 0, zIndex: 1,
            }}>
                {TABS.map(({ id, label, Icon }) => {
                    const active = tab === id;
                    return (
                        <button
                            key={id}
                            onClick={() => setTab(id)}
                            style={{
                                flex: 1, display: "flex", alignItems: "center",
                                justifyContent: "center", gap: 5,
                                padding: "10px 4px", background: "transparent",
                                border: "none", cursor: "pointer",
                                fontSize: 12, fontWeight: active ? 600 : 400,
                                color: active ? "#818cf8" : "#4b5563",
                                borderBottom: active ? "2px solid #818cf8" : "2px solid transparent",
                                transition: "all 0.15s",
                                marginBottom: -1,
                            }}
                        >
                            <Icon size={13} />
                            {label}
                        </button>
                    );
                })}
            </div>

            {/* Page content */}
            <div style={{ flex: 1, overflow: "hidden", position: "relative", zIndex: 1 }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={tab}
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        style={{ height: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}
                    >
                        {tab === "Chat" && (
                            <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
                                <QuickActions askAI={handleAI} onPlan={handlePlanner} loading={loading} />
                                <ChatBox messages={messages} askAI={handleAI} loading={loading} />
                            </div>
                        )}
                        {tab === "Tasks" && (
                            <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 0" }}>
                                <TaskCard tasks={tasks} onRefresh={loadData} />
                                <PlannerCard sessions={stats.focusSessions} />
                            </div>
                        )}
                        {tab === "Focus" && (
                            <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 0" }}>
                                <FocusTimer stats={stats} onAction={handleAI} onRefresh={loadData} />
                            </div>
                        )}
                        {tab === "Progress" && (
                            <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px 0" }}>
                                <ProgressCard stats={stats} />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
