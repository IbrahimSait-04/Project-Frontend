import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://project-backend-qqbo.onrender.com";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

api.interceptors.request.use((config) => {
  const token =
  localStorage.getItem("customerToken") ||
  localStorage.getItem("staffToken") ||
  localStorage.getItem("adminToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
