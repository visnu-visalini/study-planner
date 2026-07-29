import client from "../openai/client.js";
import { readMemory } from "../memory/memory.js";

export default async function tutor(req, res) {

    const { message } = req.body;

    const memory = readMemory();

    const completion = await client.chat.completions.create({

        model: "gpt-4.1-mini",

        messages: [
            {
                role: "system",
                content: `You are a study tutor. Help the student understand topics clearly. Their tasks: ${JSON.stringify(memory.tasks)}`
            },
            {
                role: "user",
                content: message
            }
        ]

    });

    res.json({ reply: completion.choices[0].message.content });

}
