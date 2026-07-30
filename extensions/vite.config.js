import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
    plugins: [react()],

    server: {
        proxy: {
            /**
             * /api/* → http://localhost:5000/*
             * Strips the /api prefix before forwarding.
             * Used by api.js for all non-Spotify backend calls.
             */
            "/api": {
                target:      "http://localhost:5000",
                changeOrigin: true,
                rewrite:     (path) => path.replace(/^\/api/, ""),
            },

            /**
             * /spotify/* → http://localhost:5000/spotify/*
             * No path rewrite — the backend mounts at /spotify too.
             *
             * Note on OAuth redirects:
             * GET /spotify/login returns a 302 to accounts.spotify.com.
             * Vite's proxy forwards the 302 to the browser, which follows it
             * directly — this is the correct OAuth behavior.
             * connectSpotify() in SpotifyService.js opens this URL via
             * window.open() so the redirect is handled by the browser, not fetch.
             *
             * PUT /spotify/play and PUT /spotify/pause go through this proxy
             * normally — no redirect involved.
             */
            "/spotify": {
                target:       "http://localhost:5000",
                changeOrigin: true,
            },
        },
    },

    build: {
        rollupOptions: {
            input: {
                main:    resolve(__dirname, "index.html"),
                sidebar: resolve(__dirname, "sidebar.html"),
            },
        },
    },
});
