/**
 * StatusBadge Component
 * Standardizes the design and colors of badges in the dashboard.
 */
export default function StatusBadge({ status = "" }) {
  // Map statuses to appropriate warm tailwind classes
  const getBadgeStyles = () => {
    switch (status) {
      // Leads Inquiry Statuses
      case "New":
        return "bg-amber-100 text-[#E8871E] border border-amber-200";
      case "Contacted":
        return "bg-blue-50 text-blue-600 border border-blue-100";
      case "Closed":
        return "bg-green-50 text-green-600 border border-green-200";

      // Projects Construction Statuses
      case "Ongoing":
        return "bg-orange-50 text-orange-600 border border-orange-200";
      case "Completed":
        return "bg-emerald-50 text-emerald-600 border border-emerald-250";
      case "Upcoming":
        return "bg-purple-50 text-purple-600 border border-purple-200";

      // Fallback
      default:
        return "bg-gray-50 text-gray-600 border border-gray-200";
    }
  };

  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getBadgeStyles()}`}
    >
      {status}
    </span>
  );
}
