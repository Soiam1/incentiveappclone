// frontend/src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://institution-acknowledge-neighbor-peru.trycloudflare.com",
  timeout: 10000,
});

// Automatically attach token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // ✅ using 'token' as stored from login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
