'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminUserContext, type AdminUser } from './context'
import { Loader2 } from 'lucide-react'

const PUBLIC_ROUTES = ['/admin/login', '/admin/unauthorized', '/admin/setup']

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname)

  const checkAuth = useCallback(async () => {
    try {
      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser()

      if (error || !supabaseUser) {
        setUser(null)
        if (!isPublicRoute) router.push('/admin/login')
        return
      }

      const role = supabaseUser.app_metadata?.role
      if (role !== 'admin' && role !== 'superadmin') {
        setUser(null)
        router.push('/admin/unauthorized')
        return
      }

      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email!,
        role,
        username: supabaseUser.user_metadata?.username,
      })
    } catch {
      setUser(null)
      if (!isPublicRoute) router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }, [isPublicRoute, router, supabase.auth])

  useEffect(() => {
    if (isPublicRoute) {
      setLoading(false)
      return
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null)
        if (!isPublicRoute) router.push('/admin/login')
      } else if (event === 'SIGNED_IN') {
        checkAuth()
      }
    })

    return () => subscription.unsubscribe()
  }, [pathname, isPublicRoute, checkAuth, router, supabase.auth])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (isPublicRoute) {
    return <div className="min-h-screen bg-gray-50">{children}</div>
  }

  if (!user) return null

  return (
    <AdminUserContext.Provider value={user}>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
        <AdminSidebar user={user} />
        <div className="flex-1 lg:ml-72">
          {children}
        </div>
      </div>
    </AdminUserContext.Provider>
  )
}
