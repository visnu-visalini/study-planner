import { readMemory, saveMemory } from "../memory/memory.js";

export default async function executor(req, res) {

    const memory = readMemory();
    const { id } = req.body;

    if (id !== undefined) {
        const task = memory.tasks.find(t => t.id == id);
        if (!task) return res.status(404).json({ reply: "Task not found." });
        task.completed = true;
    } else if (memory.tasks.length > 0) {
        const first = memory.tasks.find(t => !t.completed);
        if (first) first.completed = true;
    }

    saveMemory(memory);
    res.json({ reply: "✅ Task marked as completed." });

}