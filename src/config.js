// Centralized API configuration
// Set VITE_API_BASE_URL in your .env or hosting environment variables
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/client";
