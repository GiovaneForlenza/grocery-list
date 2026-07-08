import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useCategories() {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCategorias = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('nome', { ascending: true })

    if (error) {
      setError(error.message)
    } else {
      setCategorias(data || [])
      setError(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchCategorias()
  }, [fetchCategorias])

  const addCategoria = useCallback(async (nome) => {
    const nomeLimpo = nome.trim()
    if (!nomeLimpo) throw new Error('Informe um nome para a categoria.')

    const jaExiste = categorias.some(
      (c) => c.nome.toLowerCase() === nomeLimpo.toLowerCase()
    )
    if (jaExiste) throw new Error('Essa categoria já existe.')

    const { data, error } = await supabase
      .from('categorias')
      .insert({ nome: nomeLimpo })
      .select()
      .single()

    if (error) throw new Error(error.message)

    setCategorias((prev) =>
      [...prev, data].sort((a, b) => a.nome.localeCompare(b.nome))
    )
    return data
  }, [categorias])

  return { categorias, loading, error, addCategoria, refetch: fetchCategorias }
}
