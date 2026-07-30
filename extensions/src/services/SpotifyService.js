/**
 * SpotifyService.js
 * Frontend service for all Spotify interactions.
 *
 * During Vite dev, all /spotify/* requests are proxied to http://localhost:5000
 * by vite.config.js — no CORS issues, no hardcoded ports in fetch calls.
 *
 * connectSpotify() is the only exception: it must open the backend URL directly
 * in a new window because OAuth redirects cannot go through the Vite proxy
 * (the browser needs to follow the 302 to accounts.spotify.com itself).
 * The backend URL is read from VITE_SERVER_URL so it's configurable.
 */

// Base path for all proxied API calls — Vite rewrites /spotify/* → localhost:5000/spotify/*
const BASE = "/spotify";

// Direct backend URL used only for the OAuth popup window.
// Set VITE_SERVER_URL in extensions/.env if your backend runs on a different port.
const SERVER_URL = import.meta.env.VITE_SERVER_URL ?? "http://localhost:5000";

// ── connectSpotify ────────────────────────────────────────────────────────────
/**
 * Opens the Spotify OAuth consent screen in a small popup window.
 * The popup auto-closes after successful authentication.
 * The extension popup itself stays open.
 */
export function connectSpotify() {
    const loginUrl = `${SERVER_URL}/spotify/login`;

    window.open(
        loginUrl,
        "spotify-auth",                          // named window — reuses the same popup if called twice
        "width=500,height=700,left=200,top=100"
    );
}

// ── playMusic ─────────────────────────────────────────────────────────────────
/**
 * Resume or start playback on the user's active Spotify device.
 *
 * @param {string} [contextUri]
 *   Optional Spotify context URI to play a specific playlist or album.
 *   Example: "spotify:playlist:37i9dQZF1DX8Uebhn9wzrS"
 *   If omitted, resumes whatever was last playing.
 *
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function playMusic(contextUri) {
    try {
        const body = contextUri
            ? JSON.stringify({ context_uri: contextUri })
            : "{}";

        const res = await fetch(`${BASE}/play`, {
            method:  "PUT",
            headers: { "Content-Type": "application/json" },
            body,
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            console.error("playMusic error:", data);
            return { success: false, error: data.error ?? `HTTP ${res.status}` };
        }

        return { success: true, message: data.message ?? "Playing" };
    } catch (err) {
        console.error("playMusic network error:", err);
        return { success: false, error: "Could not reach the server." };
    }
}

// ── pauseMusic ────────────────────────────────────────────────────────────────
/**
 * Pause playback on the user's active Spotify device.
 *
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function pauseMusic() {
    try {
        const res = await fetch(`${BASE}/pause`, {
            method:  "PUT",
            headers: { "Content-Type": "application/json" },
            body:    "{}",   // send empty JSON body — required for PUT endpoints
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            console.error("pauseMusic error:", data);
            return { success: false, error: data.error ?? `HTTP ${res.status}` };
        }

        return { success: true, message: data.message ?? "Paused" };
    } catch (err) {
        console.error("pauseMusic network error:", err);
        return { success: false, error: "Could not reach the server." };
    }
}

// ── getCurrentSong ────────────────────────────────────────────────────────────
/**
 * Get the currently playing track from Spotify.
 *
 * @returns {Promise<{
 *   connected: boolean,
 *   playing:   boolean,
 *   track:     string | null,
 *   artist:    string | null,
 *   album:     string | null,
 *   albumArt:  string | null,
 *   progress:  number,
 *   duration:  number,
 *   message?:  string,
 *   error?:    string
 * }>}
 */
export async function getCurrentSong() {
    try {
        const res  = await fetch(`${BASE}/current`);
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            return {
                connected: false,
                playing:   false,
                error:     data.error ?? `HTTP ${res.status}`,
            };
        }

        return data;
    } catch (err) {
        console.error("getCurrentSong network error:", err);
        return { connected: false, playing: false, error: "Could not reach the server." };
    }
}

// ── getStatus ─────────────────────────────────────────────────────────────────
/**
 * Alias for getCurrentSong.
 * Use this to check connection state before rendering playback controls.
 *
 * @returns {Promise<ReturnType<typeof getCurrentSong>>}
 */
export async function getStatus() {
    return getCurrentSong();
}
