import { useState, useEffect } from "react";
import api from "../../hooks/api.js";
import ImageUploadStub from "../components/ImageUploadStub.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiSearch, FiLayers, FiList, FiSave } from "react-icons/fi";

/**
 * AdminGallery Component
 * Manages gallery imagery catalog.
 */
export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Interior");
  const [relatedProject, setRelatedProject] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [publicId, setPublicId] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  // Filter Categories
  const [activeCategory, setActiveCategory] = useState("All");

  // Deletion State
  const [selectedId, setSelectedId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadGalleryData = async () => {
    setLoading(true);
    try {
      const [galRes, projRes] = await Promise.all([
        api.get("/admin/gallery"),
        api.get("/admin/projects"),
      ]);
      if (galRes.data?.success) setImages(galRes.data.data);
      if (projRes.data?.success) setProjects(projRes.data.data);
    } catch {
      toast.error("Failed to load gallery items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGalleryData();
  }, []);

  const handleOpenCreate = () => {
    setTitle("");
    setCategory("Interior");
    setRelatedProject("");
    setImageUrl("");
    setPublicId("");
    setDisplayOrder(0);
    setFormOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!imageUrl) return toast.error("Image file selection is required");

    const payload = {
      title,
      category,
      image: { url: imageUrl, publicId: publicId || `manual/gallery-${Date.now()}` },
      relatedProject: relatedProject || null,
      displayOrder,
    };

    try {
      const { data } = await api.post("/admin/gallery", payload);
      if (data.success) {
        toast.success("Image added to gallery catalog");
        setFormOpen(false);
        loadGalleryData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add image to gallery");
    }
  };

  const handleDeletePrompt = (id) => {
    setSelectedId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      const { data } = await api.delete(`/admin/gallery/${selectedId}`);
      if (data.success) {
        toast.success("Image listing soft-deleted");
        loadGalleryData();
      }
    } catch {
      toast.error("Failed to delete image.");
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setSelectedId(null);
    }
  };

  // Categories list
  const categories = ["All", "Construction Progress", "Completed Project", "Interior", "Exterior", "Event", "Other"];

  // Filter image items
  const filteredImages = images.filter((img) => {
    const matchesCategory = activeCategory === "All" || img.category === activeCategory;
    return matchesCategory;
  });

  return (
    <div className="text-left flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-amber-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-[#2E2A26]">Gallery Manager</h2>
          <p className="text-xs text-[#6B625A] mt-1">Manage project sites, floor plans, and portfolios.</p>
        </div>
        <button
          onClick={formOpen ? () => setFormOpen(false) : handleOpenCreate}
          className="btn-primary flex items-center gap-1.5 text-xs py-2.5 px-4 shadow-sm"
        >
          {formOpen ? "View Grid" : "Add Image"}
        </button>
      </div>

      {formOpen ? (
        /* Create Gallery Form view */
        <form
          onSubmit={handleAddSubmit}
          className="bg-white border border-amber-100 rounded-2xl p-6 shadow-sm flex flex-col gap-5 max-w-2xl"
        >
          <h3 className="text-sm font-bold text-[#2E2A26] border-b border-amber-50 pb-2">
            Add Image to Public Gallery
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title / Caption */}
            <div>
              <label className="block text-xs font-bold text-[#6B625A] uppercase tracking-wider mb-2">
                Image Caption / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master Bedroom View"
                className="w-full px-4 py-2.5 rounded-xl border border-amber-100 focus:outline-none focus:border-[#F5A623] bg-[#FFFBF5]/20 text-xs text-[#2E2A26]"
              />
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-bold text-[#6B625A] uppercase tracking-wider mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-100 focus:outline-none focus:border-[#F5A623] bg-[#FFFBF5]/20 text-xs text-[#2E2A26] font-semibold cursor-pointer"
              >
                <option value="Construction Progress">Construction Progress</option>
                <option value="Completed Project">Completed Project</option>
                <option value="Interior">Interior</option>
                <option value="Exterior">Exterior</option>
                <option value="Event">Event</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Related Project Selection */}
            <div>
              <label className="block text-xs font-bold text-[#6B625A] uppercase tracking-wider mb-2">
                Related Project Listing (Optional)
              </label>
              <select
                value={relatedProject}
                onChange={(e) => setRelatedProject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-amber-100 focus:outline-none focus:border-[#F5A623] bg-[#FFFBF5]/20 text-xs text-[#2E2A26] font-semibold cursor-pointer"
              >
                <option value="">None (Generic Gallery)</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Display Order */}
            <div>
              <label className="block text-xs font-bold text-[#6B625A] uppercase tracking-wider mb-2">
                Display Order Priority
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-amber-100 focus:outline-none bg-[#FFFBF5]/20 font-semibold text-xs"
              />
            </div>
          </div>

          {/* Photo File upload */}
          <div>
            <ImageUploadStub
              label="Select Photo Attachment * "
              value={imageUrl}
              onChange={(url, pId) => {
                setImageUrl(url);
                setPublicId(pId);
              }}
            />
          </div>

          <div className="flex gap-3 pt-3 border-t border-amber-50">
            <button type="submit" className="btn-primary py-2.5 px-5 text-xs">
              Upload Image
            </button>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="py-2.5 px-5 text-xs font-bold border border-amber-200 hover:bg-amber-50/20 text-[#6B625A] rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        /* Grid Images list view */
        <div className="flex flex-col gap-6">
          {/* Category Tabs filters */}
          <div className="flex flex-wrap border-b border-amber-100/50 gap-1.5 pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border ${
                  activeCategory === cat
                    ? "bg-[#F5A623] text-white border-[#F5A623]"
                    : "bg-white text-[#6B625A] border-amber-100/60 hover:bg-amber-50/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-20 bg-white border border-amber-100 rounded-2xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F5A623]"></div>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-20 bg-white border border-amber-100 rounded-2xl text-xs text-[#6B625A] italic">
              No photos found in this category. Upload photos above.
            </div>
          ) : (
            /* Masonry Grid list */
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {filteredImages.map((img) => (
                <div
                  key={img._id}
                  className="relative aspect-square bg-white border border-amber-100 rounded-2xl overflow-hidden group shadow-sm flex flex-col justify-end"
                >
                  <img
                    src={img.image?.url}
                    alt={img.title || "Gallery"}
                    className="w-full h-full object-cover absolute inset-0"
                  />

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end p-2 items-start z-10">
                    <button
                      type="button"
                      onClick={() => handleDeletePrompt(img._id)}
                      className="p-2 bg-red-600 hover:bg-red-750 text-white rounded-xl transition-colors border border-transparent shadow"
                      title="Deactivate / Soft-Delete Photo"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Text details metadata */}
                  <div className="p-3 bg-gradient-to-t from-black/85 via-black/50 to-transparent text-white text-[10px] truncate leading-tight z-10 text-left">
                    <span className="font-bold block truncate">{img.title || "No Caption"}</span>
                    <span className="block opacity-75 mt-0.5 text-[8px] uppercase tracking-wider">
                      {img.category}
                    </span>
                    {img.relatedProject && (
                      <span className="block text-[#FAC354] font-semibold text-[8px] truncate mt-1">
                        🔗 {projects.find((p) => p._id === img.relatedProject)?.title || "Project Linked"}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Confirmation modal before deleting */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Gallery Photo"
        message="Are you sure you want to deactivate (soft-delete) this gallery image? It will be hidden from public portfolio views immediately."
        isLoading={deleting}
      />
    </div>
  );
}
