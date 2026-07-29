import express from "express";
import { readMemory } from "../memory/memory.js";

const router = express.Router();

router.get("/", (req, res) => {
    const memory = readMemory();
    const completed = memory.tasks.filter(t => t.completed).length;
    const total = memory.tasks.length;
    const totalMinutes = (memory.focusSessions || []).reduce((a, s) => a + s.minutes, 0);

    res.json({
        tasks: memory.tasks,
        completed,
        pending: total - completed,
        total,
        studyHours: parseFloat((totalMinutes / 60).toFixed(1)),
        activeSession: memory.activeSession || null,
        focusSessions: memory.focusSessions || []
    });
});

router.post("/", async (req, res) => {
    const memory = readMemory();
    const completed = memory.tasks.filter(t => t.completed).length;
    const total = memory.tasks.length;
    res.json({
        reply: `📊 Progress Report\n\nCompleted: ${completed}\nPending: ${total - completed}\nTotal: ${total}`
    });
});

export default router;
