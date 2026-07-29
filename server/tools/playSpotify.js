import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

export default async function playSpotify(playlistName) {
    const token = process.env.SPOTIFY_ACCESS_TOKEN;
    if (!token) return "❌ Spotify not configured. Add SPOTIFY_ACCESS_TOKEN to .env";

    // Search for playlist
    const searchRes = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(playlistName)}&type=playlist&limit=1`,
        { headers: { "Authorization": `Bearer ${token}` } }
    );

    if (!searchRes.ok) return "❌ Spotify search failed. Check your access token.";

    const searchData = await searchRes.json();
    const playlist = searchData.playlists?.items?.[0];
    if (!playlist) return `❌ No playlist found for "${playlistName}"`;

    // Play it
    await fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ context_uri: playlist.uri })
    });

    return `🎵 Now playing "${playlist.name}" on Spotify. Happy studying!`;
}
