import { readMemory, saveMemory } from "../memory/memory.js";

export default function completeTask(id){

    const memory = readMemory();

    const task = memory.tasks.find(t=>t.id==id);

    if(!task){

        return false;

    }

    task.completed=true;

    saveMemory(memory);

    return true;

}