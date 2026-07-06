export default function Loader({ size = "md", className = "" }) {
  const sizes = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-3",
    lg: "h-16 w-16 border-4",
  };

  return (
    <div className={`flex justify-center items-center py-8 ${className}`}>
      <div
        className={`animate-spin rounded-full border-amber-200 border-t-[#F5A623] ${sizes[size]}`}
      />
    </div>
  );
}

// Inline Skeleton helper for layout blocks loading
export function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-[#FFFBF5] border border-amber-50 rounded-xl ${className}`} />
  );
}
