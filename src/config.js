// server URL configuration
// In production (Vercel Frontend + Render Backend)

const isProduction = import.meta.env.PROD;

export const API_BASE_URL = isProduction
    ? "https://vercel-backend-1-srdz.onrender.com"
    : "http://localhost:5000";
