import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useItems() {
  const [itens, setItens] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchItens = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('itens')
      .select('*')
      .order('nome', { ascending: true })

    if (error) {
      setError(error.message)
    } else {
      setItens(data || [])
      setError(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchItens()
  }, [fetchItens])

  const addItem = useCallback(async (novoItem) => {
    const { data, error } = await supabase
      .from('itens')
      .insert(novoItem)
      .select()
      .single()

    if (error) throw new Error(error.message)

    setItens((prev) => [...prev, data])
    return data
  }, [])

  // Atualização otimista: muda a UI antes da resposta do banco e
  // reverte caso a chamada falhe.
  const updateQuantidade = useCallback(async (id, novaQuantidade) => {
    if (novaQuantidade < 0) return

    let quantidadeAnterior
    setItens((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          quantidadeAnterior = item.quantidade
          return { ...item, quantidade: novaQuantidade }
        }
        return item
      })
    )

    const { error } = await supabase
      .from('itens')
      .update({ quantidade: novaQuantidade })
      .eq('id', id)

    if (error) {
      setItens((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantidade: quantidadeAnterior } : item
        )
      )
      throw new Error(error.message)
    }
  }, [])

  // Atualização otimista do checkbox "precisa comprar".
  const updateComprar = useCallback(async (id, novoValor) => {
    let valorAnterior
    setItens((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          valorAnterior = item.comprar
          return { ...item, comprar: novoValor }
        }
        return item
      })
    )

    const { error } = await supabase
      .from('itens')
      .update({ comprar: novoValor })
      .eq('id', id)

    if (error) {
      setItens((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, comprar: valorAnterior } : item
        )
      )
      throw new Error(error.message)
    }
  }, [])

  return { itens, loading, error, addItem, updateQuantidade, updateComprar, refetch: fetchItens }
}
