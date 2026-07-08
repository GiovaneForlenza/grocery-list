export default function CategoryFilter({
  categorias,
  categoriaAtiva,
  onSelecionar,
}) {
  const opcoes = ["Todos", "Precisa comprar", ...categorias.map((c) => c.nome)];

  return (
    <div className="scroll-rail -mx-1 flex flex-wrap  gap-2 overflow-x-auto px-1 pb-1">
      {opcoes.map((nome) => {
        const ativo = nome === categoriaAtiva;
        const especial = nome === "Precisa comprar";
        return (
          <button
            key={nome}
            type="button"
            onClick={() => onSelecionar(nome)}
            className={`shrink-0 rounded-full border px-2 py-1 text-xs font-medium tracking-tight transition ${
              ativo
                ? especial
                  ? "border-brick bg-brick text-white shadow-sm"
                  : "border-forest bg-forest text-paper shadow-sm"
                : especial
                  ? "border-brick/40 bg-white text-brick-dark hover:border-brick hover:bg-brick/5"
                  : "border-sage-dark/60 bg-white text-ink-soft hover:border-forest-light hover:text-forest"
            }`}
          >
            {nome}
          </button>
        );
      })}
    </div>
  );
}
