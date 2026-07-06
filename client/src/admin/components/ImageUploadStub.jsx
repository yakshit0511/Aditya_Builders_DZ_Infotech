import { useState } from "react";
import { FiPlus, FiTrash2, FiImage } from "react-icons/fi";
import toast from "react-hot-toast";

/**
 * ImageUploadStub Component
 * Acts as a placeholder image uploading widget.
 * Since real Cloudinary uploads are wired in Phase 7, this lets administrators
 * preview mock uploads or insert sample URLs for local development.
 */
export default function ImageUploadStub({
  label = "Upload Image",
  value = "",
  onChange, // triggers onChange(imageUrl, publicId)
  description = "Supports JPG, PNG, WEBP (Max 5MB)",
  isMultiple = false,
  galleryValues = [], // when isMultiple is true
  onGalleryChange, // triggers onGalleryChange([{ url, publicId }])
}) {
  const [loading, setLoading] = useState(false);

  // Mock Upload Handler (simulates upload lag and returns a local placeholder)
  const handleUploadMock = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    setLoading(true);
    
    // Simulate API lag
    setTimeout(() => {
      // Create local blob preview url
      const fakeUrl = URL.createObjectURL(file);
      const fakePublicId = `manual/preview-${Date.now()}`;

      setLoading(false);

      if (isMultiple) {
        onGalleryChange([...galleryValues, { url: fakeUrl, publicId: fakePublicId }]);
      } else {
        onChange(fakeUrl, fakePublicId);
      }
      toast.success("Image mock upload completed!");
    }, 800);
  };

  const handleRemoveSingle = () => {
    onChange("", "");
  };

  const handleRemoveGalleryItem = (idxToRemove) => {
    const updated = galleryValues.filter((_, idx) => idx !== idxToRemove);
    onGalleryChange(updated);
  };

  return (
    <div className="flex flex-col gap-2 text-left w-full">
      <label className="block text-xs font-bold text-[#6B625A] uppercase tracking-wider">
        {label}
      </label>

      {/* Multiple Image / Gallery Widget View */}
      {isMultiple ? (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {galleryValues.map((img, idx) => (
              <div
                key={img.publicId || idx}
                className="relative aspect-square rounded-xl overflow-hidden border border-amber-100 bg-amber-50/20 group shadow-sm"
              >
                <img
                  src={img.url}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryItem(idx)}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200"
                >
                  <div className="p-2 bg-red-650 hover:bg-red-700 rounded-lg text-white">
                    <FiTrash2 className="w-4 h-4" />
                  </div>
                </button>
              </div>
            ))}

            {/* Upload Button Grid Cell */}
            <label className="aspect-square border-2 border-dashed border-amber-200 hover:border-[#F5A623] bg-amber-50/10 hover:bg-amber-50/30 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 select-none">
              <FiPlus className="w-5 h-5 text-[#E8871E]" />
              <span className="text-[10px] font-bold text-[#E8871E] uppercase tracking-wide">
                Add Photo
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadMock}
                disabled={loading}
                className="hidden"
              />
            </label>
          </div>
          {loading && (
            <span className="text-[10px] text-[#F5A623] font-bold animate-pulse">
              Simulating file upload...
            </span>
          )}
          <span className="text-[9px] text-[#6B625A]/60">{description}</span>
        </div>
      ) : (
        /* Single Image Upload Widget View */
        <div className="flex items-center gap-4 bg-[#FFFBF5]/30 p-3 rounded-2xl border border-amber-100/50">
          {value ? (
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-amber-100 bg-amber-50 shrink-0 shadow-sm relative group">
              <img src={value} alt="Cover Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={handleRemoveSingle}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-150"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl border-2 border-dashed border-amber-200 bg-amber-50/20 shrink-0 flex flex-col items-center justify-center text-[#6B625A]/45">
              <FiImage className="w-5 h-5" />
            </div>
          )}
          <div className="flex-grow flex flex-col gap-1.5 text-left">
            <div className="flex items-center gap-2">
              <label className="inline-block px-3 py-1.5 rounded-xl bg-amber-50 text-xs font-bold text-[#E8871E] hover:bg-amber-100 transition-colors cursor-pointer select-none">
                Choose File
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadMock}
                  disabled={loading}
                  className="hidden"
                />
              </label>
              {value && (
                <button
                  type="button"
                  onClick={handleRemoveSingle}
                  className="text-xs text-red-500 hover:text-red-700 font-bold"
                >
                  Remove
                </button>
              )}
            </div>
            {loading ? (
              <span className="text-[10px] text-[#F5A623] font-bold animate-pulse">
                Uploading to system...
              </span>
            ) : (
              <span className="text-[9px] text-[#6B625A]/65">{description}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
