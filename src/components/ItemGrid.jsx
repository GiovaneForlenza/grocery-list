import { PackageSearch, ShoppingCart } from "lucide-react";
import { useMemo } from "react";
import ItemCard from "./ItemCard";

const TABS_WITH_BUTTON = ["All", "Needs to buy"];

export default function ItemGrid({
  items,
  activeCategory,
  onChangeQuantity,
  onToggleNeedsPurchase,
  onToggleIsPurchasing,
  onFinishShopping,
  onEdit,
}) {
  const hasItemInCart = useMemo(
    () => items.some((item) => item.is_purchasing),
    [items],
  );

  const showFinishButton =
    TABS_WITH_BUTTON.includes(activeCategory) && hasItemInCart;

  function clearShoppingList() {
    const confirmed = window.confirm(
      "Mark the items in the cart as purchased? They will be removed from the shopping list.",
    );
    if (confirmed) onFinishShopping();
  }

  if (items.length === 0) {
    return (
      <div className="border-sage-dark/60 flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-white/60 px-6 py-16 text-center">
        <PackageSearch size={30} strokeWidth={1.5} className="text-ink-faint" />
        <p className="font-display text-ink text-lg font-medium">
          No items found
        </p>
        <p className="text-ink-faint max-w-sm text-sm">
          Adjust the search or category filter, or add a new item to see it
          here.
        </p>
      </div>
    );
  }

  return (
    <div className="z-0 flex flex-col gap-4">
      {showFinishButton && (
        <button
          type="button"
          onClick={clearShoppingList}
          className="border-forest bg-forest text-paper hover:bg-forest-dark flex w-full items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition sm:w-fit"
        >
          <ShoppingCart size={15} strokeWidth={2} />
          I bought everything
        </button>
      )}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onChangeQuantity={onChangeQuantity}
            onToggleNeedsPurchase={onToggleNeedsPurchase}
            onToggleIsPurchasing={onToggleIsPurchasing}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
}
