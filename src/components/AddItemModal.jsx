import { Loader2, Package, Tag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const EMPTY_ITEM = {
  name: "",
  category: "",
  quantity: "1",
  price: "",
  photo_url: "",
};

export default function AddItemModal({
  open,
  categories,
  onClose,
  onAddItem,
  onAddCategory,
}) {
  const [tab, setTab] = useState("item");
  const [itemForm, setItemForm] = useState(EMPTY_ITEM);
  const [categoryName, setCategoryName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const firstFieldRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTab("item");
      setItemForm(EMPTY_ITEM);
      setCategoryName("");
      setError(null);
      setTimeout(() => firstFieldRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  async function submitItem(e) {
    e.preventDefault();
    setError(null);

    if (!itemForm.name.trim()) return setError("Enter the item name.");
    if (!itemForm.category) return setError("Select a category.");

    setSubmitting(true);
    try {
      await onAddItem({
        name: itemForm.name.trim(),
        category: itemForm.category,
        quantity: Number(itemForm.quantity) || 0,
        price: Number(itemForm.price) || 0,
        photo_url: itemForm.photo_url.trim() || null,
      });
      onClose();
    } catch (err) {
      setError(err.message || "Could not save the item.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitCategory(e) {
    e.preventDefault();
    setError(null);

    setSubmitting(true);
    try {
      const newCategory = await onAddCategory(categoryName);
      setCategoryName("");
      setItemForm((f) => ({ ...f, category: newCategory.name }));
      setTab("item");
    } catch (err) {
      setError(err.message || "Could not save the category.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="bg-ink/40 fixed inset-0 z-40 flex items-center justify-center px-2 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="animate-pop-in border-sage flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-md border bg-white shadow-xl">
        <div className="border-sage flex items-center justify-between border-b px-5 pt-5">
          <div className="flex w-full flex-col gap-1 sm:flex-row">
            <button
              type="button"
              onClick={() => setTab("item")}
              className={`flex items-center gap-1.5 rounded-md px-3.5 py-2.5 text-sm font-medium transition ${
                tab === "item"
                  ? "border-sage text-forest-dark border border-b bg-white sm:border-b-0"
                  : "text-ink-faint hover:text-ink-soft"
              }`}
            >
              <Package size={15} strokeWidth={2} />
              New item
            </button>
            <button
              type="button"
              onClick={() => setTab("category")}
              className={`flex items-center gap-1.5 rounded-t-md px-3.5 py-2.5 text-sm font-medium transition ${
                tab === "category"
                  ? "border-sage text-forest-dark border border-b bg-white sm:border-b-0"
                  : "text-ink-faint hover:text-ink-soft"
              }`}
            >
              <Tag size={15} strokeWidth={2} />
              New category
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-ink-faint hover:bg-paper-dim hover:text-ink -mt-1 flex h-8 w-16 shrink-0 items-center justify-center rounded-full transition"
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

          {tab === "item" ? (
            <form onSubmit={submitItem} className="flex flex-col gap-4">
              <Field label="Item name">
                <input
                  ref={firstFieldRef}
                  type="text"
                  value={itemForm.name}
                  onChange={(e) =>
                    setItemForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder="E.g.: White rice 5kg"
                  className="field-input"
                />
              </Field>

              <Field label="Category">
                {categories.length === 0 ? (
                  <p className="border-sage-dark/60 bg-paper-dim text-ink-faint rounded-lg border border-dashed px-3 py-2.5 text-sm">
                    No categories registered yet.{" "}
                    <button
                      type="button"
                      onClick={() => setTab("category")}
                      className="text-forest font-medium underline underline-offset-2"
                    >
                      Create one now
                    </button>
                  </p>
                ) : (
                  <select
                    value={itemForm.category}
                    onChange={(e) =>
                      setItemForm((f) => ({ ...f, category: e.target.value }))
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
                )}
              </Field>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Quantity">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={itemForm.quantity}
                    onChange={(e) =>
                      setItemForm((f) => ({ ...f, quantity: e.target.value }))
                    }
                    className="field-input font-mono"
                  />
                </Field>
                <Field label="Price (R$)">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={itemForm.price}
                    onChange={(e) =>
                      setItemForm((f) => ({ ...f, price: e.target.value }))
                    }
                    placeholder="0.00"
                    className="field-input font-mono"
                  />
                </Field>
              </div>

              <Field label="Photo URL (optional)">
                <input
                  type="url"
                  value={itemForm.photo_url}
                  onChange={(e) =>
                    setItemForm((f) => ({ ...f, photo_url: e.target.value }))
                  }
                  placeholder="https://…"
                  className="field-input"
                />
              </Field>

              <SaveButton submitting={submitting} text="Save item" />
            </form>
          ) : (
            <form onSubmit={submitCategory} className="flex flex-col gap-4">
              <Field label="Category name">
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="E.g.: Produce"
                  className="field-input"
                  autoFocus
                />
              </Field>
              <SaveButton submitting={submitting} text="Save category" />
            </form>
          )}
        </div>
      </div>
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

function SaveButton({ submitting, text }) {
  return (
    <button
      type="submit"
      disabled={submitting}
      className="bg-forest text-paper hover:bg-forest-dark mt-1 flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-70"
    >
      {submitting && (
        <Loader2 size={15} className="animate-spin" strokeWidth={2.5} />
      )}
      {text}
    </button>
  );
}
