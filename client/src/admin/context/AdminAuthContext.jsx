import { useAuth } from "../../context/AuthContext.jsx";

// Re-export the AuthProvider as AdminAuthProvider for semantic naming in admin section
export { AuthProvider as AdminAuthProvider } from "../../context/AuthContext.jsx";

/**
 * Custom hook for components in the admin panel to consume session state.
 * Returns { admin, loading, isAuthenticated, login, logout, checkSession }
 */
export function useAdminAuth() {
  return useAuth();
}
