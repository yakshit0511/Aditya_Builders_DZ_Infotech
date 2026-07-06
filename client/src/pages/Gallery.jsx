import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMaximize2 } from "react-icons/fi";
import api from "../hooks/api.js";
import Layout from "../components/Layout.jsx";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const { data } = await api.get("/gallery");
        if (data.success && data.data) {
          setImages(data.data);
        }
      } catch (err) {
        console.error("Error loading gallery images", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, []);

  const categories = [
    "All",
    "Construction Progress",
    "Completed Project",
    "Interior",
    "Exterior",
    "Event",
    "Other",
  ];

  const filteredImages = images.filter((img) => {
    if (filterCategory === "All") return true;
    return img.category === filterCategory;
  });

  return (
    <Layout>
      {/* ─── Page Title Header ───────────────────────────────────────────────── */}
      <section className="bg-gradient-to-tr from-[#FFF6E8] to-[#FFFBF5] border-b border-amber-100 py-16 text-center">
        <div className="section-container">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E8871E]">Media</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-[#2E2A26] mt-2 mb-4">
            Photo Gallery
          </h1>
          <span className="title-underline mx-auto" />
          <p className="text-[#6B625A] max-w-xl mx-auto text-sm leading-relaxed">
            Take a visual tour of our sites in Saurashtra. Filter images by construction progress, completed lobbies, interiors, and exteriors.
          </p>
        </div>
      </section>

      {/* ─── Main Gallery Grid ───────────────────────────────────────────────── */}
      <section className="py-20 bg-[#FFFBF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters Bar */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all ${
                  filterCategory === cat
                    ? "bg-[#F5A623] text-white shadow-md shadow-amber-500/10 scale-105"
                    : "bg-white text-[#6B625A] border border-amber-100/50 hover:bg-amber-50/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F5A623]"></div>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-16 text-[#6B625A]">
              No images available in this category.
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredImages.map((img) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    key={img._id}
                    className="group relative aspect-square rounded-xl overflow-hidden shadow-sm border border-amber-100/20 bg-amber-50 cursor-pointer"
                    onClick={() => setSelectedImage(img)}
                  >
                    <img
                      src={img.image?.url}
                      alt={img.title || "Gallery photo"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Hover mask overlay */}
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-left">
                      <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white mb-auto ml-auto">
                        <FiMaximize2 className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider mb-1 block">
                        {img.category}
                      </span>
                      <h4 className="text-sm font-bold text-white leading-tight font-display truncate">
                        {img.title || "Gallery image"}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* ─── Lightbox Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close trigger */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center rounded-full text-white font-extrabold"
              aria-label="Close"
            >
              <FiX className="w-6 h-6" />
            </button>

            {/* Content modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl max-h-[85vh] flex flex-col items-center select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.image?.url}
                alt={selectedImage.title}
                className="max-w-full max-h-[70vh] rounded-lg object-contain shadow-2xl bg-black/10"
              />
              <div className="mt-6 text-center text-white max-w-xl">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#F5A623] text-white mb-2">
                  {selectedImage.category}
                </span>
                <h3 className="text-xl font-bold font-display text-white">
                  {selectedImage.title || "Gallery photo"}
                </h3>
                {selectedImage.relatedProject && (
                  <p className="text-xs text-[#6B625A] mt-2 block hover:underline">
                    Associated Project:{" "}
                    <a
                      href={`/projects/${selectedImage.relatedProject.slug}`}
                      className="text-[#F5A623] font-bold"
                    >
                      {selectedImage.relatedProject.title}
                    </a>
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
