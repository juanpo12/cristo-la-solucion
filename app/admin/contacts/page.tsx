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
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando contactos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contactos y Peticiones</h1>
              <p className="text-gray-600 mt-1">
                Gestiona las peticiones y consultas recibidas
              </p>
            </div>
            
            {/* Filtros */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
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
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
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
        </div>

        {/* Estadísticas */}
        {stats && (
          <div className="px-6 py-4 bg-white border-b">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Contactos</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pendientes</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.byStatus.pending}</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Leídos</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.byStatus.read}</p>
                    </div>
                    <Eye className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Respondidos</p>
                      <p className="text-2xl font-bold text-green-600">{stats.byStatus.responded}</p>
                    </div>
                    <CheckCheck className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Lista de contactos */}
            <div className="w-1/2 border-r bg-white overflow-y-auto">
              {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-400">
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              
              {contacts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay contactos para mostrar</p>
                </div>
              ) : (
                <div className="divide-y">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedContact?.id === contact.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                      }`}
                      onClick={() => setSelectedContact(contact)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                          <p className="text-sm text-gray-600">{contact.email}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <Badge className={`${getStatusColor(contact.status)} text-xs`}>
                            <span className="flex items-center space-x-1">
                              {getStatusIcon(contact.status)}
                              <span>{getStatusText(contact.status)}</span>
                            </span>
                          </Badge>
                          <Badge className={`${getTypeColor(contact.type)} text-xs`}>
                            {getTypeText(contact.type)}
                          </Badge>
                        </div>
                      </div>
                      
                      {contact.subject && (
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          {contact.subject}
                        </p>
                      )}
                      
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {contact.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(contact.createdAt)}
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedContact(contact)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Detalles del Contacto</DialogTitle>
                                <DialogDescription>
                                  Información completa del contacto #{contact.id}
                                </DialogDescription>
                              </DialogHeader>
                              
                              {selectedContact && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Nombre</label>
                                      <p className="text-sm text-gray-900">{selectedContact.name}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Email</label>
                                      <p className="text-sm text-gray-900">{selectedContact.email}</p>
                                    </div>
                                    {selectedContact.phone && (
                                      <div>
                                        <label className="text-sm font-medium text-gray-700">Teléfono</label>
                                        <p className="text-sm text-gray-900">{selectedContact.phone}</p>
                                      </div>
                                    )}
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Tipo</label>
                                      <Badge variant="outline">{getTypeLabel(selectedContact.type)}</Badge>
                                    </div>
                                  </div>
                                  
                                  {selectedContact.subject && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Asunto</label>
                                      <p className="text-sm text-gray-900">{selectedContact.subject}</p>
                                    </div>
                                  )}
                                  
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Mensaje</label>
                                    <div className="mt-1 p-3 bg-gray-50 rounded-md">
                                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Estado</label>
                                      <div className="mt-1">
                                        <Select
                                          value={selectedContact.status}
                                          onValueChange={(value) => {
                                            updateContactStatus(selectedContact.id, value as Contact['status'])
                                            setSelectedContact({...selectedContact, status: value as Contact['status']})
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
                                      <p className="text-sm text-gray-900">
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
                            onClick={() => updateContactStatus(contact.id, contact.status === 'read' ? 'responded' : 'read')}
                          >
                            {contact.status === 'pending' ? (
                              <Eye className="h-4 w-4" />
                            ) : contact.status === 'read' ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <MessageCircle className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Paginación */}
              {pagination && pagination.totalPages > 1 && (
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Página {pagination.page} de {pagination.totalPages} 
                      ({pagination.total} contactos)
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.hasPrev}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.hasNext}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                      >
                        Siguiente
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Detalle del contacto */}
            <div className="w-1/2 bg-white overflow-y-auto">
              {selectedContact ? (
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {selectedContact.name}
                      </h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {selectedContact.email}
                        </div>
                        {selectedContact.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {selectedContact.phone}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={`${getStatusColor(selectedContact.status)}`}>
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(selectedContact.status)}
                          <span>{getStatusText(selectedContact.status)}</span>
                        </span>
                      </Badge>
                      <Badge className={`${getTypeColor(selectedContact.type)}`}>
                        {getTypeText(selectedContact.type)}
                      </Badge>
                    </div>
                  </div>

                  {selectedContact.subject && (
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Asunto</h3>
                      <p className="text-gray-700">{selectedContact.subject}</p>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Mensaje</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {selectedContact.message}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Información</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Recibido:</span>
                        <p className="font-medium">{formatDate(selectedContact.createdAt)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Actualizado:</span>
                        <p className="font-medium">{formatDate(selectedContact.updatedAt)}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Cambiar Estado</h3>
                    <div className="flex flex-wrap gap-2">
                      {(['pending', 'read', 'responded', 'closed'] as const).map((status) => (
                        <Button
                          key={status}
                          variant={selectedContact.status === status ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateContactStatus(selectedContact.id, status)}
                          className="flex items-center space-x-1"
                        >
                          {getStatusIcon(status)}
                          <span>{getStatusText(status)}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Selecciona un contacto para ver los detalles</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}