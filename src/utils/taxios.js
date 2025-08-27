import axios from "axios";

const taxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8999/api",
  timeout: 10000,
});

// Request interceptor
taxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
taxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default taxios;
