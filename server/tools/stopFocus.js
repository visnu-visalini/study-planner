import { readMemory, saveMemory } from "../memory/memory.js";

export default function stopFocus() {
    const memory = readMemory();
    if (!memory.activeSession) return "No active focus session.";

    const start = new Date(memory.activeSession.startTime);
    const end = new Date();
    const minutes = Math.round((end - start) / 60000);

    const session = {
        subject: memory.activeSession.subject,
        startTime: memory.activeSession.startTime,
        endTime: end.toISOString(),
        minutes
    };

    memory.focusSessions.push(session);
    memory.progress.studyHours = parseFloat(
        ((memory.focusSessions.reduce((a, s) => a + s.minutes, 0)) / 60).toFixed(2)
    );
    memory.activeSession = null;
    saveMemory(memory);

    return `✅ Session ended. You studied "${session.subject}" for ${minutes} minutes.`;
}
