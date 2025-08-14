"use client"

import { useEffect, useReducer } from "react"

export interface CartItem {
  id: number
  name: string
  author: string
  price: number
  image: string
  quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartItem[] }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState
  
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      
      let newItems: CartItem[]
      if (existingItem) {
        newItems = state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }]
      }

      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      newState = { items: newItems, total }
      break
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      newState = { items: newItems, total }
      break
    }

    case "UPDATE_QUANTITY": {
      const newItems = state.items.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter((item) => item.quantity > 0)

      const total = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
      newState = { items: newItems, total }
      break
    }

    case "CLEAR_CART":
      newState = { items: [], total: 0 }
      break

    case "LOAD_CART": {
      const total = action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0)
      newState = { items: action.payload, total }
      break
    }

    default:
      return state
  }

  // Guardar en localStorage después de cada cambio (excepto LOAD_CART)
  if (action.type !== "LOAD_CART" && typeof window !== "undefined") {
    try {
      if (newState.items.length > 0) {
        localStorage.setItem("cart", JSON.stringify(newState.items))
      } else {
        localStorage.removeItem("cart")
      }
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
    }
  }

  return newState
}

// Función para cargar el estado inicial desde localStorage
const getInitialState = (): CartState => {
  if (typeof window === "undefined") {
    return { items: [], total: 0 }
  }

  try {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      const cartItems = JSON.parse(savedCart)
      if (Array.isArray(cartItems) && cartItems.length > 0) {
        const total = cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0)
        return { items: cartItems, total }
      }
    }
  } catch (error) {
    console.error("Error loading cart from localStorage:", error)
  }

  return { items: [], total: 0 }
}

export function useCart() {
  const [state, dispatch] = useReducer(cartReducer, getInitialState())

  // Cargar desde localStorage solo una vez al montar el componente
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedCart = localStorage.getItem("cart")
        if (savedCart) {
          const cartItems = JSON.parse(savedCart)
          if (Array.isArray(cartItems) && cartItems.length > 0) {
            dispatch({ type: "LOAD_CART", payload: cartItems })
          }
        }
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  return {
    ...state,
    dispatch,
  }
}