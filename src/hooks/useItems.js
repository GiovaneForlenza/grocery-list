import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setItems(data || []);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = useCallback(async (newItem) => {
    const { data, error } = await supabase
      .from("items")
      .insert(newItem)
      .select()
      .single();

    if (error) throw new Error(error.message);

    setItems((prev) => [...prev, data]);
    return data;
  }, []);

  // Optimistic update: changes the UI before the database responds
  // and reverts if the call fails.
  const updateQuantity = useCallback(async (id, newQuantity) => {
    if (newQuantity < 0) return;

    let previousQuantity;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          previousQuantity = item.quantity;
          return { ...item, quantity: newQuantity };
        }
        return item;
      }),
    );

    const { error } = await supabase
      .from("items")
      .update({ quantity: newQuantity })
      .eq("id", id);

    if (error) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: previousQuantity } : item,
        ),
      );
      throw new Error(error.message);
    }
  }, []);

  // Optimistic update for the "needs_purchase" checkbox.
  // Rule: if the item no longer needs to be bought, it also
  // automatically leaves the cart ("is_purchasing" goes back to false).
  const updateNeedsPurchase = useCallback(async (id, newValue) => {
    let previous;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          previous = {
            needs_purchase: item.needs_purchase,
            is_purchasing: item.is_purchasing,
          };
          const updated = { ...item, needs_purchase: newValue };
          if (!newValue) updated.is_purchasing = false;
          return updated;
        }
        return item;
      }),
    );

    const payload = { needs_purchase: newValue };
    if (!newValue) payload.is_purchasing = false;

    const { error } = await supabase.from("items").update(payload).eq("id", id);

    if (error) {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...previous } : item)),
      );
      throw new Error(error.message);
    }
  }, []);

  const updateIsPurchasing = useCallback(async (id, newValue) => {
    let previousValue;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          previousValue = item.is_purchasing;
          return { ...item, is_purchasing: newValue };
        }
        return item;
      }),
    );

    const { error } = await supabase
      .from("items")
      .update({ is_purchasing: newValue })
      .eq("id", id);

    if (error) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_purchasing: previousValue } : item,
        ),
      );
      throw new Error(error.message);
    }
  }, []);

  // Bulk action for the "I bought everything" button: for every item
  // with is_purchasing = true, clear is_purchasing and needs_purchase
  // in a single database call.
  const finishShopping = useCallback(async () => {
    let affectedIds = [];
    let previousValues = new Map();

    setItems((prev) =>
      prev.map((item) => {
        if (item.is_purchasing) {
          affectedIds.push(item.id);
          previousValues.set(item.id, {
            needs_purchase: item.needs_purchase,
            is_purchasing: item.is_purchasing,
          });
          return { ...item, needs_purchase: false, is_purchasing: false };
        }
        return item;
      }),
    );

    if (affectedIds.length === 0) return;

    const { error } = await supabase
      .from("items")
      .update({ needs_purchase: false, is_purchasing: false })
      .in("id", affectedIds);

    if (error) {
      setItems((prev) =>
        prev.map((item) =>
          previousValues.has(item.id)
            ? { ...item, ...previousValues.get(item.id) }
            : item,
        ),
      );
      throw new Error(error.message);
    }
  }, []);

  // Full item update from the edit modal (title, category, price and
  // quantity). Not optimistic: only applied to the UI after the
  // database confirms, since it involves several form fields at once.
  const updateItem = useCallback(async (id, updatedData) => {
    const { data, error } = await supabase
      .from("items")
      .update(updatedData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...data } : item)),
    );
    return data;
  }, []);

  // Removes the item from the database. Optimistic: disappears from
  // the UI immediately and is restored to its original position if
  // the deletion fails.
  const deleteItem = useCallback(async (id) => {
    let removedItem;
    let originalIndex;
    setItems((prev) => {
      originalIndex = prev.findIndex((item) => item.id === id);
      removedItem = prev[originalIndex];
      return prev.filter((item) => item.id !== id);
    });

    const { error } = await supabase.from("items").delete().eq("id", id);

    if (error) {
      setItems((prev) => {
        if (!removedItem) return prev;
        const copy = [...prev];
        copy.splice(originalIndex, 0, removedItem);
        return copy;
      });
      throw new Error(error.message);
    }
  }, []);

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    updateQuantity,
    updateNeedsPurchase,
    updateIsPurchasing,
    finishShopping,
    refetch: fetchItems,
  };
}
