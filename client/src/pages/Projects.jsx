import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../hooks/api.js";
import Layout from "../components/Layout.jsx";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data } = await api.get("/projects");
        if (data.success && data.data) {
          setProjects(data.data);
        }
      } catch (err) {
        console.error("Error loading projects list", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const types = ["All", "Residential", "Commercial", "Residential + Commercial"];

  const filteredProjects = projects.filter((p) => {
    if (filterType === "All") return true;
    return p.type === filterType;
  });

  return (
    <Layout>
      {/* ─── Page Title Header ───────────────────────────────────────────────── */}
      <section className="bg-gradient-to-tr from-[#FFF6E8] to-[#FFFBF5] border-b border-amber-100 py-16 text-center">
        <div className="section-container">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E8871E]">Portfolio</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-[#2E2A26] mt-2 mb-4">
            Our Building Projects
          </h1>
          <span className="title-underline mx-auto" />
          <p className="text-[#6B625A] max-w-xl mx-auto text-sm leading-relaxed">
            From affordable apartments to signature commercial centers in Bhavnagar, browse our completed, ongoing, and upcoming developments.
          </p>
        </div>
      </section>

      {/* ─── Main Portfolio Filter Grid ──────────────────────────────────────── */}
      <section className="py-20 bg-[#FFFBF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters Bar */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                  filterType === type
                    ? "bg-[#F5A623] text-white shadow-md shadow-amber-500/10 scale-105"
                    : "bg-white text-[#6B625A] border border-amber-100/50 hover:bg-amber-50/30"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F5A623]"></div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16 text-[#6B625A]">
              No projects found in this category.
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((project) => (
                  <motion.article
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={project._id}
                    className="card group flex flex-col h-full border border-amber-100/30"
                  >
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

                    {/* Details Block */}
                    <div className="p-6 flex flex-col flex-grow text-left">
                      <span className="text-xs font-bold text-[#E8871E] uppercase tracking-wider mb-1">
                        {project.type} • {project.configuration}
                      </span>
                      <h3 className="text-xl font-bold font-display text-[#2E2A26] mb-2 group-hover:text-[#F5A623] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-xs text-[#6B625A] mb-6 line-clamp-3 leading-relaxed">
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
                          View Details
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
