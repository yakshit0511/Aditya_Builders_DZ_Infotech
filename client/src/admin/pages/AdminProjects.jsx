import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../hooks/api.js";
import StatusBadge from "../components/StatusBadge.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw, FiSearch, FiStar } from "react-icons/fi";

const ADMIN_SLUG = import.meta.env.VITE_ADMIN_SLUG || "/secure-panel-x9k2";

/**
 * AdminProjects Catalog page
 * Manages construction projects inventory.
 */
export default function AdminProjects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All"); // All, Residential, Commercial
  const [filterStatus, setFilterStatus] = useState("All"); // All, Ongoing, Completed, Upcoming

  // Deactivate project state
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  const loadProjectsList = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/projects");
      if (data.success && data.data) {
        setProjects(data.data);
      }
    } catch {
      toast.error("Failed to load projects inventory catalog.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectsList();
  }, []);

  const handleToggleFeatured = async (id) => {
    try {
      const { data } = await api.patch(`/admin/projects/${id}/feature`);
      if (data.success) {
        toast.success("Project featured state updated");
        // Update local listing
        setProjects((prev) =>
          prev.map((p) => (p._id === id ? { ...p, isFeatured: data.data.isFeatured } : p))
        );
      }
    } catch {
      toast.error("Could not toggle featured project state.");
    }
  };

  const handleDeactivatePrompt = (id) => {
    setSelectedProjectId(id);
    setDeactivateModalOpen(true);
  };

  const handleDeactivateConfirm = async () => {
    setDeactivating(true);
    try {
      const { data } = await api.delete(`/admin/projects/${selectedProjectId}`);
      if (data.success) {
        toast.success("Project deactivated (soft-deleted)");
        // Reload projects
        loadProjectsList();
      }
    } catch {
      toast.error("Failed to deactivate project.");
    } finally {
      setDeactivating(false);
      setDeactivateModalOpen(false);
      setSelectedProjectId(null);
    }
  };

  const handleRestoreProject = async (id) => {
    try {
      const { data } = await api.patch(`/admin/projects/${id}/restore`);
      if (data.success) {
        toast.success("Project listing restored to active status");
        loadProjectsList();
      }
    } catch {
      toast.error("Failed to restore project.");
    }
  };

  // Filter projects list
  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "All" || p.type === filterType || (filterType === "Residential + Commercial" && p.type === "Residential + Commercial");
    const matchesStatus = filterStatus === "All" || p.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="text-left flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-[#2E2A26]">Projects Catalog</h2>
          <p className="text-xs text-[#6B625A] mt-1">Manage constructed real estate assets and pricing listings.</p>
        </div>
        <button
          onClick={() => navigate(`${ADMIN_SLUG}/projects/new`)}
          className="btn-primary flex items-center gap-1.5 text-xs py-2.5 px-4 shadow-sm"
        >
          <FiPlus className="w-4 h-4" /> Add New Project
        </button>
      </div>

      {/* Catalog Filters Controls */}
      <div className="bg-white border border-amber-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full sm:flex-grow">
          <FiSearch className="absolute left-3.5 top-3.5 text-[#6B625A]/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-100 focus:outline-none focus:border-[#F5A623] bg-[#FFFBF5]/20 text-xs text-[#2E2A26]"
          />
        </div>

        {/* Filter Type */}
        <div className="w-full sm:w-48 text-left">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-amber-100 bg-[#FFFBF5]/20 text-xs font-semibold focus:outline-none focus:border-[#F5A623] cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Residential + Commercial">Residential + Commercial</option>
          </select>
        </div>

        {/* Filter Status */}
        <div className="w-full sm:w-48 text-left">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-amber-100 bg-[#FFFBF5]/20 text-xs font-semibold focus:outline-none focus:border-[#F5A623] cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Upcoming">Upcoming</option>
          </select>
        </div>
      </div>

      {/* Projects Grid Table */}
      {loading ? (
        <div className="flex justify-center py-20 bg-white border border-amber-100 rounded-2xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F5A623]"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-white border border-amber-100 rounded-2xl text-xs text-[#6B625A] italic">
          No projects matching the criteria. Add new project listings above.
        </div>
      ) : (
        <div className="bg-white border border-amber-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-amber-50/40 border-b border-amber-100 text-[#6B625A] font-bold text-xs uppercase tracking-wider select-none">
                <th className="p-4">Cover</th>
                <th className="p-4">Title</th>
                <th className="p-4">Type</th>
                <th className="p-4">Starting Price</th>
                <th className="p-4">SB Area</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Featured</th>
                <th className="p-4 text-center">Active</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((p) => {
                const isInactive = !p.isActive;
                return (
                  <tr
                    key={p._id}
                    className={`border-b border-amber-50/50 hover:bg-[#FFFBF5]/20 transition-all ${
                      isInactive ? "opacity-60 bg-gray-50/40" : ""
                    }`}
                  >
                    {/* Cover image thumbnail */}
                    <td className="p-4 shrink-0">
                      <div className="w-12 h-10 rounded-lg overflow-hidden border border-amber-100 bg-amber-50 shrink-0">
                        {p.coverImage?.url ? (
                          <img src={p.coverImage.url} alt={p.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-amber-100/50 text-[8px] text-[#6B625A] font-bold uppercase">
                            No Photo
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title */}
                    <td className="p-4 font-bold text-[#2E2A26]">
                      {p.title}
                      {isInactive && (
                        <span className="ml-2 px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[8px] font-extrabold uppercase">
                          Soft-Deleted
                        </span>
                      )}
                    </td>

                    {/* Type */}
                    <td className="p-4 text-xs text-[#6B625A]">{p.type}</td>

                    {/* Price */}
                    <td className="p-4 text-xs font-semibold text-[#2E2A26]">
                      {p.startingPrice || "-"}
                    </td>

                    {/* SB Area */}
                    <td className="p-4 text-xs text-[#6B625A]">
                      {p.saleableArea?.minSqFt
                        ? p.saleableArea.maxSqFt
                          ? `${p.saleableArea.minSqFt}–${p.saleableArea.maxSqFt} sq.ft`
                          : `${p.saleableArea.minSqFt} sq.ft`
                        : <span className="text-[#B0A89E] italic">—</span>}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <StatusBadge status={p.status} />
                    </td>

                    {/* Featured star toggle */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => !isInactive && handleToggleFeatured(p._id)}
                        disabled={isInactive}
                        className={`text-lg transition-colors p-1 ${
                          p.isFeatured
                            ? "text-[#F5A623] hover:text-[#E8871E]"
                            : "text-gray-300 hover:text-[#F5A623]/70"
                        } disabled:opacity-40`}
                        title={p.isFeatured ? "Featured Project" : "Toggle Featured"}
                      >
                        <FiStar className={`w-5 h-5 ${p.isFeatured ? "fill-[#F5A623]" : ""}`} />
                      </button>
                    </td>

                    {/* Active */}
                    <td className="p-4 text-center text-xs">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          p.isActive
                            ? "bg-green-50 text-green-600 border border-green-200"
                            : "bg-red-50 text-red-600 border border-red-200"
                        }`}
                      >
                        {p.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right flex justify-end gap-2 items-center">
                      <button
                        onClick={() => navigate(`${ADMIN_SLUG}/projects/${p._id}/edit`)}
                        className="p-2 bg-amber-50 hover:bg-amber-100 text-[#E8871E] rounded-lg transition-colors"
                        title="Edit Project"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>

                      {p.isActive ? (
                        <button
                          onClick={() => handleDeactivatePrompt(p._id)}
                          className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          title="Deactivate Listing"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRestoreProject(p._id)}
                          className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                          title="Restore Listing"
                        >
                          <FiRefreshCw className="w-3.5 h-3.5 animate-reverse" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirmation modal before deactivating */}
      <ConfirmModal
        isOpen={deactivateModalOpen}
        onClose={() => setDeactivateModalOpen(false)}
        onConfirm={handleDeactivateConfirm}
        title="Deactivate Project Listing"
        message="Are you sure you want to deactivate (soft-delete) this project? It will be hidden from the public website lists, but you can restore it anytime from the admin panel."
        confirmText="Deactivate Listing"
        isLoading={deactivating}
      />
    </div>
  );
}
