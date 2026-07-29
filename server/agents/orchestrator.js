import client from "../openai/client.js";
import registry from "../tools/toolRegistry.js";
import { tools } from "../tools/toolDefinition.js";
import { readMemory, saveMemory } from "../memory/memory.js";

export default async function orchestrator(req, res) {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ reply: "No message provided." });

        const memory = readMemory();

        // Build conversation history from memory
        const history = memory.conversation.map(c => ({
            role: c.role,
            content: c.content
        }));

        const messages = [
            {
                role: "system",
                content: `You are an AI Study Planner assistant. You help students manage tasks, track focus time, take notes, schedule study sessions, and stay productive. Use tools whenever the user asks to create tasks, check progress, start/stop focus, log apps, save notes to Notion, add calendar events, or play Spotify. Always respond helpfully and concisely.`
            },
            ...history,
            { role: "user", content: message }
        ];

        const response = await client.chat.completions.create({
            model: "gpt-4.1-mini",
            messages,
            tools
        });

        const assistantMessage = response.choices[0].message;
        const toolCalls = assistantMessage.tool_calls;

        let reply;

        if (!toolCalls || toolCalls.length === 0) {
            reply = assistantMessage.content;
        } else {
            // Execute all tool calls
            const toolResults = [];
            for (const call of toolCalls) {
                const toolName = call.function.name;
                const args = JSON.parse(call.function.arguments);
                const fn = registry[toolName];
                if (!fn) {
                    toolResults.push(`❌ Unknown tool: ${toolName}`);
                    continue;
                }
                const result = await Promise.resolve(fn(...Object.values(args)));
                toolResults.push(typeof result === "object" ? JSON.stringify(result, null, 2) : String(result));
            }

            reply = toolResults.join("\n\n");
        }

        // Save conversation to memory (keep last 20 turns)
        memory.conversation.push({ role: "user", content: message });
        memory.conversation.push({ role: "assistant", content: reply });
        if (memory.conversation.length > 40) {
            memory.conversation = memory.conversation.slice(-40);
        }
        saveMemory(memory);

        return res.json({ reply });

    } catch (error) {
        console.error("Orchestrator error:", error.message);
        return res.status(500).json({ reply: "❌ Server error: " + error.message });
    }
}
