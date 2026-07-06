import { motion } from "framer-motion";

export default function SectionHeading({
  title,
  subtitle,
  align = "center",
  className = "",
}) {
  const alignStyles = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`flex flex-col mb-12 ${alignStyles[align]} ${className}`}
    >
      {subtitle && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#E8871E] mb-2 bg-[#F5A623]/10 px-3 py-1 rounded-full border border-[#F5A623]/20">
          {subtitle}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#2E2A26] relative leading-tight">
        {title}
        {align === "center" && (
          <span className="block w-12 h-1 bg-[#F5A623] mx-auto mt-4 rounded-full" />
        )}
      </h2>
    </motion.div>
  );
}
