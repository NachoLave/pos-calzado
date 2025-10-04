"use client"

/**
 * Carrito de compras - Panel lateral derecho
 * Muestra los items seleccionados con precios editables, descuentos y botones de precio efectivo/tarjeta
 */
import { CarIcon as CartIcon, Trash2, Plus, Minus, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import type { CartItem } from "@/lib/types"
import { useState } from "react"

interface ShoppingCartProps {
  items: CartItem[]
  onRemoveItem: (itemId: string) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onUpdatePrice: (itemId: string, price: number) => void
  onUpdateDiscount: (itemId: string, discount: number) => void
  onCheckout: () => void
}

export function ShoppingCart({
  items,
  onRemoveItem,
  onUpdateQuantity,
  onUpdatePrice,
  onUpdateDiscount,
  onCheckout,
}: ShoppingCartProps) {
  const [priceType, setPriceType] = useState<"cash" | "card">("cash")
  const [editingPrice, setEditingPrice] = useState<string | null>(null)

  const getItemPrice = (item: CartItem) => {
    const basePrice = item.customPrice ?? item.product.price
    let price = basePrice

    // Aplica descuento de tarjeta si corresponde
    if (priceType === "card" && (item.product.category === "shoes" || item.product.category === "boots")) {
      price = basePrice * 0.8 // 20% de descuento
    }

    // Aplica descuento adicional si existe
    if (item.discount > 0) {
      price = price * (1 - item.discount / 100)
    }

    return price
  }

  // Calcula el total del carrito
  const total = items.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0)

  return (
    <div className="flex flex-col h-full">
      {/* Header del carrito */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <CartIcon className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Carrito</h2>
          <span className="ml-auto text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      {/* Lista de items */}
      <ScrollArea className="flex-1">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <CartIcon className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">El carrito está vacío</p>
            <p className="text-sm text-muted-foreground mt-1">Selecciona productos para comenzar</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {items.map((item) => {
              const itemPrice = getItemPrice(item)
              const isEditingThisPrice = editingPrice === item.id

              return (
                <div key={item.id} className="bg-muted/50 rounded-lg p-3 space-y-2">
                  {/* Nombre del producto */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2">{item.product.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">Talle {item.size}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    {isEditingThisPrice ? (
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          defaultValue={item.customPrice ?? item.product.price}
                          className="h-8 text-sm"
                          onBlur={(e) => {
                            const newPrice = Number.parseFloat(e.target.value)
                            if (newPrice > 0) {
                              onUpdatePrice(item.id, newPrice)
                            }
                            setEditingPrice(null)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.currentTarget.blur()
                            }
                          }}
                          autoFocus
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingPrice(item.id)}
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                      >
                        <span className="font-semibold text-primary">${(itemPrice * item.quantity).toFixed(2)}</span>
                        <Edit2 className="w-3 h-3 text-muted-foreground" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground">Desc.:</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={item.discount}
                      onChange={(e) => {
                        const discount = Math.min(100, Math.max(0, Number.parseFloat(e.target.value) || 0))
                        onUpdateDiscount(item.id, discount)
                      }}
                      className="h-7 w-16 text-xs"
                    />
                    <span className="text-xs text-muted-foreground">%</span>
                  </div>

                  {/* Controles de cantidad */}
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </ScrollArea>

      {items.length > 0 && (
        <div className="p-4 border-t border-border space-y-4">
          {/* Botones de tipo de precio */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={priceType === "cash" ? "default" : "outline"}
              onClick={() => setPriceType("cash")}
              className="h-10"
            >
              Precio Efectivo
            </Button>
            <Button
              variant={priceType === "card" ? "default" : "outline"}
              onClick={() => setPriceType("card")}
              className="h-10"
            >
              Precio Tarjeta
              <span className="ml-1 text-xs opacity-70">(-20%)</span>
            </Button>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
          </div>

          <Button className="w-full h-12 text-base font-semibold" size="lg" onClick={onCheckout}>
            Procesar Venta
          </Button>
        </div>
      )}
    </div>
  )
}
