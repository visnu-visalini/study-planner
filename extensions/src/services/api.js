const API_URL = "/api";

export async function callPlanner(message) {
    try {
        const res = await fetch(`${API_URL}/planner`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });
        if (!res.ok) throw new Error("Planner Error");
        return await res.json();
    } catch (error) {
        console.error(error);
        return { reply: "❌ Planner unavailable." };
    }
}

export async function callTutor(message) {
    try {
        const res = await fetch(`${API_URL}/tutor`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });
        if (!res.ok) throw new Error("Tutor Error");
        return await res.json();
    } catch (error) {
        console.error(error);
        return { reply: "❌ Tutor unavailable." };
    }
}

export async function askAI(message) {
    try {
        const res = await fetch(`${API_URL}/orchestrator`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });
        if (!res.ok) throw new Error("Backend Error");
        return await res.json();
    } catch (error) {
        console.error(error);
        return { reply: "❌ Unable to connect to the backend." };
    }
}

export async function completeTaskById(id) {
    try {
        const res = await fetch(`${API_URL}/executor`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });
        if (!res.ok) throw new Error();
        return await res.json();
    } catch {
        return null;
    }
}

export async function fetchTasks() {
    try {
        const res = await fetch(`${API_URL}/tracker`);
        if (!res.ok) throw new Error();
        return await res.json();
    } catch {
        return null;
    }
}
