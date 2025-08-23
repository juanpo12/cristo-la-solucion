'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

interface AdminUser {
  id: string
  email: string
  role: string
  username?: string
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Rutas que no requieren autenticación
  const publicRoutes = ['/admin/login', '/admin/unauthorized']
  const isPublicRoute = publicRoutes.includes(pathname)

  useEffect(() => {
    if (isPublicRoute) {
      setLoading(false)
      return
    }

    checkAuth()

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null)
          if (!isPublicRoute) {
            router.push('/admin/login')
          }
        } else if (event === 'SIGNED_IN' && session) {
          checkAuth()
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [pathname, isPublicRoute])

  const checkAuth = async () => {
    try {
      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser()
      
      if (error || !supabaseUser) {
        setUser(null)
        if (!isPublicRoute) {
          router.push('/admin/login')
        }
        return
      }

      // Verificar que el usuario tenga rol de admin
      const role = supabaseUser.user_metadata?.role
      if (role !== 'admin' && role !== 'superadmin') {
        setUser(null)
        router.push('/admin/unauthorized')
        return
      }

      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email!,
        role,
        username: supabaseUser.user_metadata?.username
      })

    } catch (error) {
      console.error('Error verificando autenticación:', error)
      setUser(null)
      if (!isPublicRoute) {
        router.push('/admin/login')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Para rutas públicas, mostrar el contenido directamente sin header ni footer
  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    )
  }

  // Para rutas protegidas, mostrar solo si está autenticado, sin header ni footer
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}