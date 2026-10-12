import { useItems } from "./useItems";

export function generateShoppingList() {
  const { itens } = useItems();
  console.log(itens);
}
