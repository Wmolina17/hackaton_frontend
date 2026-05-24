/** Backend base URL. Use localhost in the browser (0.0.0.0 is only for server bind). */
export const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

export const WS_URL =
  import.meta.env.VITE_CHATBOT_WS?.replace(/\/$/, "") ||
  API_URL.replace(/^http/, "ws") + "/ws";

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";

export const AUTH_STORAGE_KEY = "medinote:auth";
