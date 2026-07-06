import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiShield, FiHeart } from "react-icons/fi";
import api from "../hooks/api.js";
import Layout from "../components/Layout.jsx";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function About() {
  const [settings, setSettings] = useState({
    aboutUsFull: "Aditya Builders has been shaping the skyline of Bhavnagar, Gujarat for over 15 years. Founded on the twin pillars of Quality and Trust, we have proudly served more than 1,000 happy customers across residential and commercial projects. Our commitment to timely delivery, superior construction standards, and transparent dealings sets us apart in the real estate landscape of Saurashtra.",
    yearsOfExperience: 15,
    happyCustomers: 1000,
  });
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [settingsRes, teamRes] = await Promise.all([
          api.get("/settings"),
          api.get("/team"),
        ]);
        if (settingsRes.data?.success) setSettings(settingsRes.data.data);
        if (teamRes.data?.success) setTeam(teamRes.data.data);
      } catch (err) {
        console.error("Error loading about page data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const values = [
    {
      icon: <FiCheckCircle className="w-6 h-6" />,
      title: "Quality Construction",
      desc: "We use high-grade building materials and adhere strictly to Bureau of Indian Standards (BIS) and local safety codes for structural durability.",
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      title: "Trust & Transparency",
      desc: "Clean land titles, timely delivery guarantees, and no hidden charges. All projects are built in compliance with RERA regulations.",
    },
    {
      icon: <FiHeart className="w-6 h-6" />,
      title: "Customer First",
      desc: "From customizable BHK options during construction to proactive after-sales support, we place customer satisfaction at the heart of our builder decisions.",
    },
  ];

  return (
    <Layout>
      {/* ─── Page Title Header ───────────────────────────────────────────────── */}
      <section className="bg-gradient-to-tr from-[#FFF6E8] to-[#FFFBF5] border-b border-amber-100 py-16 text-center">
        <div className="section-container">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E8871E]">Est. 2009</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-display text-[#2E2A26] mt-2 mb-4">
            About Aditya Builders
          </h1>
          <span className="title-underline mx-auto" />
        </div>
      </section>

      {/* ─── Main About Story Section ───────────────────────────────────────── */}
      <section className="py-20 bg-[#FFFBF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Story Text */}
          <div className="text-left">
            <h2 className="text-3xl font-extrabold font-display text-[#2E2A26] mb-6 leading-tight">
              Crafting Superior Homes and Living Spaces in Bhavnagar
            </h2>
            <p className="text-base text-[#6B625A] mb-6 leading-relaxed whitespace-pre-line">
              {settings.aboutUsFull}
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-amber-100/50">
              <div>
                <span className="text-3xl font-extrabold text-[#F5A623] block">{settings.yearsOfExperience}+ Years</span>
                <span className="text-xs font-semibold text-[#6B625A] uppercase tracking-wider mt-1 block">Experience</span>
              </div>
              <div>
                <span className="text-3xl font-extrabold text-[#F5A623] block">{settings.happyCustomers}+</span>
                <span className="text-xs font-semibold text-[#6B625A] uppercase tracking-wider mt-1 block">Happy Families</span>
              </div>
            </div>
          </div>

          {/* Collateral Images */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-card border-4 border-white bg-amber-50">
              <img
                src="https://picsum.photos/seed/adityateam/800/600"
                alt="Aditya Builders Office Site"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Absolute badge */}
            <div className="absolute -bottom-6 -left-6 bg-white border border-amber-100 p-6 rounded-xl shadow-card hidden sm:block">
              <p className="text-[#E8871E] font-bold font-display text-lg">"Quality + Time = Aditya"</p>
              <p className="text-xs text-[#6B625A] mt-0.5">Our Corporate Tagline</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Core Values Section ─────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-amber-100/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E8871E]">Principles</span>
            <h2 className="section-title text-[#2E2A26] mt-2">Our Core Values</h2>
            <span className="title-underline mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div key={i} className="p-8 rounded-xl bg-[#FFFBF5] border border-amber-100/30 text-left shadow-sm">
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-[#F5A623] mb-6 shadow-sm">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold font-display text-[#2E2A26] mb-3">{v.title}</h3>
                <p className="text-sm text-[#6B625A] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Meet the Team Section ───────────────────────────────────────────── */}
      <section className="py-20 bg-[#FFFBF5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E8871E]">Leadership</span>
            <h2 className="section-title text-[#2E2A26] mt-2">Meet the Team</h2>
            <span className="title-underline mx-auto" />
            <p className="text-[#6B625A]">
              The experienced leaders and site specialists dedicated to realizing your construction plans with excellence.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F5A623]"></div>
            </div>
          ) : team.length === 0 ? (
            <div className="text-center text-[#6B625A]">No team members listed yet.</div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center"
            >
              {team.map((member) => (
                <motion.div
                  key={member._id}
                  variants={fadeInUp}
                  className="card flex flex-col items-center p-6 text-center border border-amber-100/20"
                >
                  {/* Photo */}
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-amber-100/50 bg-amber-50">
                    <img
                      src={member.photo?.url || "https://placehold.co/150/FAC354/FFFFFF?text=Staff"}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-bold font-display text-[#2E2A26]">{member.name}</h3>
                  <span className="text-xs font-semibold text-[#E8871E] uppercase tracking-wider mt-1 mb-4 block">
                    {member.designation}
                  </span>
                  <p className="text-xs text-[#6B625A] leading-relaxed line-clamp-3">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
}
