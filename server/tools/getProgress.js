import { readMemory } from "../memory/memory.js";

export default function getProgress(){

    const memory = readMemory();

    const total = memory.tasks.length;

    const completed =
    memory.tasks.filter(t=>t.completed).length;

    const percentage =
    total===0 ? 0 :
    Math.round(completed/total*100);

    return{

        total,

        completed,

        pending:total-completed,

        percentage

    };

}