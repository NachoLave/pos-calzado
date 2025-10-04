/**
 * Modal de selección de método de pago
 * Permite elegir cómo el cliente pagará la compra
 */
"use client"

import { useState } from "react"
import { CreditCard, Banknote, Smartphone, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface PaymentModalProps {
  total: number
  onClose: () => void
  onConfirm: (paymentMethod: string) => void
}

const paymentMethods = [
  {
    id: "cash",
    name: "Efectivo",
    icon: Banknote,
    description: "Pago en efectivo",
  },
  {
    id: "card",
    name: "Tarjeta",
    icon: CreditCard,
    description: "Débito o crédito",
  },
  {
    id: "transfer",
    name: "Transferencia",
    icon: Smartphone,
    description: "Transferencia bancaria",
  },
]

export function PaymentModal({ total, onClose, onConfirm }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("")

  const handleConfirm = () => {
    if (!selectedMethod) return
    onConfirm(selectedMethod)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Método de Pago</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Total a pagar */}
          <div className="bg-primary/10 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">Total a pagar</p>
            <p className="text-4xl font-bold text-primary">${total.toFixed(2)}</p>
          </div>

          {/* Métodos de pago */}
          <div className="space-y-3">
            <p className="text-sm font-semibold">Selecciona el método de pago</p>
            {paymentMethods.map((method) => {
              const Icon = method.icon
              const isSelected = selectedMethod === method.id

              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">{method.name}</p>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              Cancelar
            </Button>
            <Button className="flex-1" disabled={!selectedMethod} onClick={handleConfirm}>
              Confirmar Venta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
