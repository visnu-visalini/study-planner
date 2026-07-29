import { readMemory } from "../memory/memory.js";

export default function getTasks(){

    const memory = readMemory();

    return memory.tasks;

}