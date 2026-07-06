import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext.jsx";
import toast from "react-hot-toast";
import { useEffect } from "react";

const ADMIN_SLUG = import.meta.env.VITE_ADMIN_SLUG || "/secure-panel-x9k2";

/**
 * Route guard wrapper for secure pages in the CMS.
 * Redirects to admin login if not logged in.
 * Restricts access to superadmin pages if the admin's role is editor.
 */
export default function ProtectedAdminRoute({ children, requireSuperadmin = false }) {
  const { admin, loading, isAuthenticated } = useAdminAuth();

  useEffect(() => {
    if (!loading && isAuthenticated && requireSuperadmin && admin?.role !== "superadmin") {
      toast.error("Not authorized for this section");
    }
  }, [loading, isAuthenticated, requireSuperadmin, admin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBF5]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F5A623]"></div>
      </div>
    );
  }

  // Redirect to secure login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={`${ADMIN_SLUG}/login`} replace />;
  }

  // Check superadmin permissions
  if (requireSuperadmin && admin?.role !== "superadmin") {
    return <Navigate to={`${ADMIN_SLUG}/leads`} replace />;
  }

  return children;
}
