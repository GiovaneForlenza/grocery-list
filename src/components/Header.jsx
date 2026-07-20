import { Filter, Plus, Tags, X } from "lucide-react";
import { useState } from "react";
import CategoryFilter from "./CategoryFilter";
import SearchBar from "./SearchBar";
import SortDropdown from "./SortDropdown";

export default function Header({
  onNovoItem,
  valorSearch,
  onChangeSearch,
  categorias,
  categoriaAtiva,
  onSelecionarCategoria,
  valorOrdenacao,
  onChangeOrdenacao,
}) {
  const [filterOpened, setFilterOpened] = useState(false);
  function toggleFilterOpened() {
    setFilterOpened(!filterOpened);
  }
  return (
    <header className="border-sage bg-paper/90 supports-backdrop-filter:bg-paper sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-2 py-4 sm:flex-col sm:px-6 lg:px-8">
        <div className="flex w-full flex-col gap-3">
          <div className="flex w-full flex-col justify-between gap-3 sm:flex-row">
            <div className="flex justify-center gap-3 sm:justify-start">
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
          <div className="flex w-full items-stretch justify-center gap-2">
            <SearchBar valor={valorSearch} onChangeSearch={onChangeSearch} />
            <div
              className="border-sage-dark flex w-12 items-center justify-center rounded-sm border bg-white"
              onClick={toggleFilterOpened}
            >
              {filterOpened ? <X /> : <Filter />}
            </div>
          </div>
        </div>
        {filterOpened && (
          <div className={`animate-pop-in overflow-hidden transition`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CategoryFilter
                categorias={categorias}
                categoriaAtiva={categoriaAtiva}
                onSelecionarCategoria={onSelecionarCategoria}
              />
              <SortDropdown
                ordenacao={valorOrdenacao}
                onChangeOrdenacao={onChangeOrdenacao}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
