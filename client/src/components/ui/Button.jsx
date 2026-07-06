import { motion } from "framer-motion";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}) {
  const baseStyles =
    "px-6 py-3.5 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-200 focus:outline-none flex items-center justify-center gap-2 select-none shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-gradient-to-tr from-[#F5A623] to-[#E8871E] text-white hover:shadow-md hover:shadow-orange-500/10 hover:brightness-105 border border-transparent",
    secondary:
      "border border-[#F5A623]/30 text-[#E8871E] bg-white hover:bg-amber-50/40 hover:border-[#F5A623]",
    outline:
      "border border-gray-200 text-[#6B625A] bg-transparent hover:bg-gray-50 hover:text-[#2E2A26]",
    outlineWhite:
      "border border-white/60 text-white bg-transparent hover:bg-white/10 hover:border-white",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
