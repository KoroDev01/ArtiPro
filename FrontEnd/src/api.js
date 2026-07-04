import axios from "axios";
import { authHeaders, getToken } from "./utils/authStorage";

const configured = import.meta.env.VITE_API_URL?.trim();
export const API_BASE = configured || "/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
