import { readMemory, saveMemory } from "../memory/memory.js";

export default function logApp(appName, minutes, category) {
    const memory = readMemory();
    memory.appUsage.push({
        appName,
        minutes,
        category,
        loggedAt: new Date().toISOString()
    });
    saveMemory(memory);
    return `📱 Logged ${minutes} min on "${appName}" (${category}).`;
}
