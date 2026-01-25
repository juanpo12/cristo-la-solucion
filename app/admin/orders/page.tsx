"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Eye,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
} from "lucide-react";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface OrderItem {
  id: number;
  name: string;
  author?: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: number;
  externalReference: string;
  mercadoPagoId?: string;
  status: string;
  total: string;
  currency: string;
  payerEmail?: string;
  payerName?: string;
  payerSurname?: string;
  payerPhone?: string;
  items: OrderItem[];
  paymentMethod?: string;
  paymentType?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminOrdersPage() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const loadOrders = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedStatus !== "all") params.append("status", selectedStatus);

      const response = await fetch(`/api/admin/orders?${params}`);
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Error cargando órdenes:", error);
    }
  }, [searchTerm, selectedStatus]);

  useEffect(() => {
    const loadUserAndOrders = async () => {
      try {
        // Obtener información del usuario
        const userResponse = await fetch("/api/admin/auth/me");
        const userData = await userResponse.json();
        setUser(userData.user);

        // Obtener órdenes
        await loadOrders();
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserAndOrders();
  }, [loadOrders]);

  useEffect(() => {
    if (!loading) {
      loadOrders();
    }
  }, [searchTerm, selectedStatus, loading, loadOrders]);

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "delivered":
        return <Truck className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "approved":
        return "Aprobado";
      case "delivered":
        return "Entregado";
      case "rejected":
        return "Rechazado";
      default:
        return status;
    }
  };

  const markAsDelivered = async (orderId: number) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/deliver`, {
        method: "POST",
      });

      if (response.ok) {
        await loadOrders();
      }
    } catch (error) {
      console.error("Error marcando como entregado:", error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-lg mb-6">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-4 border-gray-200 border-t-church-electric-600"></div>
          </div>
          <p className="text-base md:text-lg font-medium text-gray-700">Cargando órdenes...</p>
          <p className="text-sm text-gray-500 mt-2">Obteniendo pedidos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      <AdminSidebar user={user} />

      <div className="flex-1 lg:ml-72">
        <div className="p-4 md:p-6 lg:p-8">
          {/* Header mejorado */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Órdenes
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Gestiona los pedidos de la tienda
            </p>
          </div>

          {/* Filtros mejorados */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-4 md:p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5" />
                <Input
                  placeholder="Buscar por referencia, email o nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 md:pl-10 h-10 md:h-11"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-10 md:h-11 px-3 md:px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-church-electric-500 focus:border-transparent transition-all"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="approved">Aprobados</option>
                <option value="delivered">Entregados</option>
                <option value="rejected">Rechazados</option>
              </select>
            </div>
          </div>

          {/* Lista de órdenes mejorada */}
          <div className="space-y-3 md:space-y-4">
            {orders?.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-8 md:p-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 mb-4">
                    <Package className="h-8 w-8 md:h-10 md:w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                    No hay órdenes
                  </h3>
                  <p className="text-sm md:text-base text-gray-500">
                    Las órdenes aparecerán aquí cuando los clientes realicen compras.
                  </p>
                </div>
              </div>
            ) : (
              orders?.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-md hover:border-church-electric-300 transition-all duration-200"
                >
                  <div className="p-4 md:p-6">
                    {/* Header de la orden - Responsive */}
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-3">
                          <h3 className="text-base md:text-lg font-bold text-gray-900">
                            #{order.externalReference}
                          </h3>
                          <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                            {getStatusIcon(order.status)}
                            <span className="font-semibold">
                              {getStatusText(order.status)}
                            </span>
                          </Badge>
                        </div>

                        {/* Info del cliente */}
                        <div className="space-y-1.5 text-xs md:text-sm text-gray-600">
                          {order.payerName && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">Cliente:</span>
                              <span>{order.payerName} {order.payerSurname}</span>
                            </div>
                          )}
                          {order.payerEmail && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">Email:</span>
                              <span className="truncate">{order.payerEmail}</span>
                            </div>
                          )}
                          {order.payerPhone && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">Teléfono:</span>
                              <span>{order.payerPhone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-700">Fecha:</span>
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                          {order.paymentMethod && (
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-700">Pago:</span>
                              <span className="capitalize">{order.paymentMethod}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Precio y acciones */}
                      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-4">
                        <div className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                          {formatCurrency(order.total)}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                          >
                            <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                            Ver detalles
                          </Button>
                          {order.status === "approved" && (
                            <Button
                              size="sm"
                              onClick={() => markAsDelivered(order.id)}
                              className="text-xs bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all"
                            >
                              <Truck className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                              Marcar entregado
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Items de la orden */}
                    {order.items && order.items.length > 0 && (
                      <div className="border-t border-gray-200/50 pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <Package className="h-4 w-4 text-church-electric-600" />
                          Productos ({order.items.length})
                        </h4>
                        <div className="space-y-2">
                          {order.items.map((item: OrderItem, index: number) => (
                            <div
                              key={index}
                              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors gap-2"
                            >
                              <div className="flex-1 min-w-0">
                                <span className="font-medium text-gray-900 text-sm block truncate">
                                  {item.name}
                                </span>
                                {item.author && (
                                  <span className="text-xs text-gray-500">
                                    por {item.author}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between sm:justify-end gap-3 text-sm">
                                <span className="text-gray-600">
                                  <span className="font-semibold text-gray-900">{item.quantity}</span> × {formatCurrency(String(item.price))}
                                </span>
                                <span className="font-bold text-gray-900">
                                  {formatCurrency(String(item.quantity * item.price))}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
