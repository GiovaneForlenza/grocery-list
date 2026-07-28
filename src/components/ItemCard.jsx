import { ImageOff, Pencil } from "lucide-react";
import { useState } from "react";
import QuantityStepper from "./QuantityStepper";

const formatPrice = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    Number(value) || 0,
  );

export default function ItemCard({
  item,
  onChangeQuantity,
  onToggleNeedsPurchase,
  onToggleIsPurchasing,
  onEdit,
}) {
  const [imageError, setImageError] = useState(false);
  const needsPurchase = !!item.needs_purchase;
  const isPurchasing = !!item.is_purchasing;

  return (
    <article className="group border-sage relative flex flex-col overflow-hidden rounded-sm bg-white shadow-sm transition hover:shadow-md">
      <div className="flex h-60 flex-col flex-nowrap items-center justify-start gap-2 overflow-hidden bg-white p-2">
        <div className="relative h-full w-full flex-1">
          {item.photo_url && !imageError ? (
            <div
              style={{ backgroundImage: `url(${item.photo_url})` }}
              className={`h-full w-full bg-contain bg-center bg-no-repeat`}
            ></div>
          ) : (
            <div className="text-ink-faint flex h-full w-full flex-col items-center justify-center gap-1.5">
              <ImageOff size={48} strokeWidth={1.5} />
              <span className="text-[11px]">No photo</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => onEdit(item)}
            aria-label={`Edit ${item.name}`}
            title="Edit item"
            className="border-sage text-ink-soft hover:border-forest-light hover:text-forest absolute top-1 right-1 flex h-8 w-8 items-center justify-center rounded-full border bg-white/90 shadow-sm transition"
          >
            <Pencil size={14} strokeWidth={2} />
          </button>
        </div>
        <div className="top-2 flex w-full flex-wrap gap-1">
          {item.category && (
            <span className="bg-paper border-forest/30 text-forest-dark rounded-sm border px-2 py-1 font-mono text-[10px] font-semibold uppercase sm:tracking-widest">
              {item.category}
            </span>
          )}
          {needsPurchase && (
            <span className="bg-brick rounded-sm px-2 py-1 text-[10px] font-semibold tracking-widest text-white uppercase shadow-sm">
              Buy
            </span>
          )}
        </div>
      </div>

      <div className="perforation flex flex-1 flex-col justify-start gap-3 p-2">
        <div className="">
          <h3 className="font-display text-ink line-clamp-2 text-base leading-snug font-semibold">
            {item.name}
          </h3>
          <p className="text-marigold-dark mt-1 font-mono text-lg font-semibold">
            {formatPrice(item.price)}
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-full w-full flex-col items-center gap-2 sm:flex-row">
            <QuantityStepper
              quantity={item.quantity}
              onChange={(newValue) => onChangeQuantity(item.id, newValue)}
            />

            <label
              className={`flex w-full shrink-0 cursor-pointer items-center gap-1.5 rounded-sm border px-2 py-2 text-[11px] font-medium transition select-none sm:h-full sm:w-fit ${
                needsPurchase
                  ? "border-brick/40 bg-brick/10 text-brick-dark"
                  : "border-sage text-ink-faint hover:border-brick/40 hover:text-brick-dark"
              }`}
              title="Mark as an item to buy"
            >
              <input
                type="checkbox"
                checked={needsPurchase}
                onChange={(e) => onToggleNeedsPurchase(item.id, e.target.checked)}
                className="accent-brick h-3.5 w-3.5"
              />
              Buy
            </label>
          </div>
          {needsPurchase && (
            <div className="w-full">
              <label
                className={`flex w-full shrink-0 cursor-pointer items-center gap-1.5 rounded-sm border px-2 py-2 text-[11px] font-medium transition select-none ${
                  isPurchasing
                    ? "border-forest-dark/40 bg-forest/10 text-forest-dark"
                    : "border-sage text-ink-faint hover:border-forest/40 hover:text-forest-dark"
                }`}
                title="Mark as currently in the cart"
              >
                <input
                  type="checkbox"
                  checked={isPurchasing}
                  onChange={(e) =>
                    onToggleIsPurchasing(item.id, e.target.checked)
                  }
                  className="accent-forest h-3.5 w-3.5"
                />
                In cart
              </label>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
