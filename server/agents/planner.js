import client from "../openai/client.js";
import { readMemory, saveMemory } from "../memory/memory.js";

export default async function planner(req, res) {

    const { message } = req.body;

    const completion = await client.chat.completions.create({

        model: "gpt-4.1-mini",

        messages: [
            {
                role: "system",
                content:
                    "You are a study planner. Return a practical study plan."
            },
            {
                role: "user",
                content: message
            }
        ]

    });

    const reply = completion.choices[0].message.content;

    const memory = readMemory();


    saveMemory(memory);

    res.json({
        reply
    });

}