'use client'

import { useEffect, useState } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Package, 
  DollarSign, 
  AlertTriangle,
  Clock
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

      setStats({
        products: productsStats,
        orders: ordersStats
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
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
            <button 
              onClick={loadDashboardData}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Usuario no autenticado</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar user={user} />
      
      <div className="flex-1 lg:ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Bienvenido de vuelta, {user.username || user.email || 'Admin'}</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.products?.totalProducts || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.products?.featuredProducts || 0} destacados
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Órdenes Pendientes</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.orders?.pendingOrders || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.orders?.totalOrders || 0} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats?.orders?.totalRevenue || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Promedio: {formatCurrency(stats?.orders?.averageOrderValue || 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.products?.lowStockProducts || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Productos con stock ≤ 5
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Órdenes Recientes</CardTitle>
              <CardDescription>
                Las últimas órdenes recibidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!recentOrders || recentOrders.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No hay órdenes recientes</p>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order?.id || Math.random()} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">#{order?.externalReference || 'Sin referencia'}</p>
                            <p className="text-sm text-gray-500">{order?.payerEmail || 'Sin email'}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order?.status)}`}>
                            {getStatusText(order?.status)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(order?.total || 0)}</p>
                        <p className="text-sm text-gray-500">{formatDate(order?.createdAt)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}