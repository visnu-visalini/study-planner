import { readMemory, saveMemory } from "../memory/memory.js";

export default function startFocus(subject) {
    const memory = readMemory();
    memory.activeSession = {
        subject,
        startTime: new Date().toISOString()
    };
    saveMemory(memory);
    return `⏱️ Focus session started for "${subject}". Good luck!`;
}
