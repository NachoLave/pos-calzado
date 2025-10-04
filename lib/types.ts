/**
 * Tipos de datos para el sistema POS
 * Define las interfaces para productos, variantes y carrito
 */

export interface ProductSize {
  size: string
  stock: number
}

export interface Product {
  id: string
  name: string
  category: "shoes" | "boots" | "bags" | "belts"
  price: number
  image: string
  supplier: string
  sizes: ProductSize[]
  totalStock: number
}

export interface CartItem {
  id: string
  product: Product
  size: string
  quantity: number
  customPrice?: number // Precio personalizado si fue editado
  discount: number // Descuento en porcentaje (0-100)
}

export interface Sale {
  id: string
  time: string
  type: "sale" | "deposit" | "exchange"
  items: string
  total: number
  paymentMethod: "cash" | "credit" | "debit" | "transfer"
}

export interface DashboardStats {
  todaySales: number
  monthSales: number
  branchSales: number
  topSupplier: {
    name: string
    productsSold: number
  }
  monthlySales: Array<{
    month: string
    sucursal1: number
    sucursal2: number
    sucursal3: number
  }>
}
