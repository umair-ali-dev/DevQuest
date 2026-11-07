import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://devquest-hk6l.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;