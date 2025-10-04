/**
 * Página de Ventas - Vista general de ventas del día
 * Muestra el detalle de todas las ventas realizadas antes de acceder al POS
 */
"use client"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, DollarSign, CreditCard, Banknote, Smartphone } from "lucide-react"
import { dailySales, cashRegister } from "@/lib/mock-data"

export default function VentasPage() {
  // Calcula totales por método de pago
  const paymentTotals = dailySales.reduce(
    (acc, sale) => {
      acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.total
      return acc
    },
    {} as Record<string, number>,
  )

  const totalDay = dailySales.reduce((sum, sale) => sum + sale.total, 0)

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header con botón para nueva venta */}
        <div className="flex items-center justify-between ml-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Ventas del Día</h1>
            <p className="text-muted-foreground">Detalle de todas las transacciones</p>
          </div>
          <Link href="/ventas/pos">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Nueva Venta
            </Button>
          </Link>
        </div>

        {/* Resumen del día */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total del día */}
          <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-6 w-6" />
              <p className="text-sm font-medium opacity-90">Total del Día</p>
            </div>
            <p className="text-3xl font-bold">${totalDay.toLocaleString()}</p>
          </Card>

          {/* Efectivo */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Banknote className="h-5 w-5 text-green-600" />
              <p className="text-sm text-muted-foreground">Efectivo</p>
            </div>
            <p className="text-2xl font-bold">${(paymentTotals.cash || 0).toLocaleString()}</p>
          </Card>

          {/* Tarjeta Crédito */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-muted-foreground">T. Crédito</p>
            </div>
            <p className="text-2xl font-bold">${(paymentTotals.credit || 0).toLocaleString()}</p>
          </Card>

          {/* Tarjeta Débito */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              <p className="text-sm text-muted-foreground">T. Débito</p>
            </div>
            <p className="text-2xl font-bold">${(paymentTotals.debit || 0).toLocaleString()}</p>
          </Card>

          {/* Transferencia */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Smartphone className="h-5 w-5 text-cyan-600" />
              <p className="text-sm text-muted-foreground">Transferencia</p>
            </div>
            <p className="text-2xl font-bold">${(paymentTotals.transfer || 0).toLocaleString()}</p>
          </Card>
        </div>

        {/* Inicio de caja */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Inicio de Caja</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Monto Inicial</p>
              <p className="text-xl font-bold">${cashRegister.initialAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Hora Apertura</p>
              <p className="text-xl font-bold">{cashRegister.openTime}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Responsable</p>
              <p className="text-xl font-bold">{cashRegister.cashier}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Estado</p>
              <Badge className="bg-green-600">Abierta</Badge>
            </div>
          </div>
        </Card>

        {/* Lista de ventas */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Detalle de Ventas ({dailySales.length})</h3>
          <div className="space-y-3">
            {dailySales.map((sale) => (
              <div
                key={sale.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge
                      variant={sale.type === "sale" ? "default" : sale.type === "deposit" ? "secondary" : "outline"}
                    >
                      {sale.type === "sale" ? "Venta" : sale.type === "deposit" ? "Seña" : "Cambio"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{sale.time}</span>
                  </div>
                  <p className="font-medium mb-1">{sale.items}</p>
                  <p className="text-sm text-muted-foreground">
                    Pago:{" "}
                    {sale.paymentMethod === "cash"
                      ? "Efectivo"
                      : sale.paymentMethod === "credit"
                        ? "T. Crédito"
                        : sale.paymentMethod === "debit"
                          ? "T. Débito"
                          : "Transferencia"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">${sale.total.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
