import { Search, X } from "lucide-react";

export default function SearchBar({ valor, onChange }) {
  return (
    <div className="relative w-full">
      {/* <Search
        size={16}
        strokeWidth={2}
        className="text-ink-faint pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
      /> */}
      <input
        type="text"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar produto…"
        aria-label="Buscar produto"
        className="campo-input w-full bg-white! pr-8 pl-9"
      />
      {valor && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Limpar busca"
          className="text-ink-faint hover:text-ink absolute top-1/2 right-2.5 -translate-y-1/2"
        >
          <X size={15} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
