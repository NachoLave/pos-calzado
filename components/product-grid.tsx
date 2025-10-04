"use client"

/**
 * Grid de productos - Muestra todos los productos disponibles
 * Componente optimizado para visualización en tablets
 */
import Image from "next/image"
import { Card } from "@/components/ui/card"
import type { Product } from "@/lib/types"

interface ProductGridProps {
  products: Product[]
  onProductClick: (product: Product) => void
}

export function ProductGrid({ products, onProductClick }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p>No se encontraron productos</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {products.map((product) => (
        <Card
          key={product.id}
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02] overflow-hidden group"
          onClick={() => onProductClick(product)}
        >
          <div className="relative aspect-square bg-muted overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Badge de stock bajo */}
            {product.totalStock < 5 && product.totalStock > 0 && (
              <div className="absolute top-1 right-1 bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                Stock bajo
              </div>
            )}
            {/* Badge sin stock */}
            {product.totalStock === 0 && (
              <div className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-[10px] px-1.5 py-0.5 rounded-full font-medium">
                Sin stock
              </div>
            )}
          </div>

          <div className="p-2">
            <h3 className="font-semibold text-xs mb-0.5 line-clamp-2 text-balance leading-tight">{product.name}</h3>
            <p className="text-[10px] text-muted-foreground mb-1">{product.supplier}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-primary">${product.price.toFixed(2)}</span>
              <span className="text-[10px] text-muted-foreground">Stock: {product.totalStock}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
