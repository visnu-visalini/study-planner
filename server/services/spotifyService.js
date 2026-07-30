/**
 * spotifyService.js
 * Handles all Spotify OAuth token management and authenticated API calls.
 *
 * Tokens are stored in-process memory — they reset on server restart,
 * which is acceptable for a local dev extension.
 *
 * dotenv is NOT loaded here. server.js loads it first via `import "dotenv/config"`
 * which makes process.env available to every module in the process.
 *
 * Uses Node 22 native fetch — no axios, no node-fetch required.
 */

// ── In-memory token store ─────────────────────────────────────────────────────
const tokenStore = {
    accessToken:  null,   // current OAuth access token
    refreshToken: null,   // long-lived refresh token (persists across access token expiry)
    expiresAt:    0,      // Unix ms timestamp when the access token expires
};

// ── Private helpers ───────────────────────────────────────────────────────────

/**
 * Base64-encode "clientId:clientSecret" for the Spotify token endpoint.
 * Spotify requires Authorization: Basic <base64(clientId:clientSecret)>
 */
function basicAuth() {
    const id     = process.env.SPOTIFY_CLIENT_ID;
    const secret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!id || !secret) {
        throw new Error("SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET is not set in .env");
    }

    return Buffer.from(`${id}:${secret}`).toString("base64");
}

/**
 * Returns true if the stored access token exists and won't expire
 * within the next 30 seconds.
 */
function isTokenFresh() {
    return (
        tokenStore.accessToken !== null &&
        Date.now() < tokenStore.expiresAt - 30_000
    );
}

// ── Token exchange ────────────────────────────────────────────────────────────

/**
 * Exchange a Spotify authorization code for access + refresh tokens.
 * Called once from the /callback route after the user approves OAuth.
 *
 * @param {string} code - The authorization code from Spotify's redirect
 */
export async function exchangeCode(code) {
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
    if (!redirectUri) {
        throw new Error("SPOTIFY_REDIRECT_URI is not set in .env");
    }

    const body = new URLSearchParams({
        grant_type:   "authorization_code",
        code,
        redirect_uri: redirectUri,
    });

    const res = await fetch("https://accounts.spotify.com/api/token", {
        method:  "POST",
        headers: {
            "Authorization": `Basic ${basicAuth()}`,
            "Content-Type":  "application/x-www-form-urlencoded",
        },
        body: body.toString(),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
            `Token exchange failed (${res.status}): ${err.error_description ?? err.error ?? "unknown error"}`
        );
    }

    const data = await res.json();

    tokenStore.accessToken  = data.access_token;
    tokenStore.refreshToken = data.refresh_token;
    tokenStore.expiresAt    = Date.now() + data.expires_in * 1000;

    console.log(`✅ Spotify tokens stored. Access token expires in ${data.expires_in}s.`);
}

// ── Token refresh ─────────────────────────────────────────────────────────────

/**
 * Use the stored refresh token to obtain a new access token.
 * Spotify may or may not return a new refresh token — update it if provided.
 * Throws if no refresh token is stored (user must log in first).
 */
export async function refreshAccessToken() {
    if (!tokenStore.refreshToken) {
        throw new Error("No refresh token stored. User must complete OAuth login first.");
    }

    const body = new URLSearchParams({
        grant_type:    "refresh_token",
        refresh_token: tokenStore.refreshToken,
    });

    const res = await fetch("https://accounts.spotify.com/api/token", {
        method:  "POST",
        headers: {
            "Authorization": `Basic ${basicAuth()}`,
            "Content-Type":  "application/x-www-form-urlencoded",
        },
        body: body.toString(),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
            `Token refresh failed (${res.status}): ${err.error_description ?? err.error ?? "unknown error"}`
        );
    }

    const data = await res.json();

    tokenStore.accessToken = data.access_token;
    tokenStore.expiresAt   = Date.now() + data.expires_in * 1000;

    // Spotify rotates the refresh token in some flows — update if a new one is provided
    if (data.refresh_token) {
        tokenStore.refreshToken = data.refresh_token;
    }

    console.log("🔄 Spotify access token refreshed successfully.");
}

// ── Authenticated fetch with auto-refresh ─────────────────────────────────────

/**
 * Make an authenticated request to the Spotify Web API.
 *
 * - Proactively refreshes the access token if it is stale AND a refresh
 *   token is available (i.e. the user has already logged in).
 * - If Spotify returns 401 despite a seemingly fresh token, refreshes
 *   once and retries the request automatically.
 * - Content-Type is only set to application/json when a body is present,
 *   to avoid sending incorrect headers on GET requests.
 *
 * @param {string} path     - Spotify API path, e.g. "/v1/me/player/play"
 * @param {object} [options] - Standard fetch options (method, body, headers, …)
 * @returns {Promise<Response>}
 */
export async function spotifyFetch(path, options = {}) {
    // Only proactively refresh if the user has already authenticated
    // (i.e. we have a refresh token). If they haven't logged in yet,
    // the route's isAuthenticated() guard will catch it before we get here.
    if (tokenStore.refreshToken && !isTokenFresh()) {
        await refreshAccessToken();
    }

    const url = `https://api.spotify.com${path}`;

    // Build headers: only add Content-Type when there is a body to send.
    // Caller-supplied headers override these defaults.
    function buildHeaders() {
        const headers = {
            "Authorization": `Bearer ${tokenStore.accessToken}`,
        };

        if (options.body !== undefined) {
            headers["Content-Type"] = "application/json";
        }

        // Merge caller-supplied headers last so they can override anything above
        return { ...headers, ...(options.headers ?? {}) };
    }

    const makeRequest = () =>
        fetch(url, {
            ...options,
            headers: buildHeaders(),
        });

    let res = await makeRequest();

    // If Spotify rejects the token, refresh once and retry
    if (res.status === 401) {
        console.warn("⚠️  Spotify returned 401 — refreshing token and retrying...");
        await refreshAccessToken();
        res = await makeRequest();
    }

    return res;
}

// ── Public accessors ──────────────────────────────────────────────────────────

/** Returns the current access token, or null if not authenticated */
export function getToken() {
    return tokenStore.accessToken;
}

/**
 * Returns true if the user has completed OAuth at least once.
 * A refresh token being present means we can always get a new access token.
 */
export function isAuthenticated() {
    return tokenStore.refreshToken !== null;
}
