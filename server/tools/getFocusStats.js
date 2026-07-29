import { readMemory } from "../memory/memory.js";

export default function getFocusStats() {
    const memory = readMemory();
    const sessions = memory.focusSessions;
    if (sessions.length === 0) return "No focus sessions recorded yet.";

    const totalMinutes = sessions.reduce((a, s) => a + s.minutes, 0);
    const bySubject = {};
    sessions.forEach(s => {
        bySubject[s.subject] = (bySubject[s.subject] || 0) + s.minutes;
    });

    const breakdown = Object.entries(bySubject)
        .map(([sub, mins]) => `  • ${sub}: ${mins} min`)
        .join("\n");

    return `📊 Focus Stats\nTotal: ${totalMinutes} min (${(totalMinutes / 60).toFixed(1)} hrs)\nSessions: ${sessions.length}\n\nBy Subject:\n${breakdown}`;
}
