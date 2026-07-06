import { useState, useEffect } from "react";
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../hooks/api.js";
import Layout from "../components/Layout.jsx";

export default function Contact() {
  const [settings, setSettings] = useState({
    address: "Plot no 3, Shivomnagar, Jewels Circle to RTO Road, Bhavnagar 364004, Gujarat",
    phoneNumbers: ["+91 99748 58500"],
    email: "info@adityabuilders.in",
    whatsappNumber: "919974858500",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3705.5298835848245!2d72.1332616!3d21.7597143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395f507b9bbdf167%3A0xe54e3d3fa54e5251!2sRTO%20Office%20Bhavnagar!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
  });
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data } = await api.get("/settings");
        if (data.success && data.data) {
          setSettings(data.data);
        }
      } catch {
        // Fallback to default state
      } finally {
        setLoadingSettings(false);
      }
    }
    fetchSettings();
  }, []);

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
        source: "Website Contact Form",
      };

      const { data } = await api.post("/inquiries", payload);

      if (data.success) {
        toast.success("Thank you! Your inquiry has been submitted successfully.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit. Please check inputs.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* ─── Page Title Header ───────────────────────────────────────────────── */}
      <section className="bg-gradient-to-tr from-[#FFF6E8] to-[#FFFBF5] border-b border-amber-100 py-16 text-center">
        <div className="section-container">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E8871E]">Get In Touch</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-[#2E2A26] mt-2 mb-4">
            Contact Us
          </h1>
          <span className="title-underline mx-auto" />
          <p className="text-[#6B625A] max-w-xl mx-auto text-sm leading-relaxed">
            Have questions about our project layouts, pricing quotes, or booking details? Drop us a message or call our sales team directly.
          </p>
        </div>
      </section>

      {/* ─── Contact Form & Details Section ───────────────────────────────────── */}
      <section className="py-20 bg-[#FFFBF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Details Column */}
          <div className="text-left flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold font-display text-[#2E2A26] mb-6">Our Contact Details</h2>
              <ul className="flex flex-col gap-6">
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-[#F5A623] shrink-0 shadow-sm border border-amber-100/50">
                    <FiMapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2E2A26] text-sm mb-1">Corporate Address</h3>
                    <p className="text-xs text-[#6B625A] leading-relaxed max-w-md">{settings.address}</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-[#F5A623] shrink-0 shadow-sm border border-amber-100/50">
                    <FiPhone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2E2A26] text-sm mb-1">Phone Numbers</h3>
                    <div className="flex flex-col gap-1 text-xs text-[#6B625A] font-medium">
                      {settings.phoneNumbers.map((num) => (
                        <a key={num} href={`tel:${num.replace(/\s+/g, "")}`} className="hover:text-[#F5A623] transition-colors block">
                          {num} (Sales Executive)
                        </a>
                      ))}
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-[#F5A623] shrink-0 shadow-sm border border-amber-100/50">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2E2A26] text-sm mb-1">Email Enquiries</h3>
                    <a href={`mailto:${settings.email}`} className="text-xs text-[#6B625A] font-medium hover:text-[#F5A623] transition-colors">
                      {settings.email}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-[#F5A623] shrink-0 shadow-sm border border-amber-100/50">
                    <FiClock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2E2A26] text-sm mb-1">Office Hours</h3>
                    <p className="text-xs text-[#6B625A]">Monday - Saturday: 9:30 AM to 7:00 PM</p>
                    <p className="text-[10px] text-[#6B625A]/70 mt-0.5">Sunday: Closed</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Google Maps embed iframe */}
            <div className="mt-8 rounded-xl overflow-hidden shadow-card border border-amber-100/50 aspect-video bg-amber-50">
              <iframe
                title="Office Location Map"
                src={settings.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3705.5298835848245!2d72.1332616!3d21.7597143!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395f507b9bbdf167%3A0xe54e3d3fa54e5251!2sRTO%20Office%20Bhavnagar!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"}
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-300"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Form Column */}
          <div>
            <div className="bg-white border border-amber-100 rounded-xl p-8 sm:p-10 shadow-card text-left">
              <h2 className="text-2xl font-bold font-display text-[#2E2A26] mb-2">Send Us a Message</h2>
              <p className="text-xs text-[#6B625A] mb-8 leading-relaxed">
                Fill out the form below, and our team will get back to you within 24 business hours.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-[#6B625A] uppercase tracking-wider mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl border border-amber-100 focus:outline-none focus:border-[#F5A623] bg-[#FFFBF5]/20 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-amber-100 focus:outline-none focus:border-[#F5A623] bg-[#FFFBF5]/20 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-[#6B625A] uppercase tracking-wider mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 99748 58500"
                      className="w-full px-4 py-3 rounded-xl border border-amber-100 focus:outline-none focus:border-[#F5A623] bg-[#FFFBF5]/20 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-bold text-[#6B625A] uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 rounded-xl border border-amber-100 focus:outline-none focus:border-[#F5A623] bg-[#FFFBF5]/20 text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold text-[#6B625A] uppercase tracking-wider mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Type your message details here..."
                    className="w-full px-4 py-3 rounded-xl border border-amber-100 focus:outline-none focus:border-[#F5A623] bg-[#FFFBF5]/20 text-sm resize-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary justify-center text-sm py-3.5 mt-2 flex items-center gap-2"
                >
                  {submitting ? "Sending..." : "Send Message"} <FiSend />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
