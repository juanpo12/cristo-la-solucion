'use client'

import { useEffect, useState, useCallback } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Users,
  CheckCheck,
  MessageCircle
} from 'lucide-react'

interface Contact {
  id: number
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  type: 'general' | 'prayer' | 'pastoral' | 'group'
  status: 'pending' | 'read' | 'responded' | 'closed'
  createdAt: string
  updatedAt: string
}

interface ContactsResponse {
  contacts: Contact[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

interface ContactStats {
  total: number
  byStatus: {
    pending: number
    read: number
    responded: number
    closed: number
  }
  byType: {
    general: number
    prayer: number
    pastoral: number
    group: number
  }
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [pagination, setPagination] = useState<ContactsResponse['pagination'] | null>(null)
  const [stats, setStats] = useState<ContactStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const loadContacts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })

      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      if (typeFilter !== 'all') {
        params.append('type', typeFilter)
      }

      const response = await fetch(`/api/admin/contacts?${params}`)

      if (!response.ok) {
        throw new Error('Error al cargar contactos')
      }

      const data: ContactsResponse = await response.json()
      setContacts(data.contacts)
      setPagination(data.pagination)

    } catch (error) {
      console.error('Error cargando contactos:', error)
      setError('Error al cargar los contactos')
    } finally {
      setLoading(false)
    }
  }, [currentPage, statusFilter, typeFilter])

  const loadStats = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/contacts/stats')
      if (!response.ok) {
        throw new Error('Error al cargar estadísticas')
      }

      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }, [])

  useEffect(() => {
    loadContacts()
    loadStats()
  }, [loadContacts, loadStats])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  const updateContactStatus = async (contactId: number, newStatus: Contact['status']) => {
    try {
      const response = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: contactId,
          status: newStatus
        })
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el estado')
      }

      // Actualizar la lista local
      setContacts(prev => prev.map(contact =>
        contact.id === contactId
          ? { ...contact, status: newStatus, updatedAt: new Date().toISOString() }
          : contact
      ))

      // Actualizar el contacto seleccionado si es el mismo
      if (selectedContact?.id === contactId) {
        setSelectedContact(prev => prev ? { ...prev, status: newStatus } : null)
      }

    } catch (error) {
      console.error('Error actualizando estado:', error)
      setError('Error al actualizar el estado del contacto')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: Contact['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'read':
        return 'bg-blue-100 text-blue-800'
      case 'responded':
        return 'bg-green-100 text-green-800'
      case 'closed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: Contact['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3" />
      case 'read':
        return <Eye className="w-3 h-3" />
      case 'responded':
        return <CheckCircle className="w-3 h-3" />
      case 'closed':
        return <X className="w-3 h-3" />
      default:
        return <AlertCircle className="w-3 h-3" />
    }
  }

  const getStatusText = (status: Contact['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendiente'
      case 'read':
        return 'Leído'
      case 'responded':
        return 'Respondido'
      case 'closed':
        return 'Cerrado'
      default:
        return status
    }
  }

  const getTypeText = (type: Contact['type']) => {
    switch (type) {
      case 'general':
        return 'Consulta General'
      case 'prayer':
        return 'Petición de Oración'
      case 'pastoral':
        return 'Consejería Pastoral'
      case 'group':
        return 'Información de Grupos'
      default:
        return type
    }
  }

  const getTypeLabel = (type: Contact['type']) => {
    return getTypeText(type)
  }

  const getTypeColor = (type: Contact['type']) => {
    switch (type) {
      case 'general':
        return 'bg-blue-100 text-blue-800'
      case 'prayer':
        return 'bg-purple-100 text-purple-800'
      case 'pastoral':
        return 'bg-green-100 text-green-800'
      case 'group':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-lg mb-6">
            <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-4 border-gray-200 border-t-church-electric-600"></div>
          </div>
          <p className="text-base md:text-lg font-medium text-gray-700">Cargando contactos...</p>
          <p className="text-sm text-gray-500 mt-2">Obteniendo mensajes</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
      <AdminSidebar />

      <div className="flex-1 lg:ml-72">
        <div className="p-4 md:p-6 lg:p-8">
          {/* Header mejorado */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Contactos y Peticiones
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Gestiona las peticiones y consultas recibidas
            </p>
          </div>

          {/* Estadísticas premium */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
              {/* Card 1: Total */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <Users className="h-6 w-6 md:h-7 md:w-7 text-white" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-white/90 mb-1">Total Contactos</h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl md:text-4xl font-bold text-white">{stats.total}</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Pendientes */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 p-6 shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/40 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <Clock className="h-6 w-6 md:h-7 md:w-7 text-white" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-white/90 mb-1">Pendientes</h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl md:text-4xl font-bold text-white">{stats.byStatus.pending}</p>
                  </div>
                </div>
              </div>

              {/* Card 3: Leídos */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 p-6 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <Eye className="h-6 w-6 md:h-7 md:w-7 text-white" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-white/90 mb-1">Leídos</h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl md:text-4xl font-bold text-white">{stats.byStatus.read}</p>
                  </div>
                </div>
              </div>

              {/* Card 4: Respondidos */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-6 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <CheckCheck className="h-6 w-6 md:h-7 md:w-7 text-white" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-white/90 mb-1">Respondidos</h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl md:text-4xl font-bold text-white">{stats.byStatus.responded}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filtros mejorados */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-4 md:p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Estado</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-10 md:h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="read">Leídos</SelectItem>
                    <SelectItem value="responded">Respondidos</SelectItem>
                    <SelectItem value="closed">Cerrados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Tipo</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-10 md:h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="prayer">Oración</SelectItem>
                    <SelectItem value="pastoral">Pastoral</SelectItem>
                    <SelectItem value="group">Grupos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-xl mb-6">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Lista de contactos mejorada */}
          <div className="space-y-3 md:space-y-4">
            {contacts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-8 md:p-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 mb-4">
                    <MessageSquare className="h-8 w-8 md:h-10 md:w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                    No hay contactos
                  </h3>
                  <p className="text-sm md:text-base text-gray-500">
                    Los mensajes aparecerán aquí cuando los usuarios envíen consultas.
                  </p>
                </div>
              </div>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden hover:shadow-md hover:border-church-electric-300 transition-all duration-200"
                >
                  <div className="p-4 md:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Info principal */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <h3 className="text-base md:text-lg font-bold text-gray-900">
                            {contact.name}
                          </h3>
                          <Badge className={`${getStatusColor(contact.status)} flex items-center gap-1 text-xs`}>
                            {getStatusIcon(contact.status)}
                            <span className="font-semibold">{getStatusText(contact.status)}</span>
                          </Badge>
                          <Badge className={`${getTypeColor(contact.type)} text-xs`}>
                            {getTypeText(contact.type)}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-xs md:text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-church-electric-600" />
                            <span className="truncate">{contact.email}</span>
                          </div>
                          {contact.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-church-electric-600" />
                              <span>{contact.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-church-electric-600" />
                            <span>{formatDate(contact.createdAt)}</span>
                          </div>
                        </div>

                        {contact.subject && (
                          <p className="text-sm font-semibold text-gray-900 mb-2">
                            {contact.subject}
                          </p>
                        )}

                        <p className="text-sm text-gray-600 line-clamp-2">
                          {contact.message}
                        </p>
                      </div>

                      {/* Acciones */}
                      <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedContact(contact)}
                              className="text-xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                            >
                              <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                              Ver detalles
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Detalles del Contacto</DialogTitle>
                              <DialogDescription>
                                Información completa del contacto #{contact.id}
                              </DialogDescription>
                            </DialogHeader>

                            {selectedContact && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Nombre</label>
                                    <p className="text-sm text-gray-900 mt-1">{selectedContact.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <p className="text-sm text-gray-900 mt-1">{selectedContact.email}</p>
                                  </div>
                                  {selectedContact.phone && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Teléfono</label>
                                      <p className="text-sm text-gray-900 mt-1">{selectedContact.phone}</p>
                                    </div>
                                  )}
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Tipo</label>
                                    <p className="mt-1">
                                      <Badge variant="outline">{getTypeLabel(selectedContact.type)}</Badge>
                                    </p>
                                  </div>
                                </div>

                                {selectedContact.subject && (
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Asunto</label>
                                    <p className="text-sm text-gray-900 mt-1">{selectedContact.subject}</p>
                                  </div>
                                )}

                                <div>
                                  <label className="text-sm font-medium text-gray-700">Mensaje</label>
                                  <div className="mt-1 p-3 bg-gray-50 rounded-md">
                                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Estado</label>
                                    <div className="mt-1">
                                      <Select
                                        value={selectedContact.status}
                                        onValueChange={(value) => {
                                          updateContactStatus(selectedContact.id, value as Contact['status'])
                                          setSelectedContact({ ...selectedContact, status: value as Contact['status'] })
                                        }}
                                      >
                                        <SelectTrigger className="w-full">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="pending">Pendiente</SelectItem>
                                          <SelectItem value="read">Leído</SelectItem>
                                          <SelectItem value="responded">Respondido</SelectItem>
                                          <SelectItem value="closed">Cerrado</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Fecha de creación</label>
                                    <p className="text-sm text-gray-900 mt-1">
                                      {formatDate(selectedContact.createdAt)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateContactStatus(contact.id, contact.status === 'pending' ? 'read' : contact.status === 'read' ? 'responded' : 'closed')}
                          className="text-xs hover:bg-green-50 hover:border-green-300 hover:text-green-700"
                        >
                          {contact.status === 'pending' ? (
                            <>
                              <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                              Marcar leído
                            </>
                          ) : contact.status === 'read' ? (
                            <>
                              <CheckCircle className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                              Responder
                            </>
                          ) : (
                            <>
                              <MessageCircle className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                              Actualizar
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Paginación mejorada */}
          {pagination && pagination.totalPages > 1 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200/50 p-4 md:p-6 mt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Página {pagination.page} de {pagination.totalPages} ({pagination.total} contactos)
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasPrev}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="text-xs"
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasNext}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="text-xs"
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}