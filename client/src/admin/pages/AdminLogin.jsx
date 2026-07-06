import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";
import { FiLock } from "react-icons/fi";

const ADMIN_SLUG = import.meta.env.VITE_ADMIN_SLUG || "/secure-panel-x9k2";

/**
 * AdminLogin Component
 * Subtle, low-profile admin access screen.
 */
export default function AdminLogin() {
  const { login, isAuthenticated, loading } = useAdminAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBF5]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F5A623]"></div>
      </div>
    );
  }

  // Redirect immediately if already logged in
  if (isAuthenticated) {
    return <Navigate to={`${ADMIN_SLUG}/leads`} replace />;
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setErrorMessage("");

    const res = await login(email, password);
    setLoggingIn(false);

    if (res.success) {
      navigate(`${ADMIN_SLUG}/leads`, { replace: true });
    } else {
      // Show generic error message to protect details
      setErrorMessage("Invalid credentials");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FFFBF5] px-4">
      <div className="bg-white border border-amber-100/70 rounded-2xl p-8 shadow-card w-full max-w-sm text-left">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#F5A623] flex items-center justify-center text-white text-lg shadow-sm">
            <FiLock />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display text-[#2E2A26] leading-none">
              Admin Access
            </h1>
            <p className="text-[10px] text-[#6B625A] mt-1 font-semibold uppercase tracking-wider">
              Control Panel Sign In
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-150 rounded-xl text-xs text-red-650 font-bold text-center">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-[#6B625A] uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full px-4 py-3 rounded-xl border border-amber-100 focus:outline-none focus:border-[#F5A623] bg-[#FFFBF5]/20 text-sm text-[#2E2A26]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#6B625A] uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-amber-100 focus:outline-none focus:border-[#F5A623] bg-[#FFFBF5]/20 text-sm text-[#2E2A26]"
            />
          </div>

          <button
            type="submit"
            disabled={loggingIn}
            className="w-full btn-primary justify-center text-xs py-3.5 mt-2 shadow-md shadow-amber-500/5 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            {loggingIn ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
