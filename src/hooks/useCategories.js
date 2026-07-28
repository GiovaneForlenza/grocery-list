import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      setError(error.message)
    } else {
      setCategories(data || [])
      setError(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const addCategory = useCallback(async (name) => {
    const cleanName = name.trim()
    if (!cleanName) throw new Error('Enter a name for the category.')

    const alreadyExists = categories.some(
      (c) => c.name.toLowerCase() === cleanName.toLowerCase()
    )
    if (alreadyExists) throw new Error('That category already exists.')

    const { data, error } = await supabase
      .from('categories')
      .insert({ name: cleanName })
      .select()
      .single()

    if (error) throw new Error(error.message)

    setCategories((prev) =>
      [...prev, data].sort((a, b) => a.name.localeCompare(b.name))
    )
    return data
  }, [categories])

  return { categories, loading, error, addCategory, refetch: fetchCategories }
}
