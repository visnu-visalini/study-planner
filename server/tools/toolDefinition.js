export const tools = [
    {
        type: "function",
        function: {
            name: "createTask",
            description: "Create a new study task.",
            parameters: {
                type: "object",
                properties: {
                    task: { type: "string", description: "Task name" }
                },
                required: ["task"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "getTasks",
            description: "Get all study tasks",
            parameters: { type: "object", properties: {} }
        }
    },
    {
        type: "function",
        function: {
            name: "getProgress",
            description: "Return user's study progress",
            parameters: { type: "object", properties: {} }
        }
    },
    {
        type: "function",
        function: {
            name: "completeTask",
            description: "Mark a task as completed by its id",
            parameters: {
                type: "object",
                properties: {
                    id: { type: "number", description: "Task id" }
                },
                required: ["id"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "startFocus",
            description: "Start a focus/study timer for a subject",
            parameters: {
                type: "object",
                properties: {
                    subject: { type: "string", description: "Subject to focus on" }
                },
                required: ["subject"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "stopFocus",
            description: "Stop the current focus session and log the time",
            parameters: { type: "object", properties: {} }
        }
    },
    {
        type: "function",
        function: {
            name: "getFocusStats",
            description: "Get total focus time and breakdown by subject",
            parameters: { type: "object", properties: {} }
        }
    },
    {
        type: "function",
        function: {
            name: "logApp",
            description: "Log time spent on an app or website",
            parameters: {
                type: "object",
                properties: {
                    appName: { type: "string", description: "App or website name" },
                    minutes: { type: "number", description: "Minutes spent" },
                    category: { type: "string", description: "Category: study, distraction, break" }
                },
                required: ["appName", "minutes", "category"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "addNotionNote",
            description: "Save a note or summary to Notion",
            parameters: {
                type: "object",
                properties: {
                    title: { type: "string", description: "Note title" },
                    content: { type: "string", description: "Note content" }
                },
                required: ["title", "content"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "addCalendarEvent",
            description: "Add a study session to Google Calendar",
            parameters: {
                type: "object",
                properties: {
                    title: { type: "string", description: "Event title" },
                    startTime: { type: "string", description: "ISO 8601 start time" },
                    endTime: { type: "string", description: "ISO 8601 end time" }
                },
                required: ["title", "startTime", "endTime"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "playSpotify",
            description: "Play a study playlist on Spotify",
            parameters: {
                type: "object",
                properties: {
                    playlistName: { type: "string", description: "Playlist name to search and play" }
                },
                required: ["playlistName"]
            }
        }
    }
];
