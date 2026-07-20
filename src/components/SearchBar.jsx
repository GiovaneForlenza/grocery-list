import { X } from "lucide-react";

export default function SearchBar({ valor, onChangeSearch }) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        value={valor}
        onChange={(e) => onChangeSearch(e.target.value)}
        placeholder="Buscar produto…"
        aria-label="Buscar produto"
        className="campo-input w-full bg-white! pr-8 pl-9"
      />
      {valor && (
        <button
          type="button"
          onClick={() => onChangeSearch("")}
          aria-label="Limpar busca"
          className="text-ink-faint hover:text-ink absolute top-1/2 right-2.5 -translate-y-1/2"
        >
          <X size={15} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
