import axios from "axios";

// Create configured Axios instance
const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // Send and receive cookies (JWT token)
});

// Response interceptor to handle errors globally (e.g. invalid tokens)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the backend returns 401 Unauthorized, we know the session is invalid.
    // However, do not redirect on auth checks (/admin/auth/me) to prevent loops.
    const isAuthCheck = error.config?.url?.includes("/admin/auth/me");
    if (error.response?.status === 401 && !isAuthCheck) {
      // Invalidate frontend session by triggering a reload or redirect
      // This will be caught by AuthContext
      if (window.handleUnauthorized) {
        window.handleUnauthorized();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
