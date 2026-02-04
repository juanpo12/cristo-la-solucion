import { db } from '@/lib/db'
import { categories, type NewCategory } from '@/lib/db/schema'
import { eq, desc, asc, and, like } from 'drizzle-orm'

// Función simple para generar slug
function createSlug(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Reemplazar espacios con -
        .replace(/[^\w-]+/g, '')  // Remover caracteres no palabras
        .replace(/--+/g, '-')     // Reemplazar múltiples - con uno solo
}

export class CategoryService {
    // Obtener todas las categorías (admin)
    static async getAll() {
        try {
            return await db
                .select()
                .from(categories)
                .orderBy(desc(categories.createdAt))
        } catch (error) {
            console.error('Error getting all categories:', error)
            return []
        }
    }

    // Obtener categorías activas (tienda pública)
    static async getActive() {
        try {
            return await db
                .select()
                .from(categories)
                .where(eq(categories.active, true))
                .orderBy(asc(categories.name))
        } catch (error) {
            console.error('Error getting active categories:', error)
            return []
        }
    }

    // Obtener por ID
    static async getById(id: number) {
        try {
            const result = await db
                .select()
                .from(categories)
                .where(eq(categories.id, id))
                .limit(1)
            return result[0] || null
        } catch (error) {
            console.error('Error getting category by id:', error)
            return null
        }
    }

    // Obtener por Slug
    static async getBySlug(slug: string) {
        try {
            const result = await db
                .select()
                .from(categories)
                .where(eq(categories.slug, slug))
                .limit(1)
            return result[0] || null
        } catch (error) {
            console.error('Error getting category by slug:', error)
            return null
        }
    }

    // Crear categoría
    static async create(data: { name: string; description?: string; icon?: string }) {
        try {
            const slug = createSlug(data.name)

            // Verificar si ya existe el slug
            const existing = await this.getBySlug(slug)
            if (existing) {
                throw new Error('Ya existe una categoría con ese nombre')
            }

            const newCategory: NewCategory = {
                name: data.name,
                slug,
                description: data.description,
                icon: data.icon,
                active: true
            }

            const result = await db.insert(categories).values(newCategory).returning()
            return result[0]
        } catch (error) {
            console.error('Error creating category:', error)
            throw error
        }
    }

    // Actualizar categoría
    static async update(id: number, data: Partial<NewCategory>) {
        try {
            // Si se actualiza el nombre, actualizar también el slug
            if (data.name) {
                data.slug = createSlug(data.name)
            }

            const result = await db
                .update(categories)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(categories.id, id))
                .returning()

            return result[0] || null
        } catch (error) {
            console.error('Error updating category:', error)
            throw error
        }
    }

    // Eliminar categoría (Soft Delete)
    static async delete(id: number) {
        try {
            const result = await db
                .update(categories)
                .set({ active: false, updatedAt: new Date() })
                .where(eq(categories.id, id))
                .returning()
            return result[0] || null
        } catch (error) {
            console.error('Error deleting category:', error)
            throw error
        }
    }
}
