/**
 * Página del Punto de Venta (POS)
 * Sistema optimizado para tablets con gestión de productos de calzado y accesorios
 */
"use client"

import { useState } from "react"
import { ProductGrid } from "@/components/product-grid"
import { ShoppingCart } from "@/components/shopping-cart"
import { SearchBar } from "@/components/search-bar"
import { ProductFilters } from "@/components/product-filters"
import { ProductVariantModal } from "@/components/product-variant-modal"
import { PaymentTypeModal } from "@/components/payment-type-modal"
import { products } from "@/lib/mock-data"
import type { Product, CartItem } from "@/lib/types"

export default function POSPage() {
  // Estado para el carrito de compras
  const [cart, setCart] = useState<CartItem[]>([])

  // Estado para el producto seleccionado (modal de variantes)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Estado para mostrar el modal de tipo de pago
  const [showPaymentTypeModal, setShowPaymentTypeModal] = useState(false)

  // Estado para búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all")

  /**
   * Filtra los productos según búsqueda y filtros activos
   */
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesSupplier = selectedSupplier === "all" || product.supplier === selectedSupplier

    return matchesSearch && matchesCategory && matchesSupplier
  })

  /**
   * Maneja el click en un producto para abrir el modal de variantes
   */
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
  }

  /**
   * Agrega un producto con talle específico al carrito
   */
  const handleAddToCart = (product: Product, size: string, quantity: number) => {
    const cartItem: CartItem = {
      id: `${product.id}-${size}`,
      product,
      size,
      quantity,
      discount: 0,
    }

    setCart((prevCart) => {
      // Verifica si el item ya existe en el carrito
      const existingItemIndex = prevCart.findIndex((item) => item.id === cartItem.id)

      if (existingItemIndex > -1) {
        // Actualiza la cantidad si ya existe
        const newCart = [...prevCart]
        newCart[existingItemIndex].quantity += quantity
        return newCart
      }

      // Agrega nuevo item al carrito
      return [...prevCart, cartItem]
    })

    // Cierra el modal después de agregar
    setSelectedProduct(null)
  }

  /**
   * Elimina un item del carrito
   */
  const handleRemoveFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId))
  }

  /**
   * Actualiza la cantidad de un item en el carrito
   */
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(itemId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
  }

  const handleUpdatePrice = (itemId: string, price: number) => {
    setCart((prevCart) => prevCart.map((item) => (item.id === itemId ? { ...item, customPrice: price } : item)))
  }

  const handleUpdateDiscount = (itemId: string, discount: number) => {
    setCart((prevCart) => prevCart.map((item) => (item.id === itemId ? { ...item, discount } : item)))
  }

  /**
   * Procesa el pago y limpia el carrito
   */
  const handleCompleteSale = () => {
    // Aquí se conectaría con la base de datos para registrar la venta
    console.log("Venta completada:", { cart })

    // Limpia el carrito
    setCart([])
    setShowPaymentTypeModal(false)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Panel izquierdo - Productos */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barra de búsqueda y filtros */}
        <div className="p-4 border-b border-border bg-card ml-12">
          <div className="flex gap-3">
            <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Buscar productos..." />
            <ProductFilters
              selectedCategory={selectedCategory}
              selectedSupplier={selectedSupplier}
              onCategoryChange={setSelectedCategory}
              onSupplierChange={setSelectedSupplier}
            />
          </div>
        </div>

        {/* Grid de productos */}
        <div className="flex-1 overflow-y-auto p-4">
          <ProductGrid products={filteredProducts} onProductClick={handleProductClick} />
        </div>
      </div>

      {/* Panel derecho - Carrito */}
      <div className="w-[380px] border-l border-border bg-card">
        <ShoppingCart
          items={cart}
          onRemoveItem={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
          onUpdatePrice={handleUpdatePrice}
          onUpdateDiscount={handleUpdateDiscount}
          onCheckout={() => setShowPaymentTypeModal(true)}
        />
      </div>

      {/* Modal de selección de variantes */}
      {selectedProduct && (
        <ProductVariantModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Modal de tipo de pago (Seña o Pago Completo) */}
      {showPaymentTypeModal && (
        <PaymentTypeModal
          total={cart.reduce((sum, item) => sum + (item.customPrice ?? item.product.price) * item.quantity, 0)}
          onClose={() => setShowPaymentTypeModal(false)}
          onComplete={handleCompleteSale}
        />
      )}
    </div>
  )
}
