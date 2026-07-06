import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiPhone, FiMapPin, FiCalendar, FiDollarSign, FiGrid, FiArrowLeft } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../hooks/api.js";
import Layout from "../components/Layout.jsx";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    async function fetchProject() {
      try {
        const { data } = await api.get(`/projects/${slug}`);
        if (data.success && data.data) {
          setProject(data.data);
          setFormData((prev) => ({
            ...prev,
            message: `Hello, I am interested in your project: "${data.data.title}". Please send me pricing details, floor plans, and site visit schedules.`,
          }));
        }
      } catch (err) {
        console.error("Error loading project details", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [slug]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        interestedProject: project._id,
        source: "Project Enquiry",
        subject: `Enquiry for ${project.title}`,
      };

      const { data } = await api.post("/inquiries", payload);

      if (data.success) {
        toast.success("Thank you! Your enquiry has been received.");
        // clear inputs except message
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: `Hello, I am interested in your project: "${project.title}". Please send me pricing details, floor plans, and site visit schedules.`,
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Submission failed. Please check inputs.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F5A623]"></div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="section-container text-center py-20">
          <h2 className="text-2xl font-bold font-display text-[#2E2A26] mb-4">Project Not Found</h2>
          <p className="text-[#6B625A] mb-8">The project you are looking for does not exist or has been removed.</p>
          <Link to="/projects" className="btn-primary">
            Back to Projects
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Back button */}
      <div className="bg-white border-b border-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6B625A] hover:text-[#F5A623] transition-colors">
            <FiArrowLeft /> Back to Projects
          </Link>
        </div>
      </div>

      {/* ─── Hero Overview Block ────────────────────────────────────────────── */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Main Cover Image */}
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-card border border-amber-100 bg-amber-50">
            <img
              src={project.coverImage?.url || "https://placehold.co/800x600/FAC354/FFFFFF?text=Project+Cover"}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Quick Specifications Info */}
          <div className="text-left flex flex-col justify-center">
            <span className="inline-block px-3 py-1.5 rounded-full text-xs font-bold bg-[#F5A623]/10 text-[#E8871E] border border-[#F5A623]/25 mb-4 uppercase tracking-wider w-max">
              {project.status}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#2E2A26] mb-3">
              {project.title}
            </h1>
            <p className="text-sm text-[#E8871E] font-bold font-display uppercase tracking-widest mb-6">
              {project.type} • {project.configuration}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-amber-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-[#F5A623]">
                  <FiDollarSign />
                </div>
                <div>
                  <span className="text-[10px] text-[#6B625A] uppercase block">Pricing</span>
                  <span className="text-sm font-bold text-[#2E2A26]">{project.startingPrice || "Request Pricing"}</span>
                </div>
              </div>

              {project.possessionDate && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-[#F5A623]">
                    <FiCalendar />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B625A] uppercase block">Possession</span>
                    <span className="text-sm font-bold text-[#2E2A26]">{project.possessionDate}</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-[#F5A623]">
                  <FiMapPin />
                </div>
                <div>
                  <span className="text-[10px] text-[#6B625A] uppercase block">Locality</span>
                  <span className="text-sm font-bold text-[#2E2A26]">{project.location}</span>
                </div>
              </div>

              {project.reraNumber && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-[#F5A623]">
                    <FiGrid />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6B625A] uppercase block">RERA Number</span>
                    <span className="text-sm font-bold text-[#2E2A26]">{project.reraNumber}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Detailed Description & Inquiry ─────────────────────────────────── */}
      <section className="py-20 bg-[#FFFBF5] border-t border-amber-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Description details */}
          <div className="lg:col-span-2 text-left">
            <h2 className="text-2xl font-bold font-display text-[#2E2A26] mb-4">Project Overview</h2>
            <p className="text-base text-[#6B625A] leading-relaxed mb-10 whitespace-pre-line">
              {project.description}
            </p>

            {/* Amenities Grid */}
            {project.amenities && project.amenities.length > 0 && (
              <div className="mb-10">
                <h3 className="text-xl font-bold font-display text-[#2E2A26] mb-6">World-Class Amenities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {project.amenities.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-3 rounded-lg bg-white border border-amber-100/30 text-[#6B625A] text-xs font-semibold shadow-sm">
                      <span className="text-green-500 font-extrabold">✓</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Gallery Images Grid */}
            {project.gallery && project.gallery.length > 0 && (
              <div>
                <h3 className="text-xl font-bold font-display text-[#2E2A26] mb-6">Gallery Showcase</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {project.gallery.map((img, i) => (
                    <div key={i} className="aspect-video rounded-xl overflow-hidden shadow-sm border border-amber-100/30 bg-amber-50">
                      <img src={img.url} alt={`Gallery ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Inquiry Form Card sidebar */}
          <div className="h-max">
            <div className="bg-white border border-amber-100 rounded-xl p-8 shadow-card text-left">
              <h3 className="text-xl font-bold font-display text-[#2E2A26] mb-2">Request Details</h3>
              <p className="text-xs text-[#6B625A] mb-6 leading-relaxed">
                Submit this enquiry form and our sales representatives will contact you shortly with catalog brochures.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-[#6B625A] uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                    className="w-full px-4 py-3 rounded-xl border border-amber-100 focus:outline-none focus:border-[#F5A623] bg-[#FFFBF5]/20 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-[#6B625A] uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    className="w-full px-4 py-3 rounded-xl border border-amber-100 focus:outline-none focus:border-[#F5A623] bg-[#FFFBF5]/20 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-[#6B625A] uppercase tracking-wider mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter mobile number"
                    className="w-full px-4 py-3 rounded-xl border border-amber-100 focus:outline-none focus:border-[#F5A623] bg-[#FFFBF5]/20 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold text-[#6B625A] uppercase tracking-wider mb-2">
                    Custom message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-amber-100 focus:outline-none focus:border-[#F5A623] bg-[#FFFBF5]/20 text-sm resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary justify-center text-sm py-3.5 mt-2"
                >
                  {submitting ? "Sending..." : "Submit Enquiry"}
                </button>
              </form>

              {project.contactNumbers && project.contactNumbers.length > 0 && (
                <div className="mt-6 pt-6 border-t border-amber-50 text-center text-xs text-[#6B625A]">
                  <p className="mb-2">Or call sales executive directly:</p>
                  <div className="flex flex-col gap-1.5">
                    {project.contactNumbers.map((num) => (
                      <a key={num} href={`tel:${num.replace(/\s+/g, "")}`} className="font-bold text-[#E8871E] hover:underline flex items-center justify-center gap-1">
                        <FiPhone /> {num}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
