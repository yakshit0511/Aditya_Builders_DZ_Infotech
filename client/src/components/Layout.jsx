import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX, FiPhone, FiMail, FiMapPin, FiInstagram } from "react-icons/fi";
import api from "../hooks/api.js";

export default function Layout({ children }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState({
    companyName: "Aditya Builders",
    tagline: "You Dream it, We Build it. Quality + Time = Aditya",
    address: "Plot no 3, Shivomnagar, Jewels Circle to RTO Road, Bhavnagar 364004, Gujarat",
    phoneNumbers: ["+91 99748 58500"],
    email: "info@adityabuilders.in",
    instagramUrl: "https://instagram.com/adityabuilders_",
  });

  // Fetch public settings on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data } = await api.get("/settings");
        if (data.success && data.data) {
          setSettings(data.data);
        }
      } catch {
        // Fallback to defaults if API fails
      }
    }
    fetchSettings();
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFBF5] text-[#2E2A26] font-sans">
      {/* ─── Top Bar Info ────────────────────────────────────────────────────── */}
      <div className="bg-[#E8871E] text-white py-2 px-4 hidden md:block border-b border-amber-500/20 text-xs">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <FiPhone className="w-3.5 h-3.5" /> {settings.phoneNumbers[0]}
            </span>
            <span className="flex items-center gap-1.5">
              <FiMapPin className="w-3.5 h-3.5" /> {settings.address.split(",")[1] || "Bhavnagar"}, Gujarat
            </span>
          </div>
          <div>
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-85 flex items-center gap-1 text-white transition-opacity"
            >
              <FiInstagram className="w-3.5 h-3.5" /> @adityabuilders_
            </a>
          </div>
        </div>
      </div>

      {/* ─── Header ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          {/* Logo / Title */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F5A623] to-[#E8871E] flex items-center justify-center text-white font-extrabold text-lg shadow-warm group-hover:scale-105 transition-transform duration-200">
              AB
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight font-display text-[#2E2A26] block leading-none">
                Aditya
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase text-[#F5A623] block mt-0.5">
                Builders
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-semibold tracking-wide transition-colors py-2 border-b-2 hover:text-[#F5A623] ${
                    isActive
                      ? "border-[#F5A623] text-[#F5A623]"
                      : "border-transparent text-[#6B625A] hover:border-amber-200"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#2E2A26] hover:bg-amber-50 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 md:hidden bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="absolute top-20 right-0 w-64 bg-[#FFFBF5] h-[calc(100vh-5rem)] shadow-2xl border-l border-amber-100 flex flex-col p-6 animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-base font-bold py-2 px-3 rounded-lg transition-colors ${
                      isActive ? "bg-amber-100 text-[#E8871E]" : "text-[#2E2A26] hover:bg-amber-50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
            <div className="mt-auto border-t border-amber-100 pt-6 flex flex-col gap-4 text-xs text-[#6B625A]">
              <span className="flex items-center gap-2">
                <FiPhone className="text-[#F5A623]" /> {settings.phoneNumbers[0]}
              </span>
              <span className="flex items-center gap-2">
                <FiMail className="text-[#F5A623]" /> {settings.email}
              </span>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#E8871E] font-semibold"
              >
                <FiInstagram /> Instagram
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ─── Main Content ────────────────────────────────────────────────────── */}
      <main className="flex-grow">{children}</main>

      {/* ─── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-[#2E2A26] text-[#FFFBF5] border-t border-amber-900/10 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Logo / Brand Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#F5A623] to-[#E8871E] flex items-center justify-center text-white font-extrabold text-sm">
                AB
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight font-display text-white block leading-none">
                  Aditya
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-[#F5A623] block mt-0.5">
                  Builders
                </span>
              </div>
            </div>
            <p className="text-[#6B625A] text-sm mb-6 max-w-sm leading-relaxed">
              Quality + Time = Aditya. Creating premium residential & commercial spaces across Bhavnagar, Gujarat with a commitment to trust and excellence for over 15 years.
            </p>
            <div className="flex gap-4">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#3D3732] flex items-center justify-center hover:bg-[#F5A623] transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:pl-12">
            <h3 className="text-white font-bold font-display text-lg mb-6">Quick Links</h3>
            <ul className="flex flex-col gap-3 text-sm">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-[#6B625A] hover:text-[#F5A623] transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Address / Contact details */}
          <div>
            <h3 className="text-white font-bold font-display text-lg mb-6">Contact Us</h3>
            <ul className="flex flex-col gap-4 text-sm text-[#6B625A]">
              <li className="flex items-start gap-3">
                <FiMapPin className="text-[#F5A623] w-5 h-5 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="text-[#F5A623] w-5 h-5 shrink-0" />
                <div>
                  {settings.phoneNumbers.map((num) => (
                    <a key={num} href={`tel:${num.replace(/\s+/g, "")}`} className="block hover:text-white transition-colors">
                      {num}
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-[#F5A623] w-5 h-5 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#3D3732] pt-8 text-center text-xs text-[#6B625A] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Aditya Builders. All rights reserved.</p>
          <p>
            Developed with Quality & Trust in Bhavnagar, Gujarat
          </p>
        </div>
      </footer>
    </div>
  );
}
