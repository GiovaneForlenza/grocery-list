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
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-sage bg-white shadow-sm transition  hover:shadow-md">
      {/* <span className="tag-eyelet-ring" aria-hidden="true" /> */}

      <div className="aspect-4/3 w-full h-60  overflow-hidden bg-white flex items-center p-4 justify-center">
        {item.foto_url && !imagemComError ? (
          <img
            src={item.foto_url}
            alt={item.nome}
            loading="lazy"
            onError={() => setImagemComError(true)}
            className="  transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-ink-faint">
            <ImageOff size={48} strokeWidth={1.5} />
            <span className="text-[11px]">Sem photo</span>
          </div>
        )}
        <div className="flex absolute w-full top-2 px-2 flex-wrap gap-1">
          {item.categoria && (
            <span className="  bg-paper left-2 top-2  rounded-md border border-forest/30  px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-forest-dark ">
              {item.categoria}
            </span>
          )}

          {precisaComprar && (
            <span className=" right-3 top-3 rounded-md bg-brick px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-white shadow-sm">
              Comprar
            </span>
          )}
        </div>
      </div>

      <div className="perforation flex flex-1 flex-col gap-3 px-4 pb-4 pt-3">
        <div>
          <h3 className="font-display text-base font-semibold leading-snug text-ink line-clamp-2">
            {item.nome}
          </h3>
          <p className="mt-1 font-mono text-lg font-semibold text-marigold-dark">
            {formatarPreco(item.preco)}
          </p>
        </div>

        <div className="mt-auto flex items-center gap-2 flex-col sm:flex-row">
          <QuantityStepper
            quantidade={item.quantidade}
            onAlterar={(novoValor) => onAlterarQuantidade(item.id, novoValor)}
          />

          <label
            className={`flex shrink-0 cursor-pointer select-none items-center gap-1.5 rounded-md border px-2 py-2 text-[11px] font-medium transition sm:h-full w-full sm:w-fit ${
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
              className="h-3.5 w-3.5 accent-brick"
            />
            Comprar
          </label>
        </div>
      </div>
    </article>
  );
}
