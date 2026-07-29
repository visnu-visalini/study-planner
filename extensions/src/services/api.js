const API_URL = "/api";

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

export async function fetchTasks() {
    try {
        const res = await fetch(`${API_URL}/tracker`);
        if (!res.ok) throw new Error();
        return await res.json();
    } catch {
        return null;
    }
}

export async function fetchProgress() {
    try {
        const res = await fetch(`${API_URL}/tracker`);
        if (!res.ok) throw new Error();
        return await res.json();
    } catch {
        return null;
    }
}
