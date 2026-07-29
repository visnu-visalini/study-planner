import { readMemory, saveMemory } from "../memory/memory.js";

export default function createTask(task){

    const memory = readMemory();

    const newTask = {

        id: Date.now(),

        task,

        completed:false,

        created:new Date().toISOString()

    };

    memory.tasks.push(newTask);

    saveMemory(memory);

    return newTask;

}