import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiAward, FiUsers } from "react-icons/fi";
import api from "../hooks/api.js";
import Layout from "../components/Layout.jsx";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
  },
};

export default function Home() {
  const [settings, setSettings] = useState({
    tagline: "You Dream it, We Build it. Quality + Time = Aditya",
    aboutUsShort: "Aditya Builders is a trusted construction and real estate company based in Bhavnagar, Gujarat, with over 15 years of experience delivering quality homes and commercial spaces.",
    yearsOfExperience: 15,
    happyCustomers: 1000,
    projectsCompleted: 0,
  });
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsRes, projectsRes, testimonialsRes] = await Promise.all([
          api.get("/settings"),
          api.get("/projects"),
          api.get("/testimonials?featured=true"),
        ]);

        if (settingsRes.data?.success) setSettings(settingsRes.data.data);
        if (projectsRes.data?.success) setProjects(projectsRes.data.data.filter(p => p.isFeatured).slice(0, 3));
        if (testimonialsRes.data?.success) setTestimonials(testimonialsRes.data.data);
      } catch (err) {
        console.error("Error loading home page data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <Layout>
      {/* ─── Hero Section ────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center bg-[#FFFBF5] overflow-hidden py-16">
        {/* Soft background glow circles */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-100/50 blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-orange-100/30 blur-3xl -z-10 -translate-x-1/4 translate-y-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col text-left"
          >
            {/* Tagline Badge */}
            <motion.div variants={fadeInUp}>
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-[#F5A623]/10 text-[#E8871E] border border-[#F5A623]/25 mb-6 uppercase tracking-wider">
                ✦ Leading Builder in Bhavnagar
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 font-display text-[#2E2A26] leading-[1.1]"
            >
              Building Your Dreams With{" "}
              <span className="text-[#F5A623] relative">
                Quality & Trust
                <span className="absolute bottom-1 left-0 w-full h-2 bg-amber-200/40 -z-10 rounded" />
              </span>
            </motion.h1>

            {/* Tagline Concept */}
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl font-medium text-[#E8871E] mb-4 font-display"
            >
              {settings.tagline}
            </motion.p>

            {/* Description */}
            <motion.p
              variants={fadeInUp}
              className="text-base text-[#6B625A] mb-8 max-w-lg leading-relaxed"
            >
              {settings.aboutUsShort}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Link
                to="/projects"
                className="btn-primary flex items-center justify-center gap-2 group px-7 py-3.5 shadow-md shadow-amber-500/10"
              >
                Explore Projects
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="btn-outline flex items-center justify-center gap-2 px-7 py-3.5"
              >
                Contact Us
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Image / Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative lg:h-[500px] flex items-center justify-center"
          >
            <div className="relative w-full max-w-[500px] aspect-[4/3] sm:aspect-square lg:h-full rounded-2xl overflow-hidden shadow-card border-4 border-white bg-amber-50">
              <img
                src="https://picsum.photos/seed/adityabuilders/800/800"
                alt="Aditya Builders Construction"
                className="w-full h-full object-cover brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white text-left">
                <p className="text-xs uppercase tracking-wider font-semibold text-amber-300">Latest Delivery</p>
                <h3 className="text-xl font-bold font-display">Shreeji Aaditya, Shivomnagar</h3>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Stats / Milestones Section ──────────────────────────────────────── */}
      <section className="bg-white py-16 border-y border-amber-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {/* Stat Item 1 */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-[#F5A623] mb-4">
                <FiAward className="w-7 h-7" />
              </div>
              <span className="text-4xl font-extrabold font-display text-[#2E2A26]">
                {settings.yearsOfExperience}+ Years
              </span>
              <span className="text-sm font-semibold text-[#6B625A] uppercase tracking-wider mt-1">
                Industry Experience
              </span>
            </div>

            {/* Stat Item 2 */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-[#F5A623] mb-4">
                <FiUsers className="w-7 h-7" />
              </div>
              <span className="text-4xl font-extrabold font-display text-[#2E2A26]">
                {settings.happyCustomers}+
              </span>
              <span className="text-sm font-semibold text-[#6B625A] uppercase tracking-wider mt-1">
                Happy Customers
              </span>
            </div>

            {/* Stat Item 3 */}
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-[#F5A623] mb-4">
                <FiCheckCircle className="w-7 h-7" />
              </div>
              <span className="text-4xl font-extrabold font-display text-[#2E2A26]">
                {settings.projectsCompleted || 3}
              </span>
              <span className="text-sm font-semibold text-[#6B625A] uppercase tracking-wider mt-1">
                Signature Realized Projects
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured Projects Section ───────────────────────────────────────── */}
      <section className="py-24 bg-[#FFFBF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E8871E]">Portfolio Overview</span>
            <h2 className="section-title text-[#2E2A26] mt-2">Featured Projects</h2>
            <span className="title-underline mx-auto" />
            <p className="text-[#6B625A]">
              Explore our landmark residential listings in Bhavnagar, showcasing premium styling, structural excellence, and prompt schedules.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F5A623]"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16 text-[#6B625A]">No projects available at the moment.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projects.map((project) => (
                <article key={project._id} className="card group flex flex-col h-full border border-amber-100/30">
                  {/* Project Image */}
                  <div className="relative overflow-hidden aspect-[4/3] bg-amber-50 shrink-0">
                    <img
                      src={project.coverImage?.url || "https://placehold.co/600x450/FAC354/FFFFFF?text=Project"}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur shadow-sm px-3.5 py-1.5 rounded-full text-xs font-bold text-[#E8871E]">
                      {project.status}
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="p-6 flex flex-col flex-grow text-left">
                    <span className="text-xs font-bold text-[#E8871E] uppercase tracking-wider mb-1">
                      {project.type} • {project.configuration}
                    </span>
                    <h3 className="text-xl font-bold font-display text-[#2E2A26] mb-2 group-hover:text-[#F5A623] transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-[#6B625A] mb-4 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="mt-auto pt-4 border-t border-amber-50/50 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-[#6B625A] uppercase block">Starting Price</span>
                        <span className="text-sm font-bold text-[#2E2A26]">{project.startingPrice || "Contact Us"}</span>
                      </div>
                      <Link
                        to={`/projects/${project.slug}`}
                        className="text-xs font-bold text-[#F5A623] hover:text-[#E8871E] flex items-center gap-1 transition-colors"
                      >
                        Details <FiArrowRight />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/projects" className="btn-outline">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Testimonials Section ────────────────────────────────────────────── */}
      <section className="py-24 bg-white border-t border-amber-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E8871E]">Client Voices</span>
            <h2 className="section-title text-[#2E2A26] mt-2">What Our Customers Say</h2>
            <span className="title-underline mx-auto" />
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F5A623]"></div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center text-[#6B625A]">No testimonials featured yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div key={t._id} className="bg-[#FFFBF5] rounded-xl p-8 border border-amber-100/40 text-left shadow-sm flex flex-col justify-between">
                  <div>
                    {/* Stars */}
                    <div className="flex gap-1 mb-4 text-[#F5A623]">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <span key={i} className="text-lg">★</span>
                      ))}
                    </div>
                    <p className="text-sm italic text-[#6B625A] leading-relaxed mb-6">
                      "{t.message}"
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-amber-50">
                    <div className="w-10 h-10 rounded-full bg-amber-200 text-[#E8871E] font-bold flex items-center justify-center text-sm shadow-inner uppercase">
                      {t.customerName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2E2A26] text-sm">{t.customerName}</h4>
                      {t.projectName && (
                        <span className="text-xs text-[#6B625A] block mt-0.5">Purchased flat in {t.projectName}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA Callout Section ─────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-[#F5A623] to-[#E8871E] py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display mb-4 text-white">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-base sm:text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Get in touch with us today. Our sales team will guide you through our ongoing and upcoming residential listings in Bhavnagar.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              to="/contact"
              className="bg-white text-[#E8871E] font-bold px-8 py-3.5 rounded-xl hover:bg-[#FFFBF5] shadow-card hover:scale-105 transition-all cursor-pointer"
            >
              Get Free Consultation
            </Link>
            <a
              href="https://wa.me/919974858500"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-green-700 hover:scale-105 transition-all flex items-center gap-2"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
