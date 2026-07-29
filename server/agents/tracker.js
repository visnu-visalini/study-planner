import { readMemory } from "../memory/memory.js";

export default async function tracker(req, res) {

    const memory = readMemory();

    const completed = memory.tasks.filter(
        t => t.completed
    ).length;

    const total = memory.tasks.length;

    res.json({

        reply:

`📊 Progress Report

Completed Tasks : ${completed}

Pending Tasks : ${total - completed}

Total Tasks : ${total}`

    });

}