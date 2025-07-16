import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage or cookies
    const token = localStorage.getItem("token") || null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => {
        return response.data; 
    },
    (error) => {
        // Handle common errors
        if (error.response && error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login"; // Redirect to login on unauthorized
        }

        if (error.response?.status === 403) {
            // Handle forbidden errors
            console.error("Access denied");
        }

        return Promise.reject(error.response?.data) || error.message || "An error occurred";
    }
)

export default api;
