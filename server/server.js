/**
 * server.js
 * Main Express server entry point.
 *
 * `import "dotenv/config"` MUST be the first line — ES module imports are
 * hoisted, so this is the only reliable way to ensure .env is loaded before
 * any other module reads process.env at import time.
 */
import "dotenv/config";

import express from "express";
import cors    from "cors";

import plannerRoute      from "./routes/planner.js";
import tutorRoute        from "./routes/tutor.js";
import trackerRoute      from "./routes/tracker.js";
import executorRoute     from "./routes/executor.js";
import orchestratorRoute from "./routes/orchestrator.js";
import spotifyRoute      from "./routes/spotify.js";

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
// Restrict to known local origins instead of wildcard (*).
// - http://localhost:5173  → Vite dev server
// - http://localhost:4173  → Vite preview server
// - chrome-extension://*  → the packed Chrome extension (any extension ID)
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:4173",
];

app.use(cors({
    origin(origin, callback) {
        // Allow requests with no origin (curl, Postman, server-to-server)
        if (!origin) return callback(null, true);

        // Allow any chrome-extension:// origin (extension ID changes per install)
        if (origin.startsWith("chrome-extension://")) return callback(null, true);

        if (allowedOrigins.includes(origin)) return callback(null, true);

        callback(new Error(`CORS: origin "${origin}" is not allowed`));
    },
    methods:     ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
}));

app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/planner",      plannerRoute);
app.use("/tutor",        tutorRoute);
app.use("/tracker",      trackerRoute);
app.use("/executor",     executorRoute);
app.use("/orchestrator", orchestratorRoute);
app.use("/spotify",      spotifyRoute);

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT ?? 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
