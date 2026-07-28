import { Loader2, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import AddItemModal from "./components/AddItemModal";
import EditItemModal from "./components/EditItemModal";
import Header from "./components/Header";
import ItemGrid from "./components/ItemGrid";
import Toast from "./components/Toast";
import { useCategories } from "./hooks/useCategories";
import { useItems } from "./hooks/useItems";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  const {
    items,
    loading: itemsLoading,
    error: itemsError,
    addItem,
    updateItem,
    deleteItem,
    updateQuantity,
    updateNeedsPurchase,
    updateIsPurchasing,
    finishShopping,
  } = useItems();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    addCategory,
  } = useCategories();

  const [activeCategory, setActiveCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("name-asc");
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2600);
  }

  const filteredItems = useMemo(() => {
    let list = items;
    if (activeCategory === "Needs to buy") {
      list = list.filter((item) => item.needs_purchase);
    } else if (activeCategory !== "All") {
      list = list.filter((item) => item.category === activeCategory);
    }

    const term = search.trim().toLowerCase();
    if (term) {
      list = list.filter((item) => item.name.toLowerCase().includes(term));
    }

    const sorted = [...list];
    switch (sortOrder) {
      case "category-asc":
        sorted.sort((a, b) => {
          const byCategory = a.category.localeCompare(b.category, "en");
          return byCategory !== 0
            ? byCategory
            : a.name.localeCompare(b.name, "en");
        });
        break;
      case "quantity-desc":
        sorted.sort((a, b) => b.quantity - a.quantity);
        break;
      case "quantity-asc":
        sorted.sort((a, b) => a.quantity - b.quantity);
        break;
      case "name-asc":
      default:
        sorted.sort((a, b) => a.name.localeCompare(b.name, "en"));
    }
    return sorted;
  }, [items, activeCategory, search, sortOrder]);

  async function handleChangeQuantity(id, newValue) {
    try {
      await updateQuantity(id, newValue);
    } catch (err) {
      showToast(
        err.message || "Could not update the quantity.",
        "error",
      );
    }
  }

  async function handleToggleNeedsPurchase(id, newValue) {
    try {
      await updateNeedsPurchase(id, newValue);
    } catch (err) {
      showToast(err.message || "Could not update the item.", "error");
    }
  }

  async function handleToggleIsPurchasing(id, newValue) {
    try {
      await updateIsPurchasing(id, newValue);
    } catch (err) {
      showToast(err.message || "Could not update the item.", "error");
    }
  }

  async function handleFinishShopping() {
    try {
      await finishShopping();
      showToast("Items in the cart marked as purchased.");
    } catch (err) {
      showToast(
        err.message || "Could not finish the shopping trip.",
        "error",
      );
    }
  }

  async function handleAddItem(newItem) {
    await addItem(newItem);
    showToast(`"${newItem.name}" added to stock.`);
  }

  async function handleSaveEdit(id, updatedData) {
    await updateItem(id, updatedData);
    showToast(`"${updatedData.name}" updated.`);
  }

  async function handleDeleteItem(id) {
    const item = items.find((i) => i.id === id);
    await deleteItem(id);
    showToast(`"${item?.name ?? "Item"}" removed from stock.`);
  }

  async function handleAddCategory(name) {
    const category = await addCategory(name);
    showToast(`Category "${category.name}" created.`);
    return category;
  }

  const loading = itemsLoading || categoriesLoading;
  const error = itemsError || categoriesError;

  return (
    <div className="bg-paper min-h-screen">
      <Header
        onNewItem={() => setIsAddModalOpen(true)}
        searchValue={search}
        onChangeSearch={setSearch}
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        sortValue={sortOrder}
        onChangeSort={setSortOrder}
      />
      <Toast toast={toast} />
      <ScrollToTop />
      <main className="mx-auto max-w-7xl px-2 py-6 pb-18 sm:px-6 lg:px-8">
        {error && (
          <div className="border-brick/30 bg-brick/10 text-brick-dark mb-5 flex items-start gap-2 rounded-md border px-2 py-3 text-sm">
            <TriangleAlert
              size={17}
              className="mt-0.5 shrink-0"
              strokeWidth={2}
            />
            <span>
              Error connecting to Supabase: {error}. Check your environment
              variables and make sure the <code className="font-mono">items</code>{" "}
              and <code className="font-mono">categories</code> tables exist.
            </span>
          </div>
        )}
        {loading ? (
          <div className="text-ink-faint flex flex-col items-center justify-center gap-3 py-24">
            <Loader2 size={26} className="animate-spin" strokeWidth={2} />
            <p className="text-sm">Loading items…</p>
          </div>
        ) : (
          <ItemGrid
            items={filteredItems}
            activeCategory={activeCategory}
            onChangeQuantity={handleChangeQuantity}
            onToggleNeedsPurchase={handleToggleNeedsPurchase}
            onToggleIsPurchasing={handleToggleIsPurchasing}
            onFinishShopping={handleFinishShopping}
            onEdit={setEditingItem}
          />
        )}
      </main>

      <AddItemModal
        open={isAddModalOpen}
        categories={categories}
        onClose={() => setIsAddModalOpen(false)}
        onAddItem={handleAddItem}
        onAddCategory={handleAddCategory}
      />

      <EditItemModal
        open={!!editingItem}
        item={editingItem}
        categories={categories}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveEdit}
        onDelete={handleDeleteItem}
      />
    </div>
  );
}
