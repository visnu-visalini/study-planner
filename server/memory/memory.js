import fs from "fs";

const MEMORY_FILE = "./memory/memory.json";

export function readMemory() {
    return JSON.parse(fs.readFileSync(MEMORY_FILE, "utf8"));
}

export function saveMemory(memory) {
    fs.writeFileSync(
        MEMORY_FILE,
        JSON.stringify(memory, null, 2)
    );
}