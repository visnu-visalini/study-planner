/**
 * routes/spotify.js
 * Spotify OAuth + playback control routes.
 *
 * Mounted at /spotify in server.js:
 *   GET  /spotify/login     → redirect to Spotify authorization page
 *   GET  /spotify/callback  → receive auth code, exchange for tokens
 *   GET  /spotify/current   → get currently playing track
 *   PUT  /spotify/play      → resume / start playback (optional context_uri in body)
 *   PUT  /spotify/pause     → pause playback
 *
 * No axios. No CommonJS. Pure ES modules + Node 22 native fetch.
 */

import express from "express";
import {
    exchangeCode,
    spotifyFetch,
    isAuthenticated,
} from "../services/spotifyService.js";

const router = express.Router();

// ── Utility ───────────────────────────────────────────────────────────────────

/** Escape user-controlled strings before embedding in HTML to prevent XSS */
function escapeHtml(str) {
    return String(str)
        .replace(/&/g,  "&amp;")
        .replace(/</g,  "&lt;")
        .replace(/>/g,  "&gt;")
        .replace(/"/g,  "&quot;")
        .replace(/'/g,  "&#039;");
}

/** Shared dark-themed HTML page wrapper */
function htmlPage(content) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Spotify – AgentVerse AI</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #0f172a; color: #f1f5f9;
      display: flex; align-items: center; justify-content: center;
      height: 100vh;
    }
    .card {
      text-align: center; padding: 40px 48px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 16px;
    }
    h2 { font-size: 20px; margin-bottom: 10px; }
    p  { font-size: 14px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="card">${content}</div>
</body>
</html>`;
}

// ── GET /spotify/login ────────────────────────────────────────────────────────
/**
 * Redirects the browser to Spotify's OAuth authorization page.
 * After the user approves, Spotify redirects to SPOTIFY_REDIRECT_URI (/spotify/callback).
 */
router.get("/login", (req, res) => {
    const { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } = process.env;

    // Validate required env vars before building the URL
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_REDIRECT_URI) {
        console.error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_REDIRECT_URI in .env");
        return res.status(500).send(
            htmlPage("<h2>⚙️ Server misconfigured</h2><p>SPOTIFY_CLIENT_ID or SPOTIFY_REDIRECT_URI is not set.</p>")
        );
    }

    const scopes = [
        "user-read-playback-state",       // read current playback state
        "user-modify-playback-state",     // play, pause, seek, volume
        "user-read-currently-playing",    // read currently playing track
        "streaming",                      // required for Web Playback SDK (future use)
    ].join(" ");

    const params = new URLSearchParams({
        client_id:     SPOTIFY_CLIENT_ID,
        response_type: "code",
        redirect_uri:  SPOTIFY_REDIRECT_URI,
        scope:         scopes,
        show_dialog:   "true",  // force the consent screen — useful during dev/testing
    });

    const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
    res.redirect(authUrl);
});

// ── GET /spotify/callback ─────────────────────────────────────────────────────
/**
 * Spotify redirects here after the user approves or denies access.
 * On success: exchanges the code for tokens and shows a self-closing page.
 * On failure: shows an error page.
 */
router.get("/callback", async (req, res) => {
    const { code, error } = req.query;

    // User clicked "Cancel" on Spotify's consent screen
    if (error) {
        console.error("Spotify OAuth denied by user:", error);
        return res.status(400).send(
            htmlPage(`
                <h2>❌ Access Denied</h2>
                <p>You declined Spotify access. Close this tab and try again.</p>
            `)
        );
    }

    if (!code) {
        return res.status(400).send(
            htmlPage("<h2>❌ Bad Request</h2><p>No authorization code received from Spotify.</p>")
        );
    }

    try {
        await exchangeCode(code);

        // Auto-close the popup after 2 seconds
        res.send(
            htmlPage(`
                <h2>✅ Spotify Connected!</h2>
                <p>You can close this tab and return to the extension.</p>
                <script>setTimeout(() => window.close(), 2000);<\/script>
            `)
        );
    } catch (err) {
        console.error("Spotify callback error:", err.message);

        // Escape err.message before embedding in HTML to prevent XSS
        res.status(500).send(
            htmlPage(`
                <h2>❌ Authentication Failed</h2>
                <p>${escapeHtml(err.message)}</p>
            `)
        );
    }
});

// ── GET /spotify/current ──────────────────────────────────────────────────────
/**
 * Returns the currently playing track.
 * Returns { connected: false } if the user hasn't authenticated yet.
 * Returns { connected: true, playing: false } if nothing is playing (Spotify 204).
 */
router.get("/current", async (req, res) => {
    if (!isAuthenticated()) {
        return res.json({
            connected: false,
            message:   "Not authenticated. Open /spotify/login to connect.",
        });
    }

    try {
        const spotRes = await spotifyFetch("/v1/me/player/currently-playing");

        // HTTP 204 = authenticated but nothing is currently playing
        if (spotRes.status === 204) {
            return res.json({ connected: true, playing: false, message: "Nothing is currently playing." });
        }

        if (!spotRes.ok) {
            throw new Error(`Spotify API returned ${spotRes.status}`);
        }

        const data = await spotRes.json();

        res.json({
            connected: true,
            playing:   data.is_playing ?? false,
            track:     data.item?.name                                    ?? null,
            artist:    data.item?.artists?.map(a => a.name).join(", ")    ?? null,
            album:     data.item?.album?.name                             ?? null,
            albumArt:  data.item?.album?.images?.[0]?.url                 ?? null,
            progress:  data.progress_ms                                   ?? 0,
            duration:  data.item?.duration_ms                             ?? 0,
        });
    } catch (err) {
        console.error("GET /spotify/current error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// ── PUT /spotify/play ─────────────────────────────────────────────────────────
/**
 * Resumes or starts playback on the user's active device.
 * Accepts an optional { context_uri } in the request body to play a specific
 * playlist or album (e.g. "spotify:playlist:37i9dQZF1DX8Uebhn9wzrS").
 * Sends {} when no context_uri is provided — required by Spotify's API.
 */
router.put("/play", async (req, res) => {
    if (!isAuthenticated()) {
        return res.status(401).json({
            error: "Not authenticated. Open /spotify/login to connect.",
        });
    }

    try {
        // Spotify's /play endpoint requires a JSON body even when resuming.
        // Send { context_uri } if provided, otherwise send an empty object {}.
        const requestBody = req.body?.context_uri
            ? JSON.stringify({ context_uri: req.body.context_uri })
            : "{}";

        const spotRes = await spotifyFetch("/v1/me/player/play", {
            method: "PUT",
            body:   requestBody,
        });

        // 204 = success (no content), 202 = accepted (device is waking up)
        if (spotRes.status === 204 || spotRes.status === 202) {
            return res.json({ success: true, message: "Playback started." });
        }

        if (!spotRes.ok) {
            const errBody = await spotRes.json().catch(() => ({}));
            throw new Error(errBody.error?.message ?? `Spotify error ${spotRes.status}`);
        }

        res.json({ success: true });
    } catch (err) {
        console.error("PUT /spotify/play error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// ── PUT /spotify/pause ────────────────────────────────────────────────────────
/**
 * Pauses playback on the user's active Spotify device.
 */
router.put("/pause", async (req, res) => {
    if (!isAuthenticated()) {
        return res.status(401).json({
            error: "Not authenticated. Open /spotify/login to connect.",
        });
    }

    try {
        const spotRes = await spotifyFetch("/v1/me/player/pause", {
            method: "PUT",
            body:   "{}",   // Spotify pause endpoint also expects a JSON body
        });

        if (spotRes.status === 204 || spotRes.status === 202) {
            return res.json({ success: true, message: "Playback paused." });
        }

        if (!spotRes.ok) {
            const errBody = await spotRes.json().catch(() => ({}));
            throw new Error(errBody.error?.message ?? `Spotify error ${spotRes.status}`);
        }

        res.json({ success: true });
    } catch (err) {
        console.error("PUT /spotify/pause error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

export default router;
