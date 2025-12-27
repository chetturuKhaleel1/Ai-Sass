// server URL configuration
// In production (Vercel), this typically points to the same domain (relative path)
// or a specific env var. For now, we'll try relative path if in production, or localhost in dev.

const isProduction = import.meta.env.PROD;

export const API_BASE_URL = isProduction
    ? "" // Empty string means relative path (e.g. /api/...) which works if frontend and backend are on same domain (Vercel)
    : "http://localhost:5000";
