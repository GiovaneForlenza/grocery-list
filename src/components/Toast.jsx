import { CheckCircle2, XCircle } from "lucide-react";

export default function Toast({ toast }) {
  if (!toast) return null;
  const isSuccess = toast.type !== "error";

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div
        className={`animate-toast-in pointer-events-auto flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium shadow-lg ${
          isSuccess
            ? "border-forest-light/40 bg-forest text-paper"
            : "border-brick-dark/40 bg-brick text-white"
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 size={16} strokeWidth={2} />
        ) : (
          <XCircle size={16} strokeWidth={2} />
        )}
        {toast.message}
      </div>
    </div>
  );
}
