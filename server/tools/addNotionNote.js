import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export default async function addNotionNote(title, content) {
    const token = process.env.NOTION_TOKEN;
    const dbId = process.env.NOTION_DATABASE_ID;

    if (!token || !dbId) return "❌ Notion not configured. Add NOTION_TOKEN and NOTION_DATABASE_ID to .env";

    const res = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Notion-Version": "2022-06-28"
        },
        body: JSON.stringify({
            parent: { database_id: dbId },
            properties: {
                title: {
                    title: [{ text: { content: title } }]
                }
            },
            children: [
                {
                    object: "block",
                    type: "paragraph",
                    paragraph: {
                        rich_text: [{ type: "text", text: { content } }]
                    }
                }
            ]
        })
    });

    if (!res.ok) {
        const err = await res.json();
        return `❌ Notion error: ${err.message}`;
    }

    const page = await res.json();
    return `✅ Note "${title}" saved to Notion. URL: ${page.url}`;
}
