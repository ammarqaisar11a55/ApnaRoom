import axios from "axios";
import { useAuthStore } from "@/store/auth-store";

const RAW_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const NORMALIZED_API_URL = RAW_API_URL.replace(/\/+$/, "");
const API_URL = NORMALIZED_API_URL.endsWith("/api")
  ? NORMALIZED_API_URL
  : `${NORMALIZED_API_URL}/api`;

export const api = axios.create({
  baseURL: API_URL,
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
