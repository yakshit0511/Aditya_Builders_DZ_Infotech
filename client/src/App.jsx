import { BrowserRouter, Routes, Route } from "react-router-dom";
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

// Admin Panel (hidden)
import AdminPanel from "./admin/AdminPanel.jsx";

const ADMIN_SLUG = import.meta.env.VITE_ADMIN_SLUG || "/secure-panel-x9k2";

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
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

              {/* ── Hidden Admin Panel (no headers/footers layout) ───────────── */}
              <Route path={ADMIN_SLUG} element={<AdminPanel />} />
            </Routes>
          </SiteSettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
