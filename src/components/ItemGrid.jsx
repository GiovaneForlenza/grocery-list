import { PackageSearch, ShoppingCart } from "lucide-react";
import { useMemo } from "react";
import ItemCard from "./ItemCard";

const ABAS_COM_BOTAO = ["Todos", "Precisa comprar"];

export default function ItemGrid({
  itens,
  categoriaAtiva,
  onAlterarQuantidade,
  onAlterarComprar,
  onAlterarComprando,
  onFinalizarCompra,
  onEditar,
}) {
  const existeItemComprando = useMemo(
    () => itens.some((item) => item.comprando),
    [itens],
  );

  const mostrarBotaoFinalizar =
    ABAS_COM_BOTAO.includes(categoriaAtiva) && existeItemComprando;

  function limparListaDeCompra() {
    const confirmar = window.confirm(
      "Marcar os itens do carrinho como comprados? Eles vão sair da lista de compras.",
    );
    if (confirmar) onFinalizarCompra();
  }

  if (itens.length === 0) {
    return (
      <div className="border-sage-dark/60 flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-white/60 px-6 py-16 text-center">
        <PackageSearch size={30} strokeWidth={1.5} className="text-ink-faint" />
        <p className="font-display text-ink text-lg font-medium">
          Nenhum item encontrado
        </p>
        <p className="text-ink-faint max-w-sm text-sm">
          Ajuste o filtro de categoria ou cadastre um novo item para vê-lo aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {mostrarBotaoFinalizar && (
        <button
          type="button"
          onClick={limparListaDeCompra}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-forest bg-forest px-3 py-2 text-sm font-medium text-paper transition hover:bg-forest-dark sm:w-fit"
        >
          <ShoppingCart size={15} strokeWidth={2} />
          Comprei todos os itens
        </button>
      )}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
        {itens.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onAlterarQuantidade={onAlterarQuantidade}
            onAlterarComprar={onAlterarComprar}
            onAlterarComprando={onAlterarComprando}
            onEditar={onEditar}
          />
        ))}
      </div>
    </div>
  );
}
