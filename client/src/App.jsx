import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SiteSettingsProvider } from "./context/SiteSettingsContext.jsx";

// Public Layout Wrapper
import Layout from "./components/layout/Layout.jsx";

// Public pages
import Home          from "./pages/Home.jsx";
import About         from "./pages/About.jsx";
import Projects      from "./pages/Projects.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import Gallery       from "./pages/Gallery.jsx";
import Contact       from "./pages/Contact.jsx";
import NotFound      from "./pages/NotFound.jsx";

// Admin CMS Components & Routing Layout
import AdminLayout         from "./admin/AdminLayout.jsx";
import ProtectedAdminRoute from "./admin/components/ProtectedAdminRoute.jsx";

// Admin CMS Pages
import AdminLogin        from "./admin/pages/AdminLogin.jsx";
import Leads             from "./admin/pages/Leads.jsx";
import LeadDetail        from "./admin/pages/LeadDetail.jsx";
import AdminProjects     from "./admin/pages/AdminProjects.jsx";
import ProjectForm       from "./admin/pages/ProjectForm.jsx";
import AdminTestimonials from "./admin/pages/AdminTestimonials.jsx";
import AdminGallery      from "./admin/pages/AdminGallery.jsx";
import AdminTeam         from "./admin/pages/AdminTeam.jsx";
import AdminSettings     from "./admin/pages/AdminSettings.jsx";
import AdminUsers        from "./admin/pages/AdminUsers.jsx";

const ADMIN_SLUG = import.meta.env.VITE_ADMIN_SLUG || "/secure-panel-x9k2";

// Component to handle smooth scroll on hash links across routes
function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        // Wait briefly for content rendering
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 120);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [hash, pathname]);

  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToHash />
        <AuthProvider>
          <SiteSettingsProvider>
            {/* Global toast notifications styling */}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  fontFamily: "Outfit, sans-serif",
                  fontSize: "0.875rem",
                  borderRadius: "12px",
                  border: "1px solid #fff3e0",
                  background: "#fffbf5",
                  color: "#2e2a26",
                },
                success: {
                  iconTheme: { primary: "#F5A623", secondary: "#fff" },
                },
              }}
            />

            <Routes>
              {/* ── Public Routes (wrapped in Outlets Layout) ────────────────── */}
              <Route path="/" element={<Layout />}>
                <Route index                   element={<Home />} />
                <Route path="about"            element={<About />} />
                <Route path="projects"         element={<Projects />} />
                <Route path="projects/:slug"   element={<ProjectDetail />} />
                <Route path="gallery"          element={<Gallery />} />
                <Route path="contact"          element={<Contact />} />
                
                {/* Public 404 fallback page */}
                <Route path="*"                element={<NotFound />} />
              </Route>

              {/* ── Hidden Admin Panel (nested layout routes) ───────────────── */}
              <Route path={ADMIN_SLUG} element={<AdminLayout />}>
                {/* Public within admin tree: login page */}
                <Route path="login" element={<AdminLogin />} />

                {/* Secure pages */}
                <Route index element={<ProtectedAdminRoute><Navigate to={`${ADMIN_SLUG}/leads`} replace /></ProtectedAdminRoute>} />
                <Route path="leads" element={<ProtectedAdminRoute><Leads /></ProtectedAdminRoute>} />
                <Route path="leads/:id" element={<ProtectedAdminRoute><LeadDetail /></ProtectedAdminRoute>} />
                
                <Route path="projects" element={<ProtectedAdminRoute><AdminProjects /></ProtectedAdminRoute>} />
                <Route path="projects/new" element={<ProtectedAdminRoute><ProjectForm /></ProtectedAdminRoute>} />
                <Route path="projects/:id/edit" element={<ProtectedAdminRoute><ProjectForm /></ProtectedAdminRoute>} />
                
                <Route path="testimonials" element={<ProtectedAdminRoute><AdminTestimonials /></ProtectedAdminRoute>} />
                <Route path="gallery" element={<ProtectedAdminRoute><AdminGallery /></ProtectedAdminRoute>} />
                <Route path="team" element={<ProtectedAdminRoute><AdminTeam /></ProtectedAdminRoute>} />
                <Route path="settings" element={<ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>} />
                
                {/* Superadmin restricted page */}
                <Route path="admins" element={<ProtectedAdminRoute requireSuperadmin><AdminUsers /></ProtectedAdminRoute>} />

                {/* Catch-all within admin panel, redirect to leads inbox */}
                <Route path="*" element={<Navigate to={`${ADMIN_SLUG}/leads`} replace />} />
              </Route>
            </Routes>
          </SiteSettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
