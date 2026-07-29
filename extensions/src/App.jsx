import { useState, useEffect } from "react";
import Navbar from "./Components/Navbar";
import ChatBox from "./Components/ChatBox";
import QuickActions from "./Components/QuickActions";
import PlannerCard from "./Components/PlannerCard";
import ProgressCard from "./Components/ProgressCard";
import TaskCard from "./Components/TaskCard";
import FocusTimer from "./Components/FocusTimer";
import { askAI, fetchTasks } from "./services/api";

function App() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [stats, setStats] = useState({ completed: 0, pending: 0, total: 0, studyHours: 0, activeSession: null });

    async function loadData() {
        const data = await fetchTasks();
        if (data) {
            setTasks(data.tasks || []);
            setStats({
                completed: data.completed,
                pending: data.pending,
                total: data.total,
                studyHours: data.studyHours,
                activeSession: data.activeSession,
                focusSessions: data.focusSessions || []
            });
        }
    }

    useEffect(() => { loadData(); }, []);

    async function handleAI(message) {
        setMessages(prev => [...prev, { role: "user", content: message }]);
        setLoading(true);
        try {
            const data = await askAI(message);
            const reply = data.reply ?? "❌ No response received.";
            setMessages(prev => [...prev, { role: "assistant", content: reply }]);
            // Refresh data after any AI action
            await loadData();
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container">
            <Navbar />
            <QuickActions askAI={handleAI} loading={loading} />
            <FocusTimer stats={stats} onAction={handleAI} onRefresh={loadData} />
            <ProgressCard stats={stats} />
            <TaskCard tasks={tasks} onRefresh={loadData} />
            <PlannerCard sessions={stats.focusSessions} />
            <ChatBox messages={messages} askAI={handleAI} loading={loading} />
        </div>
    );
}

export default App;
