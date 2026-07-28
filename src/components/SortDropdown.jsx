import {
  ArrowDownAZ,
  ArrowDownWideNarrow,
  Check,
  ChevronDown,
  Tags,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const OPTIONS = [
  { value: "name-asc", label: "Name (A → Z)", icon: ArrowDownAZ },
  { value: "category-asc", label: "Category (A → Z)", icon: Tags },
  {
    value: "quantity-desc",
    label: "Quantity (highest → lowest)",
    icon: ArrowDownWideNarrow,
  },
  {
    value: "quantity-asc",
    label: "Quantity (lowest → highest)",
    icon: ArrowDownWideNarrow,
  },
];

export default function SortDropdown({ sortValue, onChangeSort }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const current = OPTIONS.find((o) => o.value === sortValue) ?? OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="z-20 shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="border-sage-dark/60 text-ink-soft hover:border-forest-light hover:text-forest flex w-full items-center justify-center gap-2 overflow-visible rounded-md border bg-white px-4 py-2 text-sm font-medium shadow-sm transition sm:w-fit sm:items-start"
      >
        <current.icon size={15} strokeWidth={2} />
        <span className="hidden md:inline">Sort by:</span>
        <span className="text-ink">{current.label}</span>
        <ChevronDown
          size={15}
          strokeWidth={2}
          className={`text-ink-faint transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="animate-pop-in border-sage top-92 right-0 z-20 mt-2 w-full origin-top-right overflow-hidden rounded-2xl border bg-white py-1.5 shadow-lg sm:w-fit"
        >
          {OPTIONS.map((option) => {
            const selected = option.value === sortValue;
            return (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChangeSort(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition ${
                    selected
                      ? "bg-sage/50 text-forest-dark font-medium"
                      : "text-ink-soft hover:bg-paper-dim"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <option.icon size={15} strokeWidth={2} />
                    {option.label}
                  </span>
                  {selected && <Check size={15} strokeWidth={2.5} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
