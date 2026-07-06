import { useState } from "react";

/**
 * DataTable Component
 * Provides a standardized tables interface with built-in sorting logic,
 * pagination controls, loading skeletons, and custom formatting supports.
 */
export default function DataTable({
  columns = [], // [{ key, label, sortable: true, render: (row) => ... }]
  data = [],
  loading = false,
  emptyMessage = "No items found.",
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  defaultSortField = "",
  defaultSortOrder = "desc",
}) {
  const [sortField, setSortField] = useState(defaultSortField);
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);

  const handleSort = (field, sortable) => {
    if (!sortable) return;
    const isAsc = sortField === field && sortOrder === "asc";
    const nextOrder = isAsc ? "desc" : "asc";
    setSortField(field);
    setSortOrder(nextOrder);
  };

  // Local sorting if no external sorting callback, or we can just sorting locally
  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0;
    
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;

    if (typeof aVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
  });

  return (
    <div className="bg-white border border-amber-100/70 rounded-2xl overflow-hidden shadow-sm flex flex-col text-left">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-amber-50/40 border-b border-amber-100 text-[#6B625A] font-bold text-xs uppercase tracking-wider">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key, col.sortable)}
                  className={`p-4 font-semibold select-none ${
                    col.sortable ? "cursor-pointer hover:bg-amber-50/80 transition-colors" : ""
                  } ${col.className || ""}`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.label}</span>
                    {col.sortable && sortField === col.key && (
                      <span className="text-[10px] text-[#F5A623]">
                        {sortOrder === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Loading skeletons
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="border-b border-amber-50/50">
                  {columns.map((col) => (
                    <td key={col.key} className="p-4">
                      <div className="h-4 bg-amber-50/60 rounded-md animate-pulse w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-xs text-[#6B625A] font-medium italic">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => (
                <tr
                  key={row._id || index}
                  className="border-b border-amber-50/30 hover:bg-[#FFFBF5]/25 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`p-4 text-[#2E2A26] ${col.cellClassName || ""}`}>
                      {col.render ? col.render(row) : row[col.key] || "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-amber-100 flex items-center justify-between bg-amber-50/20 text-xs">
          <span className="text-[#6B625A] font-medium">
            Page <span className="font-extrabold text-[#2E2A26]">{currentPage}</span> of{" "}
            <span className="font-extrabold text-[#2E2A26]">{totalPages}</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 rounded-lg border border-amber-200 bg-white text-xs font-bold text-[#6B625A] hover:bg-amber-50/50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-3 py-1.5 rounded-lg border border-amber-200 bg-white text-xs font-bold text-[#6B625A] hover:bg-amber-50/50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
