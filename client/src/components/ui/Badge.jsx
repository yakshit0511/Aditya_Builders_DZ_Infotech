export default function Badge({ children, status = "default", className = "" }) {
  const baseStyles =
    "px-3 py-1 text-[10px] font-bold uppercase rounded-full border tracking-wider select-none shrink-0 inline-flex items-center justify-center w-max";

  const colorStyles = {
    Ongoing: "bg-amber-50 text-[#E8871E] border-amber-100",
    Completed: "bg-green-50 text-green-600 border-green-100",
    Upcoming: "bg-blue-50 text-[#3B82C4] border-blue-100",
    default: "bg-gray-50 text-[#6B625A] border-gray-150",
  };

  const style = colorStyles[status] || colorStyles.default;

  return <span className={`${baseStyles} ${style} ${className}`}>{children || status}</span>;
}
