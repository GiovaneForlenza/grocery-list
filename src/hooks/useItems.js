import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useItems() {
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItens = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("itens")
      .select("*")
      .order("nome", { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setItens(data || []);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchItens();
  }, [fetchItens]);

  const addItem = useCallback(async (novoItem) => {
    const { data, error } = await supabase
      .from("itens")
      .insert(novoItem)
      .select()
      .single();

    if (error) throw new Error(error.message);

    setItens((prev) => [...prev, data]);
    return data;
  }, []);

  // Atualização otimista: muda a UI antes da resposta do banco e
  // reverte caso a chamada falhe.
  const updateQuantidade = useCallback(async (id, novaQuantidade) => {
    if (novaQuantidade < 0) return;

    let quantidadeAnterior;
    setItens((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          quantidadeAnterior = item.quantidade;
          return { ...item, quantidade: novaQuantidade };
        }
        return item;
      }),
    );

    const { error } = await supabase
      .from("itens")
      .update({ quantidade: novaQuantidade })
      .eq("id", id);

    if (error) {
      setItens((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantidade: quantidadeAnterior } : item,
        ),
      );
      throw new Error(error.message);
    }
  }, []);

  // Atualização otimista do checkbox "precisa_comprar".
  // Regra: se o item deixar de precisar ser comprado, ele também
  // sai automaticamente do carrinho ("comprando" volta para false).
  const updatePrecisaComprar = useCallback(async (id, novoValor) => {
    let anterior;
    setItens((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          anterior = {
            precisa_comprar: item.precisa_comprar,
            comprando: item.comprando,
          };
          const atualizado = { ...item, precisa_comprar: novoValor };
          if (!novoValor) atualizado.comprando = false;
          return atualizado;
        }
        return item;
      }),
    );

    const payload = { precisa_comprar: novoValor };
    if (!novoValor) payload.comprando = false;

    const { error } = await supabase.from("itens").update(payload).eq("id", id);

    if (error) {
      setItens((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...anterior } : item)),
      );
      throw new Error(error.message);
    }
  }, []);

  const updateComprando = useCallback(async (id, novoValor) => {
    let valorAnterior;
    setItens((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          valorAnterior = item.comprando;
          return { ...item, comprando: novoValor };
        }
        return item;
      }),
    );

    const { error } = await supabase
      .from("itens")
      .update({ comprando: novoValor })
      .eq("id", id);

    if (error) {
      setItens((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, comprando: valorAnterior } : item,
        ),
      );
      throw new Error(error.message);
    }
  }, []);

  // Ação em lote do botão "Comprei todos os itens": para todo item
  // com comprando = true, zera comprando e precisa_comprar em uma
  // única chamada ao banco.
  const finalizarCompra = useCallback(async () => {
    let idsAfetados = [];
    let anteriores = new Map();

    setItens((prev) =>
      prev.map((item) => {
        if (item.comprando) {
          idsAfetados.push(item.id);
          anteriores.set(item.id, {
            precisa_comprar: item.precisa_comprar,
            comprando: item.comprando,
          });
          return { ...item, precisa_comprar: false, comprando: false };
        }
        return item;
      }),
    );

    if (idsAfetados.length === 0) return;

    const { error } = await supabase
      .from("itens")
      .update({ precisa_comprar: false, comprando: false })
      .in("id", idsAfetados);

    if (error) {
      setItens((prev) =>
        prev.map((item) =>
          anteriores.has(item.id)
            ? { ...item, ...anteriores.get(item.id) }
            : item,
        ),
      );
      throw new Error(error.message);
    }
  }, []);

  // Atualização completa do item a partir do modal de edição
  // (título, categoria, preço e quantidade). Não é otimista: só
  // aplica na UI depois que o banco confirmar, já que envolve
  // vários campos de um formulário.
  const updateItem = useCallback(async (id, dadosAtualizados) => {
    const { data, error } = await supabase
      .from("itens")
      .update(dadosAtualizados)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    setItens((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...data } : item)),
    );
    return data;
  }, []);

  // Remove o item do banco. Otimista: some da UI na hora e volta
  // pro lugar (na posição original) se a exclusão falhar.
  const deleteItem = useCallback(async (id) => {
    let itemRemovido;
    let indiceOriginal;
    setItens((prev) => {
      indiceOriginal = prev.findIndex((item) => item.id === id);
      itemRemovido = prev[indiceOriginal];
      return prev.filter((item) => item.id !== id);
    });

    const { error } = await supabase.from("itens").delete().eq("id", id);

    if (error) {
      setItens((prev) => {
        if (!itemRemovido) return prev;
        const copia = [...prev];
        copia.splice(indiceOriginal, 0, itemRemovido);
        return copia;
      });
      throw new Error(error.message);
    }
  }, []);

  return {
    itens,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    updateQuantidade,
    updatePrecisaComprar,
    updateComprando,
    finalizarCompra,
    refetch: fetchItens,
  };
}
