/**
 * Modal de tipo de pago
 * Permite elegir entre Pago Completo o Seña, y luego el método de pago
 */
"use client"

import { useState } from "react"
import { CreditCard, Banknote, Smartphone, Check, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface PaymentTypeModalProps {
  total: number
  onClose: () => void
  onComplete: () => void
}

const paymentMethods = [
  {
    id: "cash",
    name: "Efectivo",
    icon: Banknote,
  },
  {
    id: "credit",
    name: "Tarjeta de Crédito",
    icon: CreditCard,
  },
  {
    id: "debit",
    name: "Tarjeta de Débito",
    icon: CreditCard,
  },
  {
    id: "transfer",
    name: "Transferencia",
    icon: Smartphone,
  },
]

export function PaymentTypeModal({ total, onClose, onComplete }: PaymentTypeModalProps) {
  const [step, setStep] = useState<"type" | "deposit" | "payment">("type")
  const [paymentType, setPaymentType] = useState<"full" | "deposit" | null>(null)
  const [depositAmount, setDepositAmount] = useState<string>("")
  const [selectedMethod, setSelectedMethod] = useState<string>("")

  // Calcula el monto a pagar y el saldo restante
  const amountToPay = paymentType === "deposit" ? Number.parseFloat(depositAmount) || 0 : total
  const remainingAmount = total - amountToPay

  const handleTypeSelect = (type: "full" | "deposit") => {
    setPaymentType(type)
    if (type === "full") {
      // Si es pago completo, va directo a selección de método
      setStep("payment")
    } else {
      // Si es seña, va a la pantalla de ingreso de monto
      setStep("deposit")
    }
  }

  // Maneja continuar desde seña a método de pago
  const handleDepositContinue = () => {
    if (Number.parseFloat(depositAmount) > 0 && Number.parseFloat(depositAmount) <= total) {
      setStep("payment")
    }
  }

  // Maneja confirmar la venta
  const handleConfirm = () => {
    if (!selectedMethod) return
    console.log("Venta confirmada:", { paymentType, amountToPay, remainingAmount, selectedMethod })
    onComplete()
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {step === "type" ? "Tipo de Pago" : step === "deposit" ? "Monto de Seña" : "Método de Pago"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {step !== "type" && (
            <div className="space-y-2">
              {step === "deposit" && (
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Total de la compra</p>
                  <p className="text-2xl font-bold">${total.toFixed(2)}</p>
                </div>
              )}

              {step === "payment" && paymentType === "deposit" && (
                <div className="bg-amber-500/10 rounded-lg p-3 text-center border border-amber-500/20">
                  <p className="text-sm text-muted-foreground mb-1">Saldo Restante</p>
                  <p className="text-2xl font-bold text-amber-600">${remainingAmount.toFixed(2)}</p>
                </div>
              )}

              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">
                  {step === "payment" && paymentType === "deposit" ? "Monto de la Seña" : "Total a Pagar"}
                </p>
                <p className="text-4xl font-bold text-primary">${amountToPay.toFixed(2)}</p>
              </div>
            </div>
          )}

          {step === "type" && (
            <>
              <div className="bg-primary/10 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Total</p>
                <p className="text-4xl font-bold text-primary">${total.toFixed(2)}</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold">¿Cómo desea pagar?</p>

                {/* Pago Completo */}
                <button
                  onClick={() => handleTypeSelect("full")}
                  className="w-full flex items-center gap-4 p-4 rounded-lg border-2 border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">Pago Completo</p>
                    <p className="text-sm text-muted-foreground">Pagar el total ahora</p>
                  </div>
                </button>

                {/* Seña */}
                <button
                  onClick={() => handleTypeSelect("deposit")}
                  className="w-full flex items-center gap-4 p-4 rounded-lg border-2 border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">Seña</p>
                    <p className="text-sm text-muted-foreground">Dejar un anticipo</p>
                  </div>
                </button>
              </div>
            </>
          )}

          {step === "deposit" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Ingrese el monto de la seña</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg font-semibold">$</span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="text-lg pl-8 h-12"
                    min="0"
                    max={total}
                    step="0.01"
                    autoFocus
                  />
                </div>
              </div>

              <Button
                className="w-full h-12"
                onClick={handleDepositContinue}
                disabled={
                  !depositAmount || Number.parseFloat(depositAmount) <= 0 || Number.parseFloat(depositAmount) > total
                }
              >
                Continuar
              </Button>
            </div>
          )}

          {/* Paso 3: Selección de método de pago */}
          {step === "payment" && (
            <>
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
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    if (paymentType === "deposit") {
                      setStep("deposit")
                    } else {
                      setStep("type")
                    }
                    setSelectedMethod("")
                  }}
                >
                  Volver
                </Button>
                <Button className="flex-1" disabled={!selectedMethod} onClick={handleConfirm}>
                  Confirmar Venta
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
