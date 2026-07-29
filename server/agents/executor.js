import { readMemory, saveMemory } from "../memory/memory.js";

export default async function executor(req, res) {

    const memory = readMemory();

    if(memory.tasks.length>0){

        memory.tasks[0].completed=true;

    }

    saveMemory(memory);

    res.json({

        reply:"✅ First task marked as completed."

    });

}