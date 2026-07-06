import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { FiArrowRight, FiCheckCircle, FiUsers, FiLayers, FiStar } from "react-icons/fi";
import { getProjects, getTestimonials, getGallery } from "../services/api.js";
import { useSiteSettings } from "../context/SiteSettingsContext.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Loader from "../components/ui/Loader.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import Badge from "../components/ui/Badge.jsx";

// Custom hook to animate number counts smoothly
function useCountUp(target, duration = 1.5, trigger = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const end = parseInt(target, 10);
    if (isNaN(end) || end <= 0) return;
    
    const totalSteps = 60;
    const stepTime = (duration * 1000) / totalSteps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      // Ease out quad
      const current = Math.floor(end * (progress * (2 - progress)));
      setCount(current);

      if (step >= totalSteps) {
        setCount(end);
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target, duration, trigger]);

  return count;
}

export default function Home() {
  const settings = useSiteSettings();
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carousel auto-rotate index
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);

  useEffect(() => {
    async function loadHomeContent() {
      try {
        const [projRes, testRes, gallRes] = await Promise.all([
          getProjects({ isFeatured: true, limit: 3 }),
          getTestimonials({ limit: 5 }),
          getGallery({ limit: 6 }),
        ]);

        if (projRes.data?.success) {
          // Filter to show active and featured projects
          setFeaturedProjects(projRes.data.data.filter(p => p.isFeatured && p.isActive).slice(0, 3));
        }
        if (testRes.data?.success) {
          // Filter approved testimonials
          setTestimonials(testRes.data.data.filter(t => t.isApproved));
        }
        if (gallRes.data?.success) {
          setGalleryImages(gallRes.data.data.slice(0, 6));
        }
      } catch (err) {
        console.error("Failed to load Home view collections:", err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeContent();
  }, []);

  // Auto rotate testimonials
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials]);

  // Framer Motion animation sets
  const heroContainerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.15 },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.215, 0.61, 0.355, 1] },
    },
  };

  return (
    <>
      <Helmet>
        <title>{settings.companyName} | Premium Real Estate & Construction Bhavnagar</title>
        <meta
          name="description"
          content={`Welcome to ${settings.companyName}. ${settings.tagline}. Leading construction company in Bhavnagar, Gujarat with over ${settings.yearsOfExperience} years of experience and ${settings.happyCustomers}+ satisfied customers.`}
        />
      </Helmet>

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[80vh] flex items-center bg-[#FFFBF5] overflow-hidden py-16 text-left">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-amber-100/50 blur-3xl -z-10 translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-orange-100/30 blur-3xl -z-10 -translate-x-1/4 translate-y-1/4" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-start"
          >
            <motion.div variants={fadeInUp}>
              <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-bold bg-[#F5A623]/10 text-[#E8871E] border border-[#F5A623]/25 mb-6 uppercase tracking-wider">
                ✦ Shaping Bhavnagar's Skyline Since 2011
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 font-display text-[#2E2A26] leading-[1.1]"
            >
              Constructing Spaces Built On{" "}
              <span className="text-[#F5A623] relative inline-block">
                Quality & Trust
                <span className="absolute bottom-1.5 left-0 w-full h-2.5 bg-amber-200/40 -z-10 rounded-full" />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-[#E8871E] text-lg font-bold font-display tracking-wide mb-6 uppercase"
            >
              {settings.tagline}
            </motion.p>

            <motion.p
              variants={fadeInUp}
              className="text-sm sm:text-base text-[#6B625A] mb-8 leading-relaxed max-w-xl"
            >
              {settings.aboutUsShort}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Link to="/projects">
                <Button variant="primary">
                  Explore Projects <FiArrowRight />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="secondary">Contact Sales</Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Hero Visual Illustration / Placeholder Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5 relative"
          >
            <div className="aspect-[4/3] sm:aspect-square bg-gradient-to-tr from-amber-50 to-orange-100/50 border border-amber-100 rounded-3xl p-4 shadow-sm flex items-center justify-center overflow-hidden">
              <div className="grid grid-cols-2 gap-4 w-full h-full">
                <div className="bg-[#FFFBF5] border border-amber-100 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-4xl">🏗️</span>
                  <h4 className="font-extrabold text-[#2E2A26] text-xs uppercase tracking-wider mt-3">Premium Build</h4>
                </div>
                <div className="bg-[#FFFBF5] border border-amber-100 rounded-2xl flex flex-col items-center justify-center p-6 text-center translate-y-6">
                  <span className="text-4xl">🏢</span>
                  <h4 className="font-extrabold text-[#2E2A26] text-xs uppercase tracking-wider mt-3">Modern Layout</h4>
                </div>
                <div className="bg-[#FFFBF5] border border-amber-100 rounded-2xl flex flex-col items-center justify-center p-6 text-center -translate-y-6">
                  <span className="text-4xl">🏡</span>
                  <h4 className="font-extrabold text-[#2E2A26] text-xs uppercase tracking-wider mt-3">Vastu Compliant</h4>
                </div>
                <div className="bg-[#FFFBF5] border border-amber-100 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                  <span className="text-4xl">🔑</span>
                  <h4 className="font-extrabold text-[#2E2A26] text-xs uppercase tracking-wider mt-3">Timely Delivery</h4>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── STATISTICS STRIP ─── */}
      <section className="bg-white border-y border-amber-100 py-12 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-6 text-center md:max-w-4xl md:mx-auto">
            <div>
              <span className="text-3xl sm:text-5xl font-extrabold text-[#E8871E] font-display block">
                {useCountUp(settings.yearsOfExperience)}+
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-[#6B625A] uppercase tracking-wider mt-1 block">
                Years Experience
              </span>
            </div>
            <div>
              <span className="text-3xl sm:text-5xl font-extrabold text-[#E8871E] font-display block">
                {useCountUp(settings.happyCustomers)}+
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-[#6B625A] uppercase tracking-wider mt-1 block">
                Happy Customers
              </span>
            </div>
            <div>
              <span className="text-3xl sm:text-5xl font-extrabold text-[#E8871E] font-display block">
                {useCountUp(settings.projectsCompleted || 5)}+
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-[#6B625A] uppercase tracking-wider mt-1 block">
                Projects Completed
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED PROJECTS SECTION ─── */}
      <section className="py-20 bg-[#FFFBF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Our Signature Creations"
            subtitle="Featured Landmarks"
            align="center"
          />

          {loading ? (
            <Loader size="md" />
          ) : featuredProjects.length === 0 ? (
            <p className="text-sm text-[#6B625A]">Check back soon for our featured projects.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProjects.map((proj) => (
                <Card key={proj._id} className="flex flex-col h-full text-left overflow-hidden">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-amber-50 border border-amber-100/50 mb-5 relative">
                    <img
                      src={proj.coverImage?.url || "https://placehold.co/600x450/F5A623/FFFFFF?text=Aditya+Project"}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge status={proj.status} className="absolute top-3 left-3 shadow-sm" />
                  </div>
                  <h3 className="text-lg font-bold font-display text-[#2E2A26] mb-1">{proj.title}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[#E8871E] mb-3 block">
                    {proj.type} • {proj.configuration}
                  </span>
                  <p className="text-xs text-[#6B625A] leading-relaxed line-clamp-3 mb-5">
                    {proj.description}
                  </p>
                  <div className="mt-auto pt-4 border-t border-amber-50 flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#6B625A]">{proj.location}</span>
                    <Link to={`/projects/${proj.slug}`} className="font-bold text-[#E8871E] hover:underline flex items-center gap-1">
                      Details →
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link to="/projects">
              <Button variant="secondary">View All Projects</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── ABOUT STORY BLOCK ─── */}
      <section className="py-20 bg-white border-y border-amber-100/50 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading
              title="Shaping Landmarks Built on Quality & Trust"
              subtitle="Our Journey"
              align="left"
            />
            <p className="text-sm text-[#6B625A] leading-relaxed mb-6">
              {settings.aboutUsFull}
            </p>
            <div className="flex flex-col gap-3.5 mb-8 text-xs text-[#6B625A]">
              <span className="flex items-center gap-2 font-semibold">
                <FiCheckCircle className="text-[#F5A623]" /> 100% Transparent Dealings
              </span>
              <span className="flex items-center gap-2 font-semibold">
                <FiCheckCircle className="text-[#F5A623]" /> Standard Construction Material Guarantee
              </span>
              <span className="flex items-center gap-2 font-semibold">
                <FiCheckCircle className="text-[#F5A623]" /> Experienced Architects & Engineers
              </span>
            </div>
            <Link to="/about">
              <Button variant="secondary">Learn More About Us</Button>
            </Link>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl bg-amber-50 border border-amber-100 overflow-hidden shadow-sm">
              <img
                src="https://placehold.co/800x600/E8871E/FFFFFF?text=Aditya+Quality+Construction"
                alt="Aditya construction site"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS SLIDER CAROUSEL ─── */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-[#FFFBF5] text-center select-none overflow-hidden">
          <div className="max-w-4xl mx-auto px-4">
            <SectionHeading
              title="Words From Our Homeowners"
              subtitle="Client Reviews"
              align="center"
            />

            <div className="relative h-64 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeReviewIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center max-w-2xl"
                >
                  <div className="flex items-center gap-1.5 text-amber-400 mb-4">
                    {Array.from({ length: testimonials[activeReviewIndex].rating }).map((_, i) => (
                      <FiStar key={i} className="fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-base sm:text-lg italic text-[#6B625A] leading-relaxed mb-6">
                    "{testimonials[activeReviewIndex].message}"
                  </p>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-[#2E2A26]">
                    — {testimonials[activeReviewIndex].customerName}
                    {testimonials[activeReviewIndex].projectName && (
                      <span className="text-[#E8871E] block mt-1 font-semibold text-[10px]">
                        Owner, {testimonials[activeReviewIndex].projectName}
                      </span>
                    )}
                  </h4>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slider navigation dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveReviewIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === activeReviewIndex ? "w-6 bg-[#E8871E]" : "bg-amber-200"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── GALLERY PREVIEW GRID ─── */}
      <section className="py-20 bg-white border-t border-amber-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Glimpses Of Our Work"
            subtitle="Gallery Spotlight"
            align="center"
          />

          {loading ? (
            <Loader size="sm" />
          ) : galleryImages.length === 0 ? (
            <p className="text-xs text-[#6B625A]">Images are being uploaded. Check back soon.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {galleryImages.map((img) => (
                <div key={img._id} className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm bg-amber-50 border border-amber-100">
                  <img
                    src={img.image?.url || "https://placehold.co/400x400/FAC354/FFFFFF?text=Aditya+Build"}
                    alt={img.title || "Gallery Spotlight"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-left">
                    <span className="text-white font-bold text-xs">{img.title || "Aditya Build"}</span>
                    <span className="text-amber-300 text-[9px] uppercase font-bold tracking-wider mt-0.5">{img.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link to="/gallery">
              <Button variant="secondary">View Full Gallery</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA BANNER ─── */}
      <section className="py-20 bg-gradient-to-tr from-[#2E2A26] to-[#47403B] text-white text-center select-none">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display mb-4">
            Ready to Build Your Dream Home?
          </h2>
          <p className="text-xs sm:text-sm text-[#A3988F] leading-relaxed max-w-xl mb-8">
            Consult with our engineering and sales experts today. We'll guide you from initial floor design drafts to final handovers.
          </p>
          <Link to="/contact">
            <Button variant="primary" className="shadow-lg shadow-orange-500/5">
              Get in Touch Today <FiArrowRight />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
