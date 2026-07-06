import { motion } from "framer-motion";

export default function Card({ children, className = "", onClick }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -6, boxShadow: "0 12px 30px -10px rgba(232, 135, 30, 0.12)" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`bg-white border border-amber-100/50 rounded-2xl p-6 shadow-sm ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
