import api from "../api.js";

export const authService = {
  // Login user
  login: async (email, password) => {
    const response = await api.post("/users/login", { email, password });

    // Store token in localStorage if login successful
    if (response.success && response.token) {
      const loginData = {
        token: response.token,
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem("loginData", JSON.stringify(loginData));
      localStorage.setItem("token", response.token);
    }

    return response;
  },

  // Register user
  register: async (username, email, password) => {
    const response = await api.post("/users/register", {
      username,
      email,
      password,
    });

    // Auto-login after successful registration
    if (response.success && response.token) {
      const loginData = {
        token: response.token,
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem("loginData", JSON.stringify(loginData));
      localStorage.setItem("token", response.token);
    }

    return response;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem("loginData");
    localStorage.removeItem("token");
    window.location.href = "/";
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    const loginData = localStorage.getItem("loginData");

    if (!token || !loginData) return false;

    try {
      const parsed = JSON.parse(loginData);
      // Check if token exists and is not too old (optional)
      return !!parsed.token;
    } catch (error) {
      return false;
    }
  },

  // Get current token
  getToken: () => {
    return localStorage.getItem("token");
  },

  // Get user info from token (basic decode - not secure, just for UI)
  getCurrentUser: () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      // Basic JWT decode (just for getting user info for UI)
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },
};
