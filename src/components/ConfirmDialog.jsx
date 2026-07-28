import { AlertTriangle, Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  danger = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && !loading) onCancel();
    }
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="bg-ink/50 fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onCancel();
      }}
    >
      <div className="animate-pop-in border-sage w-full max-w-sm rounded-2xl border bg-white p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              danger ? "bg-brick/10 text-brick" : "bg-forest/10 text-forest"
            }`}
          >
            <AlertTriangle size={18} strokeWidth={2} />
          </span>
          <div>
            <h2 className="font-display text-ink text-base font-semibold">
              {title}
            </h2>
            <p className="text-ink-soft mt-1 text-sm">{message}</p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="border-sage-dark/60 text-ink-soft hover:bg-paper-dim rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-70"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-70 ${
              danger
                ? "bg-brick hover:bg-brick-dark"
                : "bg-forest hover:bg-forest-dark"
            }`}
          >
            {loading && (
              <Loader2 size={14} className="animate-spin" strokeWidth={2.5} />
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
