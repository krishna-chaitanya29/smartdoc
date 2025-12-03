// src/config.js
// If we are on localhost, use localhost. If deployed, use the environment variable.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";