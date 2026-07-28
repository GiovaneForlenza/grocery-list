import { Loader2, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

const EMPTY_STATE = { name: "", category: "", quantity: "0", price: "" };

export default function EditItemModal({
  item,
  open,
  categories,
  onClose,
  onSave,
  onDelete,
}) {
  const [form, setForm] = useState(EMPTY_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (open && item) {
      setForm({
        name: item.name ?? "",
        category: item.category ?? "",
        quantity: String(item.quantity ?? 0),
        price: String(item.price ?? ""),
      });
      setError(null);
      setConfirmingDelete(false);
      setTimeout(() => firstFieldRef.current?.focus(), 50);
    }
  }, [open, item]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && !confirmingDelete) onClose();
    }
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, confirmingDelete, onClose]);

  if (!open || !item) return null;

  async function submit(e) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError("Enter the item name.");
    if (!form.category) return setError("Select a category.");

    setSubmitting(true);
    try {
      await onSave(item.id, {
        name: form.name.trim(),
        category: form.category,
        quantity: Number(form.quantity) || 0,
        price: Number(form.price) || 0,
      });
      onClose();
    } catch (err) {
      setError(err.message || "Could not save the changes.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    setDeleting(true);
    try {
      await onDelete(item.id);
      setConfirmingDelete(false);
      onClose();
    } catch (err) {
      setConfirmingDelete(false);
      setError(err.message || "Could not delete the item.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className="bg-ink/40 fixed inset-0 z-40 flex items-center justify-center px-2 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="animate-pop-in border-sage flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-md border bg-white shadow-xl sm:rounded-3xl">
        <div className="border-sage flex items-center justify-between border-b px-5 py-4">
          <div className="text-forest-dark flex items-center gap-2 text-sm font-medium">
            <Pencil size={15} strokeWidth={2} />
            Edit item
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-ink-faint hover:bg-paper-dim hover:text-ink flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="overflow-y-auto px-3 pt-4 pb-5 sm:px-5">
          {error && (
            <p className="border-brick/30 bg-brick/10 text-brick-dark mb-3 rounded-lg border px-3 py-2 text-sm">
              {error}
            </p>
          )}

          <form onSubmit={submit} className="flex flex-col gap-4">
            <Field label="Title">
              <input
                ref={firstFieldRef}
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                placeholder="E.g.: White rice 5kg"
                className="field-input"
              />
            </Field>

            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="field-input"
              >
                <option value="" disabled>
                  Select…
                </option>
                {categories.map((c) => (
                  <option key={c.id ?? c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Quantity in stock">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.quantity}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, quantity: e.target.value }))
                  }
                  className="field-input font-mono"
                />
              </Field>
              <Field label="Price (R$)">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  placeholder="0.00"
                  className="field-input font-mono"
                />
              </Field>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-forest text-paper hover:bg-forest-dark mt-1 flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting && (
                <Loader2 size={15} className="animate-spin" strokeWidth={2.5} />
              )}
              Save changes
            </button>

            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="text-brick hover:bg-brick/10 flex items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition"
            >
              <Trash2 size={15} strokeWidth={2} />
              Delete product
            </button>
          </form>
        </div>
      </div>

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete product?"
        message={`This will permanently remove "${item.name}" from the inventory. This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        danger
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-ink-faint text-xs font-medium tracking-wide uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}
