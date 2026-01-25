'use client'

import { useState, useEffect } from 'react'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
    Settings,
    Tags,
    Plus,
    Pencil,
    Trash2,
    Loader2,
    Save,
    X,
    CheckCircle,
    XCircle,
    AlertTriangle
} from 'lucide-react'

interface Category {
    id: number
    name: string
    slug: string
    active: boolean
    createdAt: string
    description?: string
    icon?: string
}

export default function SettingsPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [saving, setSaving] = useState(false)

    // Form states
    const [formData, setFormData] = useState({ name: '', description: '' })

    const loadCategories = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/admin/categories')
            if (res.ok) {
                const data = await res.json()
                setCategories(data)
            }
        } catch (error) {
            console.error('Error loading categories:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadCategories()
    }, [])

    const handleEditClick = (category: Category) => {
        setEditingCategory(category)
        setFormData({
            name: category.name,
            description: category.description || ''
        })
        setIsEditOpen(true)
    }

    const handleCreateClick = () => {
        setFormData({ name: '', description: '' })
        setIsCreateOpen(true)
    }

    const handleSaveCategory = async (isNew: boolean) => {
        if (!formData.name.trim()) return

        setSaving(true)
        try {
            const url = isNew ? '/api/admin/categories' : `/api/admin/categories/${editingCategory?.id}`
            const method = isNew ? 'POST' : 'PUT'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                await loadCategories()
                setIsEditOpen(false)
                setIsCreateOpen(false)
            } else {
                alert('Error al guardar la categoría')
            }
        } catch (error) {
            console.error('Error saving category:', error)
            alert('Error de conexión')
        } finally {
            setSaving(false)
        }
    }

    const handleToggleStatus = async (category: Category) => {
        if (!confirm(`¿Estás seguro de que deseas ${category.active ? 'desactivar' : 'activar'} esta categoría?`)) return

        try {
            const res = await fetch(`/api/admin/categories/${category.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !category.active })
            })

            if (res.ok) {
                loadCategories()
            }
        } catch (error) {
            console.error('Error updating status:', error)
        }
    }

    const handleDelete = async (category: Category) => {
        if (!confirm('¿Estás seguro de eliminar esta categoría? Esta acción no se puede deshacer.')) return

        try {
            const res = await fetch(`/api/admin/categories/${category.id}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                loadCategories()
            }
        } catch (error) {
            console.error('Error deleting category:', error)
        }
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100">
            <AdminSidebar />

            <div className="flex-1 lg:ml-72">
                <div className="p-4 md:p-6 lg:p-8">
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Configuración
                        </h1>
                        <p className="text-gray-600">
                            Administra las configuraciones generales de la tienda
                        </p>
                    </div>

                    <Tabs defaultValue="categories" className="space-y-6">
                        <TabsList className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                            <TabsTrigger value="categories" className="data-[state=active]:bg-church-electric-50 data-[state=active]:text-church-electric-700">
                                <Tags className="w-4 h-4 mr-2" />
                                Categorías
                            </TabsTrigger>
                            <TabsTrigger value="general" className="data-[state=active]:bg-church-electric-50 data-[state=active]:text-church-electric-700">
                                <Settings className="w-4 h-4 mr-2" />
                                General
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="categories">
                            <Card className="border-none shadow-sm bg-white/80 backdrop-blur">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>Categorías del Catálogo</CardTitle>
                                        <CardDescription>Gestiona las categorías de productos de la tienda</CardDescription>
                                    </div>
                                    <Button onClick={handleCreateClick} className="bg-church-electric-600 hover:bg-church-electric-700 text-white">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Nueva Categoría
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="text-center py-8">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-church-electric-600" />
                                            <p className="text-gray-500 mt-2">Cargando categorías...</p>
                                        </div>
                                    ) : categories.length === 0 ? (
                                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                            <Tags className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                            <p className="text-gray-500 font-medium">No hay categorías creadas</p>
                                        </div>
                                    ) : (
                                        <div className="overflow-hidden rounded-xl border border-gray-200">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {categories.map((category) => (
                                                        <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                                                {category.description && (
                                                                    <div className="text-xs text-gray-500">{category.description}</div>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                                                                    {category.slug}
                                                                </code>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <Badge
                                                                    variant={category.active ? "default" : "secondary"}
                                                                    className={category.active ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}
                                                                >
                                                                    {category.active ? "Activa" : "Inactiva"}
                                                                </Badge>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleToggleStatus(category)}
                                                                        title={category.active ? "Desactivar" : "Activar"}
                                                                    >
                                                                        {category.active ?
                                                                            <XCircle className="w-4 h-4 text-orange-500" /> :
                                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                                        }
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleEditClick(category)}
                                                                        className="text-church-electric-600 hover:text-church-electric-700 hover:bg-church-electric-50"
                                                                    >
                                                                        <Pencil className="w-4 h-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleDelete(category)}
                                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="general">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Configuración General</CardTitle>
                                    <CardDescription>Ajustes generales de la aplicación</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-8 text-gray-500">
                                        <Settings className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>Próximamente más configuraciones...</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* Modal Crear */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nueva Categoría</DialogTitle>
                        <DialogDescription>Crea una nueva categoría para tus productos.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="create-name">Nombre</Label>
                            <Input
                                id="create-name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Ej: Libros, Música..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="create-desc">Descripción (opcional)</Label>
                            <Input
                                id="create-desc"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Breve descripción..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                        <Button
                            onClick={() => handleSaveCategory(true)}
                            disabled={saving || !formData.name.trim()}
                            className="bg-church-electric-600"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Crear Categoría
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Editar */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Categoría</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-name">Nombre</Label>
                            <Input
                                id="edit-name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-desc">Descripción</Label>
                            <Input
                                id="edit-desc"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
                        <Button
                            onClick={() => handleSaveCategory(false)}
                            disabled={saving || !formData.name.trim()}
                            className="bg-church-electric-600"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
