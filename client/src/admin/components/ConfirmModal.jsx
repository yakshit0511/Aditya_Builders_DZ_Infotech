import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle } from "react-icons/fi";

/**
 * ConfirmModal Component
 * Renders a dialog window overlay asking for confirmation before executing an action.
 */
export default function ConfirmModal({
  isOpen = false,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed? This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  isDanger = true,
  isLoading = false,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dark Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#2E2A26]/40 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative bg-white border border-amber-100 rounded-2xl p-6 shadow-2xl max-w-sm w-full text-left"
          >
            <div className="flex gap-4 items-start">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg shadow-sm ${
                  isDanger ? "bg-red-50 text-red-600 border border-red-100" : "bg-amber-50 text-[#E8871E] border border-amber-100"
                }`}
              >
                <FiAlertTriangle />
              </div>
              <div className="flex-grow">
                <h3 className="text-base font-bold font-display text-[#2E2A26] leading-none mb-2">
                  {title}
                </h3>
                <p className="text-xs text-[#6B625A] leading-relaxed">
                  {message}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 mt-6 pt-4 border-t border-amber-50">
              <button
                type="button"
                disabled={isLoading}
                onClick={onClose}
                className="px-4 py-2 border border-amber-200 bg-white hover:bg-amber-50/20 text-[#6B625A] rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={onConfirm}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 ${
                  isDanger
                    ? "bg-red-600 hover:bg-red-700 shadow-red-500/10"
                    : "bg-[#F5A623] hover:bg-[#E8871E] shadow-amber-500/10"
                }`}
              >
                {isLoading ? "Processing..." : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
