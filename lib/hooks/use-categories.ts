import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Category } from '@/lib/db/schema'

const fetchCategories = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch categories')
    return res.json()
}

export function useCategories() {
    const { data, error, isLoading } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: () => fetchCategories('/api/categories'),
    })

    return {
        categories: data || [],
        isLoading,
        isError: error,
    }
}

export function useAdminCategories() {
    const queryClient = useQueryClient()
    const { data, error, isLoading } = useQuery<Category[]>({
        queryKey: ['admin-categories'],
        queryFn: () => fetchCategories('/api/admin/categories'),
    })

    const mutate = () => {
        return queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
    }

    return {
        categories: data || [],
        isLoading,
        isError: error,
        mutate,
    }
}
