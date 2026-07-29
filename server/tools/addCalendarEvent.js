import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export default async function addCalendarEvent(title, startTime, endTime) {
    const token = process.env.GOOGLE_ACCESS_TOKEN;
    const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

    if (!token) return "❌ Google Calendar not configured. Add GOOGLE_ACCESS_TOKEN to .env";

    const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                summary: title,
                start: { dateTime: startTime, timeZone: "Asia/Kolkata" },
                end: { dateTime: endTime, timeZone: "Asia/Kolkata" }
            })
        }
    );

    if (!res.ok) {
        const err = await res.json();
        return `❌ Calendar error: ${err.error?.message}`;
    }

    const event = await res.json();
    return `✅ Event "${title}" added to Google Calendar. Link: ${event.htmlLink}`;
}
