/**
 * Modal de selección de variantes simplificado
 * Solo muestra selección de talle (el color ya está definido en el producto)
 * Agrega automáticamente 1 unidad al carrito sin selector de cantidad
 */
"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Product } from "@/lib/types"

interface ProductVariantModalProps {
  product: Product
  onClose: () => void
  onAddToCart: (product: Product, size: string, quantity: number) => void
}

export function ProductVariantModal({ product, onClose, onAddToCart }: ProductVariantModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>("")

  const availableSizes = product.sizes.filter((s) => s.stock > 0)

  // Obtiene el stock del talle seleccionado
  const selectedSizeStock = product.sizes.find((s) => s.size === selectedSize)?.stock || 0

  const handleAddToCart = () => {
    if (!selectedSize) return
    onAddToCart(product, selectedSize, 1)
  }

  // Verifica si se puede agregar al carrito
  const canAddToCart = selectedSize && selectedSizeStock > 0

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Seleccionar Talle</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Imagen del producto */}
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
          </div>

          {/* Detalles y selección */}
          <div className="space-y-6">
            {/* Información del producto */}
            <div>
              <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{product.supplier}</p>
              <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
            </div>

            <div>
              <label className="text-sm font-semibold mb-3 block">
                Selecciona el talle {selectedSize && `- ${selectedSize}`}
              </label>
              {availableSizes.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {availableSizes.map((sizeObj) => (
                    <Button
                      key={sizeObj.size}
                      variant={selectedSize === sizeObj.size ? "default" : "outline"}
                      className="relative h-14"
                      onClick={() => setSelectedSize(sizeObj.size)}
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-bold">{sizeObj.size}</span>
                        <span className="text-[10px] opacity-70">Stock: {sizeObj.stock}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No hay talles disponibles</p>
              )}
            </div>

            {/* Stock disponible */}
            {selectedSize && (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm">
                  <span className="font-semibold">Stock disponible:</span>{" "}
                  <span className="text-primary font-bold">{selectedSizeStock} unidades</span>
                </p>
              </div>
            )}

            {/* Botón agregar al carrito */}
            <Button
              className="w-full h-12 text-base font-semibold"
              size="lg"
              disabled={!canAddToCart}
              onClick={handleAddToCart}
            >
              Agregar al Carrito
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
