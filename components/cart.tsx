"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, X, Plus, Minus, Trash2 } from "lucide-react"
import { useCart } from "@/lib/hooks/use-cart"
import { CheckoutModal } from "@/components/checkout-modal"
import Image from "next/image"

export function Cart() {
  const [isOpen, setIsOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const { items, total, dispatch } = useCart()
  const state = { items, total, itemCount: items.length }

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  return (
    <>
      {/* Botón flotante del carrito */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="relative bg-church-electric-600 hover:bg-church-electric-700 text-white rounded-full w-16 h-16 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110"
        >
          <ShoppingCart className="w-6 h-6" />
          {state.itemCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
              {state.itemCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar del carrito */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold church-text flex items-center">
              <ShoppingCart className="w-6 h-6 mr-2" />
              Carrito ({state.itemCount})
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="rounded-full p-2">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Contenido del carrito */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
                <p className="text-gray-400 text-sm mt-2">Añade algunos libros para comenzar</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                    <div className="relative w-16 h-20 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold church-text text-sm leading-tight mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 mb-2">{item.author}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-church-electric-600">${item.price.toFixed(2)}</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 p-0 rounded-full"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 p-0 rounded-full"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="w-8 h-8 p-0 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="church-text">Total:</span>
                <span className="text-church-electric-600">${state.total.toFixed(2)}</span>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full church-button-primary h-12 text-lg"
                >
                  Proceder al Pago
                </Button>
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="w-full h-10 text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                >
                  Vaciar Carrito
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Checkout */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  )
}
