"use client"

import { useState, useEffect } from "react"

export interface FavoriteItem {
  id: number
  name: string
  author: string
  price: number
  image: string
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])

  // Cargar favoritos desde cookies al inicializar
  useEffect(() => {
    const savedFavorites = getCookie("favorites")
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error("Error parsing favorites from cookies:", error)
      }
    }
  }, [])

  // Función para obtener cookie
  const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null
    return null
  }

  // Función para establecer cookie
  const setCookie = (name: string, value: string, days: number = 30) => {
    if (typeof document === "undefined") return
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
  }

  // Agregar a favoritos
  const addToFavorites = (item: FavoriteItem) => {
    const newFavorites = [...favorites, item]
    setFavorites(newFavorites)
    setCookie("favorites", JSON.stringify(newFavorites))
  }

  // Remover de favoritos
  const removeFromFavorites = (id: number) => {
    const newFavorites = favorites.filter((item) => item.id !== id)
    setFavorites(newFavorites)
    setCookie("favorites", JSON.stringify(newFavorites))
  }

  // Verificar si está en favoritos
  const isFavorite = (id: number) => {
    return favorites.some((item) => item.id === id)
  }

  // Toggle favorito
  const toggleFavorite = (item: FavoriteItem) => {
    if (isFavorite(item.id)) {
      removeFromFavorites(item.id)
    } else {
      addToFavorites(item)
    }
  }

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  }
}