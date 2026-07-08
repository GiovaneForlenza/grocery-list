import { PackageSearch } from "lucide-react";
import ItemCard from "./ItemCard";

export default function ItemGrid({
  itens,
  onAlterarQuantidade,
  onAlterarComprar,
}) {
  if (itens.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-sage-dark/60 bg-white/60 px-6 py-16 text-center">
        <PackageSearch size={30} strokeWidth={1.5} className="text-ink-faint" />
        <p className="font-display text-lg font-medium text-ink">
          Nenhum item encontrado
        </p>
        <p className="max-w-sm text-sm text-ink-faint">
          Ajuste o filtro de categoria ou cadastre um novo item para vê-lo aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
      {itens.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onAlterarQuantidade={onAlterarQuantidade}
          onAlterarComprar={onAlterarComprar}
        />
      ))}
    </div>
  );
}
