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
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar user={user} />

      <div className="flex-1 lg:ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Órdenes</h1>
            <p className="text-gray-600">Gestiona los pedidos de la tienda</p>
          </div>

          {/* Filtros */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por referencia, email o nombre..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-church-electric"
                >
                  <option value="all">Todos los estados</option>
                  <option value="pending">Pendientes</option>
                  <option value="approved">Aprobados</option>
                  <option value="delivered">Entregados</option>
                  <option value="rejected">Rechazados</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Lista de órdenes */}
          <div className="grid gap-6">
            {orders?.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No hay órdenes
                  </h3>
                  <p className="text-gray-500">
                    Las órdenes aparecerán aquí cuando los clientes realicen
                    compras.
                  </p>
                </CardContent>
              </Card>
            ) : (
              orders?.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            #{order.externalReference}
                          </h3>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1">
                              {getStatusText(order.status)}
                            </span>
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          {order.payerName && (
                            <p>
                              Cliente: {order.payerName} {order.payerSurname}
                            </p>
                          )}
                          {order.payerEmail && <p>Email: {order.payerEmail}</p>}
                          {order.payerPhone && (
                            <p>Teléfono: {order.payerPhone}</p>
                          )}
                          <p>Fecha: {formatDate(order.createdAt)}</p>
                          {order.paymentMethod && (
                            <p>Método de pago: {order.paymentMethod}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 mb-2">
                          {formatCurrency(order.total)}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver detalles
                          </Button>
                          {order.status === "approved" && (
                            <Button
                              size="sm"
                              onClick={() => markAsDelivered(order.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Truck className="h-4 w-4 mr-1" />
                              Marcar entregado
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Items de la orden */}
                    {order.items && order.items.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-900 mb-3">
                          Productos:
                        </h4>
                        <div className="space-y-2">
                          {order.items.map((item: OrderItem, index: number) => (
                            <div
                              key={index}
                              className="flex justify-between items-center text-sm"
                            >
                              <div>
                                <span className="font-medium">{item.name}</span>
                                {item.author && (
                                  <span className="text-gray-500">
                                    {" "}
                                    - {item.author}
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                <span className="text-gray-600">
                                  {item.quantity}x{" "}
                                  {formatCurrency(String(item.price))}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
