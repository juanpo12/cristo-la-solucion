"use client"

import { createContext, useContext, useEffect, useReducer, ReactNode } from "react"

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

interface CartContextType extends CartState {
  dispatch: React.Dispatch<CartAction>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }): ReactNode {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 })

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

  return (
    <CartContext.Provider value={{ ...state, dispatch }
    }>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}