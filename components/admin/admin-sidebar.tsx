'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquare,
  ChevronRight
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    description: 'Vista general'
  },
  {
    name: 'Productos',
    href: '/admin/products',
    icon: Package,
    description: 'Catálogo'
  },
  {
    name: 'Órdenes',
    href: '/admin/orders',
    icon: ShoppingCart,
    description: 'Pedidos'
  },
  {
    name: 'Contactos',
    href: '/admin/contacts',
    icon: MessageSquare,
    description: 'Mensajes'
  },
  {
    name: 'Configuración',
    href: '/admin/settings',
    icon: Settings,
    description: 'Ajustes'
  },
]

interface AdminSidebarProps {
  user?: {
    username?: string
    email: string
    role: string
  }
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/admin/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <>
      {/* Mobile menu button con efecto premium */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white shadow-lg border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-200"
          aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {sidebarOpen ?
            <X className="h-5 w-5 text-gray-700" /> :
            <Menu className="h-5 w-5 text-gray-700" />
          }
        </button>
      </div>

      {/* Sidebar overlay para mobile con animación */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar principal */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-white to-gray-50/50 border-r border-gray-200/50 shadow-xl backdrop-blur-sm transform transition-all duration-300 ease-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Header con gradiente */}
          <div className="relative px-6 py-6 bg-gradient-to-br from-church-electric-600 via-church-electric-700 to-purple-700 border-b border-white/10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDIwIDAgTCAwIDAgMCAyMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>
            <div className="relative">
              <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">
                Admin Panel
              </h1>
              <p className="text-sm text-white/80 font-medium">
                Cristo la Solución
              </p>
            </div>
          </div>

          {/* Navigation con efectos premium */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  prefetch={true}
                  className={cn(
                    "group flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-church-electric-600 to-church-electric-700 text-white shadow-lg shadow-church-electric-600/30 scale-[1.02]"
                      : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 hover:shadow-md hover:scale-[1.01]"
                  )}
                >
                  {/* Indicador de activo (barra izquierda) */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                  )}

                  <div className="flex items-center flex-1 min-w-0">
                    <div className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-lg mr-3 transition-all duration-200",
                      isActive
                        ? "bg-white/20"
                        : "bg-gray-100 group-hover:bg-white group-hover:shadow-sm"
                    )}>
                      <item.icon className={cn(
                        "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                        isActive ? "text-white" : "text-church-electric-600"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        "font-semibold truncate",
                        isActive ? "text-white" : "text-gray-900"
                      )}>
                        {item.name}
                      </div>
                      <div className={cn(
                        "text-xs truncate",
                        isActive ? "text-white/80" : "text-gray-500"
                      )}>
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <ChevronRight className={cn(
                    "h-4 w-4 transition-all duration-200",
                    isActive
                      ? "text-white opacity-100 translate-x-0"
                      : "text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                  )} />
                </Link>
              )
            })}
          </nav>

          {/* User info y logout con diseño premium */}
          <div className="p-4 border-t border-gray-200/50 bg-gray-50/50">
            {user && (
              <div className="mb-3 p-3 rounded-xl bg-white border border-gray-200/50 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-church-electric-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {(user.username || user.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.username || 'Admin'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-church-electric-50 text-church-electric-700 text-xs font-medium capitalize">
                    <span className="w-1.5 h-1.5 rounded-full bg-church-electric-500 mr-1.5"></span>
                    {user.role}
                  </span>
                </div>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 group"
            >
              <LogOut className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}