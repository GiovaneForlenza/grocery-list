import { ImageOff, Pencil } from "lucide-react";
import { useState } from "react";
import QuantityStepper from "./QuantityStepper";

const formatarPreco = (valor) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number(valor) || 0,
  );

export default function ItemCard({
  item,
  onAlterarQuantidade,
  onAlterarComprar,
  onAlterarComprando,
  onEditar,
}) {
  const [imagemComError, setImagemComError] = useState(false);
  const precisaComprar = !!item.precisa_comprar;
  const comprando = !!item.comprando;

  return (
    <article className="group border-sage relative flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition hover:shadow-md">
      <div className="flex h-60 flex-col flex-nowrap items-center justify-start gap-2 overflow-hidden bg-white p-2">
        <div className="relative h-full w-full flex-1">
          {item.foto_url && !imagemComError ? (
            <div
              style={{ backgroundImage: `url(${item.foto_url})` }}
              className={`h-full w-full bg-contain bg-center bg-no-repeat`}
            ></div>
          ) : (
            <div className="text-ink-faint flex h-full w-full flex-col items-center justify-center gap-1.5">
              <ImageOff size={48} strokeWidth={1.5} />
              <span className="text-[11px]">Sem foto</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => onEditar(item)}
            aria-label={`Editar ${item.nome}`}
            title="Editar item"
            className="border-sage text-ink-soft hover:border-forest-light hover:text-forest absolute top-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border bg-white/90 shadow-sm transition"
          >
            <Pencil size={14} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="perforation flex flex-1 flex-col justify-between gap-3 px-4 pt-3 pb-4">
        <div className="flex flex-col gap-2">
          <div className="top-2 flex w-full flex-wrap gap-1">
            {item.categoria && (
              <span className="bg-paper border-forest/30 text-forest-dark top-2 left-2 rounded-md border px-2 py-1 font-mono text-[10px] font-semibold tracking-widest uppercase">
                {item.categoria}
              </span>
            )}
            {precisaComprar && (
              <span className="bg-brick top-3 right-3 rounded-md px-2 py-1 text-[10px] font-semibold tracking-widest text-white uppercase shadow-sm">
                Comprar
              </span>
            )}
          </div>
          <div className="">
            <h3 className="font-display text-ink line-clamp-2 text-base leading-snug font-semibold">
              {item.nome}
            </h3>
            <p className="text-marigold-dark mt-1 font-mono text-lg font-semibold">
              R${item.preco}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-full w-full flex-col items-center gap-2 sm:flex-row">
            <QuantityStepper
              quantidade={item.quantidade}
              onAlterar={(novoValor) => onAlterarQuantidade(item.id, novoValor)}
            />

            <label
              className={`flex w-full shrink-0 cursor-pointer items-center gap-1.5 rounded-md border px-2 py-2 text-[11px] font-medium transition select-none sm:h-full sm:w-fit ${
                precisaComprar
                  ? "border-brick/40 bg-brick/10 text-brick-dark"
                  : "border-sage text-ink-faint hover:border-brick/40 hover:text-brick-dark"
              }`}
              title="Marcar como item a comprar"
            >
              <input
                type="checkbox"
                checked={precisaComprar}
                onChange={(e) => onAlterarComprar(item.id, e.target.checked)}
                className="accent-brick h-3.5 w-3.5"
              />
              Comprar
            </label>
          </div>
          {precisaComprar && (
            <div className="w-full">
              <label
                className={`flex w-full shrink-0 cursor-pointer items-center gap-1.5 rounded-md border px-2 py-2 text-[11px] font-medium transition select-none ${
                  comprando
                    ? "border-forest-dark/40 bg-forest/10 text-forest-dark"
                    : "border-sage text-ink-faint hover:border-forest/40 hover:text-forest-dark"
                }`}
                title="Marcar como item a comprar"
              >
                <input
                  type="checkbox"
                  checked={comprando}
                  onChange={(e) =>
                    onAlterarComprando(item.id, e.target.checked)
                  }
                  className="accent-forest h-3.5 w-3.5"
                />
                Comprando
              </label>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
