// src/utils/axiosInstance.js

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://backend-b8mw.onrender.com/api/v1", // Your backend base URL
  withCredentials: true, // So cookies are sent with requests
});

// Add token to all requests automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
