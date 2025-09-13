'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Tiempo que los datos se consideran frescos
            staleTime: 60 * 1000, // 1 minuto
            // Tiempo que los datos se mantienen en caché
            gcTime: 5 * 60 * 1000, // 5 minutos
            // No refetch automático al enfocar la ventana
            refetchOnWindowFocus: false,
            // Reintentos en caso de error
            retry: (failureCount, error) => {
              // No reintentar en errores 4xx
              if (error instanceof Error && error.message.includes('4')) {
                return false
              }
              return failureCount < 3
            },
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  )
}