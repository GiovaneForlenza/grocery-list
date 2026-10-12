export default function CategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
}) {
  const options = ["All", "Needs to buy", ...categories.map((c) => c.name)];

  return (
    <div className="scroll-rail -mx-1 flex flex-wrap justify-center gap-2 overflow-x-auto px-1 pb-1 sm:justify-start">
      {options.map((name) => {
        const isActive = name === activeCategory;
        const isSpecial = name === "Needs to buy";
        return (
          <button
            key={name}
            type="button"
            onClick={() => onSelectCategory(name)}
            className={`shrink-0 cursor-pointer rounded-md border px-2 py-1 text-xs font-medium tracking-tight transition ${
              isActive
                ? isSpecial
                  ? "border-brick bg-brick text-white shadow-sm"
                  : "border-forest bg-forest text-paper shadow-sm"
                : isSpecial
                  ? "border-brick/40 text-brick-dark hover:border-brick hover:bg-brick/5 bg-white"
                  : "border-sage-dark/60 text-ink-soft hover:border-forest-light hover:text-forest bg-white"
            }`}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}
