import { X } from "lucide-react";

export default function SearchBar({ value, onChangeSearch }) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={(e) => onChangeSearch(e.target.value)}
        placeholder="Search product…"
        aria-label="Search product"
        className="field-input w-full bg-white! pr-8 pl-9"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChangeSearch("")}
          aria-label="Clear search"
          className="text-ink-faint hover:text-ink absolute top-1/2 right-2.5 -translate-y-1/2"
        >
          <X size={15} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
