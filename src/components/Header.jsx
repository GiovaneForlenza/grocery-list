import { Plus, Tags } from "lucide-react";

export default function Header({ onNovoItem }) {
  return (
    <header className="border-sage bg-paper/90 supports-backdrop-filter:bg-paper/75 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="bg-forest text-marigold-soft flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
            <Tags size={18} strokeWidth={2} />
          </span>
          <div className="leading-tight">
            <h1 className="font-display text-ink text-xl font-semibold tracking-tight sm:text-2xl">
              Mercado
            </h1>
            <p className="text-ink-faint text-xs sm:text-sm">
              Controle de estoque
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNovoItem}
          className="group bg-forest text-paper hover:bg-forest-dark inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium shadow-sm transition active:scale-[0.98] sm:w-fit sm:px-5"
        >
          <Plus size={17} strokeWidth={2.5} />
          <span className="">Novo item</span>
        </button>
      </div>
    </header>
  );
}
