// src/api.ts
import axios from "axios";
import { useAuthStore } from "./store";

const API = axios.create({
  // Point this to your backend.
  // For local dev, you can skip env and use the fallback.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});

// Attach JWT on every request
API.interceptors.request.use((cfg) => {
  const token = useAuthStore.getState().token;
  if (token) {
    cfg.headers = {
      ...(cfg.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  }
  return cfg;
});

// Optional: auto-logout on 401
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
    }
    return Promise.reject(error);
  }
);

export default API;
