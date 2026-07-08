import { ImageOff } from "lucide-react";
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
}) {
  const [imagemComError, setImagemComError] = useState(false);
  const precisaComprar = !!item.comprar;

  return (
    <article className="group border-sage relative flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm transition hover:shadow-md">
      {/* <span className="tag-eyelet-ring" aria-hidden="true" /> */}

      <div className="flex aspect-4/3 h-60 w-full flex-col items-center justify-between overflow-hidden border bg-white p-4">
        {item.foto_url && !imagemComError ? (
          <img
            src={item.foto_url}
            alt={item.nome}
            loading="lazy"
            onError={() => setImagemComError(true)}
            className="f-full w-full border transition duration-300"
          />
        ) : (
          <div className="text-ink-faint flex h-full w-full flex-col items-center justify-center gap-1.5">
            <ImageOff size={48} strokeWidth={1.5} />
            <span className="text-[11px]">Sem photo</span>
          </div>
        )}
        <div className="top-2 flex w-full flex-wrap gap-1 border px-2">
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
      </div>

      <div className="perforation flex flex-1 flex-col gap-3 px-4 pt-3 pb-4">
        <div>
          <h3 className="font-display text-ink line-clamp-2 text-base leading-snug font-semibold">
            {item.nome}
          </h3>
          <p className="text-marigold-dark mt-1 font-mono text-lg font-semibold">
            {formatarPreco(item.preco)}
          </p>
        </div>
        <div className="mt-auto flex flex-col items-center gap-2 sm:flex-row">
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
      </div>
    </article>
  );
}
