"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Loader2, DollarSign } from "lucide-react"
import { useDonation } from "@/lib/hooks/use-donation"

interface DonationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [amount, setAmount] = useState("")
  const { redirectToDonation, isLoading, error } = useDonation()



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const donationAmount = parseFloat(amount)
    
    if (!donationAmount || donationAmount <= 0) {
      return
    }


    await redirectToDonation(donationAmount)
  }



  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Heart className="w-6 h-6 text-red-500" />
            Hacer una Donación
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Monto de donación */}
          <div>
            <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
              Monto a donar
            </Label>
            <div className="relative mt-1">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="amount"
                type="number"
                placeholder="Ingresa el monto"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-10"
                min="1"
                step="1"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Monto mínimo: $1 ARS
            </p>
          </div>

         

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isLoading || !amount || parseFloat(amount) <= 0}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  Donar {amount && formatCurrency(parseFloat(amount))}
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="text-center pt-4 border-t">
          <p className="text-xs text-gray-500">
            Serás redirigido a MercadoPago para completar tu donación de forma segura.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}