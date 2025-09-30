// src/services/api.js

import axios from "axios";

const api = axios.create({
  // This uses your deployed URL for production builds
  // and an empty string for local development, which allows the proxy to work.
  baseURL: import.meta.env.PROD ? import.meta.env.VITE_API_URL : "",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
