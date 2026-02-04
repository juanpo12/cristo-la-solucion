import useSWR from 'swr'
import type { Category } from '@/lib/db/schema'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useCategories() {
    const { data, error, isLoading } = useSWR<Category[]>('/api/categories', fetcher)

    return {
        categories: data || [],
        isLoading,
        isError: error,
    }
}

export function useAdminCategories() {
    const { data, error, isLoading, mutate } = useSWR<Category[]>('/api/admin/categories', fetcher)

    return {
        categories: data || [],
        isLoading,
        isError: error,
        mutate,
    }
}
