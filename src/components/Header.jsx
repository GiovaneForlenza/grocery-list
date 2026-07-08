import { Plus, Tags } from "lucide-react";

export default function Header({ onNovoItem }) {
  return (
    <header className="border-b border-sage bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/75 sticky top-0 z-30">
      <div className="mx-auto flex flex-col sm:flex-row max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest text-marigold-soft">
            <Tags size={18} strokeWidth={2} />
          </span>
          <div className="leading-tight">
            <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              Mercado
            </h1>
            <p className="text-xs text-ink-faint sm:text-sm">
              Controle de estoque
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNovoItem}
          className="w-full sm:w-fit group inline-flex items-center justify-center gap-2 rounded-full bg-forest px-4 py-2.5 text-sm font-medium  text-paper shadow-sm transition hover:bg-forest-dark active:scale-[0.98] sm:px-5"
        >
          <Plus size={17} strokeWidth={2.5} />
          <span className="">Novo item</span>
        </button>
      </div>
    </header>
  );
}
