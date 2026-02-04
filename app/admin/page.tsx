'use client'

import { useEffect, useState } from 'react'
import { DashboardSkeleton } from '@/components/admin/dashboard-skeleton'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Package,
  DollarSign,
  AlertTriangle,
  Clock,
  ChevronRight,
  MessageSquare,
  Users
} from 'lucide-react'

interface AdminUser {
  id: string
  username?: string
  email: string
  role: string
}

interface DashboardStats {
  products: {
    totalProducts: number
    featuredProducts: number
    lowStockProducts: number
    totalInventoryValue: number
  }
  orders: {
    totalOrders: number
    pendingOrders: number
    approvedOrders: number
    deliveredOrders: number
    totalRevenue: number
    averageOrderValue: number
  }
  contacts: {
    total: number
    pending: number
  }
}

interface RecentOrder {
  id: number
  externalReference: string
  status: string
  total: string
  payerEmail: string
  createdAt: string
}

export default function AdminDashboard() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setError(null)

      // Obtener información del usuario desde Supabase
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser()

      if (userError || !supabaseUser) {
        console.error('Error obteniendo usuario:', userError)
        setError('Error al obtener información del usuario')
        return
      }

      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        role: supabaseUser.user_metadata?.role || 'admin',
        username: supabaseUser.user_metadata?.username
      })

      // Obtener estadísticas de productos con manejo de errores
      let productsStats = {
        totalProducts: 0,
        featuredProducts: 0,
        lowStockProducts: 0,
        totalInventoryValue: 0
      }

      try {
        const productsResponse = await fetch('/api/admin/products?limit=1')
        if (productsResponse.ok) {
          const productsData = await productsResponse.json()
          productsStats = {
            totalProducts: productsData?.stats?.totalProducts || 0,
            featuredProducts: productsData?.stats?.featuredProducts || 0,
            lowStockProducts: productsData?.stats?.lowStockProducts || 0,
            totalInventoryValue: productsData?.stats?.totalInventoryValue || 0
          }
        }
      } catch (error) {
        console.error('Error obteniendo estadísticas de productos:', error)
      }

      // Obtener estadísticas de órdenes con manejo de errores
      let ordersStats = {
        totalOrders: 0,
        pendingOrders: 0,
        approvedOrders: 0,
        deliveredOrders: 0,
        totalRevenue: 0,
        averageOrderValue: 0
      }
      let ordersArray: RecentOrder[] = []

      try {
        const ordersResponse = await fetch('/api/admin/orders?limit=1000')
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json()
          ordersStats = {
            totalOrders: ordersData?.stats?.totalOrders || 0,
            pendingOrders: ordersData?.stats?.pendingOrders || 0,
            approvedOrders: ordersData?.stats?.approvedOrders || 0,
            deliveredOrders: ordersData?.stats?.deliveredOrders || 0,
            totalRevenue: ordersData?.stats?.totalRevenue || 0,
            averageOrderValue: ordersData?.stats?.averageOrderValue || 0
          }
          ordersArray = Array.isArray(ordersData?.orders) ? ordersData.orders : []
        }
      } catch (error) {
        console.error('Error obteniendo estadísticas de órdenes:', error)
      }

      // Obtener estadísticas de contactos
      let contactsStats = { total: 0, pending: 0 }
      try {
        const contactsResponse = await fetch('/api/admin/contacts/stats')
        if (contactsResponse.ok) {
          const contactsData = await contactsResponse.json()
          contactsStats = {
            total: contactsData.total || 0,
            pending: contactsData.byStatus?.pending || 0
          }
        }
      } catch (error) {
        console.error('Error obteniendo estadísticas de contactos:', error)
      }

      setStats({
        products: productsStats,
        orders: ordersStats,
        contacts: contactsStats
      })

      setRecentOrders(ordersArray)

    } catch (error) {
      console.error('Error cargando datos del dashboard:', error)
      setError('Error al cargar los datos del dashboard')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount || 0
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(numAmount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Fecha no disponible'

    try {
      return new Date(dateString).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.error('Error formateando fecha:', error)
      return 'Fecha inválida'
    }
  }

  const getStatusColor = (status: string) => {
    if (!status) return 'text-gray-600 bg-gray-100'

    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'approved':
        return 'text-green-600 bg-green-100'
      case 'delivered':
        return 'text-blue-600 bg-blue-100'
      case 'rejected':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    if (!status) return 'Sin estado'

    switch (status.toLowerCase()) {
      case 'pending':
        return 'Pendiente'
      case 'approved':
        return 'Aprobado'
      case 'delivered':
        return 'Entregado'
      case 'rejected':
        return 'Rechazado'
      default:
        return status
    }
  }

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
        <div className="flex-1 lg:ml-72 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-100 mb-6">
              <AlertTriangle className="h-8 w-8 md:h-10 md:w-10 text-red-600" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Error al cargar</h2>
            <p className="text-sm md:text-base text-red-600 mb-6">{error}</p>
            <button
              onClick={loadDashboardData}
              className="px-6 py-3 bg-gradient-to-r from-church-electric-600 to-church-electric-700 text-white rounded-xl hover:from-church-electric-700 hover:to-church-electric-800 font-medium shadow-lg shadow-church-electric-600/30 hover:shadow-xl hover:shadow-church-electric-600/40 transition-all duration-200"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
        <div className="flex-1 lg:ml-72 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 mb-6">
              <AlertTriangle className="h-8 w-8 md:h-10 md:w-10 text-gray-400" />
            </div>
            <p className="text-base md:text-lg font-medium text-gray-600">Usuario no autenticado</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      <AdminSidebar user={user} />

      <div className="flex-1 lg:ml-72">
        <div className="p-4 md:p-6 lg:p-8">
          {/* Header mejorado */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Bienvenido de vuelta, <span className="font-semibold text-church-electric-600">{user.username || user.email || 'Admin'}</span> 👋
            </p>
          </div>

          {/* Stats Cards con diseño premium */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
            {/* Card 1: Ingresos Totales (Reemplaza Productos) */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <DollarSign className="h-6 w-6 md:h-7 md:w-7 text-white" />
                  </div>
                  <div className="text-white/80 text-xs font-medium px-2 py-1 bg-white/10 rounded-lg">
                    Ingresos
                  </div>
                </div>
                <h3 className="text-sm font-medium text-white/90 mb-1">Ingresos Totales</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl md:text-3xl font-bold text-white truncate">
                    {formatCurrency(stats?.orders?.totalRevenue || 0)}
                  </p>
                </div>
                <p className="text-xs text-white/80 mt-2 truncate">
                  Ticket Promedio: <span className="font-semibold">{formatCurrency(stats?.orders?.averageOrderValue || 0)}</span>
                </p>
              </div>
            </div>

            {/* Card 2: Órdenes Pendientes */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 p-6 shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/40 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Clock className="h-6 w-6 md:h-7 md:w-7 text-white" />
                  </div>
                  <div className="text-white/80 text-xs font-medium px-2 py-1 bg-white/10 rounded-lg">
                    Pendientes
                  </div>
                </div>
                <h3 className="text-sm font-medium text-white/90 mb-1">Órdenes Pendientes</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl md:text-4xl font-bold text-white">{stats?.orders?.pendingOrders || 0}</p>
                  <span className="text-sm text-white/70">órdenes</span>
                </div>
                <p className="text-xs text-white/80 mt-2">
                  de <span className="font-semibold">{stats?.orders?.totalOrders || 0}</span> total
                </p>
              </div>
            </div>

            {/* Card 3: Mensajes Nuevos (Reemplaza Ingresos/Posición 3) */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-6 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <MessageSquare className="h-6 w-6 md:h-7 md:w-7 text-white" />
                  </div>
                  <div className="text-white/80 text-xs font-medium px-2 py-1 bg-white/10 rounded-lg">
                    Mensajes
                  </div>
                </div>
                <h3 className="text-sm font-medium text-white/90 mb-1">Mensajes Nuevos</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl md:text-4xl font-bold text-white">{stats?.contacts?.pending || 0}</p>
                  <span className="text-sm text-white/70">sin leer</span>
                </div>
                <p className="text-xs text-white/80 mt-2">
                  <span className="font-semibold">{stats?.contacts?.total || 0}</span> total histórico
                </p>
              </div>
            </div>

            {/* Card 4: Total Productos (Reemplaza Stock Bajo) */}
            <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    <Package className="h-6 w-6 md:h-7 md:w-7 text-white" />
                  </div>
                  <div className="text-white/80 text-xs font-medium px-2 py-1 bg-white/10 rounded-lg">
                    Catálogo
                  </div>
                </div>
                <h3 className="text-sm font-medium text-white/90 mb-1">Total Productos</h3>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl md:text-4xl font-bold text-white">{stats?.products?.totalProducts || 0}</p>
                  <span className="text-sm text-white/70">items</span>
                </div>
                <p className="text-xs text-white/80 mt-2">
                  <span className="font-semibold">{stats?.products?.lowStockProducts || 0}</span> con stock bajo
                </p>
              </div>
            </div>
          </div>

          {/* Recent Orders con diseño mejorado */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
            <div className="px-4 md:px-6 py-5 border-b border-gray-200/50 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Órdenes Recientes</h2>
              <p className="text-sm text-gray-600 mt-1">
                Las últimas órdenes recibidas en tiempo real
              </p>
            </div>
            <div className="p-4 md:p-6">
              <div className="space-y-3">
                {!recentOrders || recentOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No hay órdenes recientes</p>
                    <p className="text-sm text-gray-400 mt-1">Las órdenes aparecerán aquí automáticamente</p>
                  </div>
                ) : (
                  recentOrders.slice(0, 5).map((order) => (
                    <div
                      key={order?.id || Math.random()}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200/50 rounded-xl hover:border-church-electric-300 hover:shadow-md hover:bg-gray-50/50 transition-all duration-200 group gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <p className="font-semibold text-gray-900 text-sm md:text-base">
                            #{order?.externalReference || 'Sin referencia'}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusColor(order?.status)}`}>
                            {getStatusText(order?.status)}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600 truncate">
                          {order?.payerEmail || 'Sin email'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(order?.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center justify-between md:justify-end md:text-right gap-4">
                        <p className="text-lg md:text-xl font-bold text-gray-900">
                          {formatCurrency(order?.total || 0)}
                        </p>
                        <button className="px-3 py-1.5 text-xs font-medium text-church-electric-600 bg-church-electric-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-church-electric-100">
                          Ver detalles
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {recentOrders && recentOrders.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200/50 text-center">
                  <a href="/admin/orders" className="inline-flex items-center text-sm font-medium text-church-electric-600 hover:text-church-electric-700 transition-colors">
                    Ver todas las órdenes
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}