/**
 * Modelos y tipos de datos para MongoDB
 * Define la estructura de todas las colecciones
 */

import type { ObjectId } from "mongodb"

// ============================================
// USUARIOS Y PERMISOS
// ============================================

export type UserRole = "dueño" | "empleado"

export interface Permission {
  verDatosInicio: boolean // Ver dashboard principal
  verReportes: boolean // Ver reportes
  verVentasTodasSucursales: boolean // Ver ventas de todas las sucursales
  administrarCostos: boolean // Ver y editar costos de productos
  verVentasOtrasSucursales: boolean // Ver cuánto se vendió en otras sucursales
  verVentasTiendaNube: boolean // Ver ventas de Tienda Nube
  administrarStockOtrasSucursales: boolean // Administrar stock de otras sucursales
}

export interface User {
  _id?: ObjectId
  nombre: string
  email: string
  password: string // Hash de la contraseña
  rol: UserRole
  sucursalId: ObjectId // Sucursal a la que pertenece
  permisos: Permission
  activo: boolean
  creadoEn: Date
  actualizadoEn: Date
}

// ============================================
// SUCURSALES
// ============================================

export interface Branch {
  _id?: ObjectId
  nombre: string
  direccion: string
  telefono?: string
  activa: boolean
  creadoEn: Date
  actualizadoEn: Date
}

// ============================================
// LISTAS DE PRECIO
// ============================================

export interface PriceList {
  _id?: ObjectId
  nombre: string // Ej: "Precio Efectivo", "Precio Tarjeta", "Precio Mayorista"
  descripcion?: string
  descuentoPorcentaje?: number // Descuento aplicado (puede ser negativo para recargo)
  activa: boolean
  creadoEn: Date
  actualizadoEn: Date
}

// ============================================
// PROVEEDORES
// ============================================

export interface Supplier {
  _id?: ObjectId
  nombre: string
  contacto?: string
  telefono?: string
  email?: string
  direccion?: string
  activo: boolean
  creadoEn: Date
  actualizadoEn: Date
}

// ============================================
// TIPOS DE PRODUCTO
// ============================================

export interface ProductType {
  _id?: ObjectId
  nombre: string // Ej: "Zapatos", "Botas", "Carteras", "Cinturones"
  descripcion?: string
  tieneDescuentoEfectivo: boolean // Si aplica descuento del 20% en efectivo
  activo: boolean
  creadoEn: Date
  actualizadoEn: Date
}

// ============================================
// PRODUCTOS Y VARIANTES
// ============================================

export interface ProductVariantDefinition {
  nombre: string // Ej: "Talle", "Color", "Peso"
  valores: string[] // Ej: ["35", "36", "37"] o ["Negro", "Marrón"]
}

export interface ProductPrice {
  listaPrecioId: ObjectId
  precio: number
}

export interface ProductVariant {
  _id?: ObjectId
  productoBaseId: ObjectId // Referencia al producto base
  nombreCompleto: string // Ej: "Mocasines Marrón - Talle 40 - Negro"
  codigoSKU: string // Ej: "MOC-MAR-40-NEG"
  variantes: Record<string, string> // Ej: { "talle": "40", "color": "Negro" }
  precios: ProductPrice[] // Precios según lista
  costo?: number // Solo visible con permiso
  imagenUrl?: string
  activo: boolean
  creadoEn: Date
  actualizadoEn: Date
}

export interface Product {
  _id?: ObjectId
  nombre: string // Nombre base del producto
  descripcion?: string
  proveedorId: ObjectId
  tipoProductoId: ObjectId
  definicionVariantes: ProductVariantDefinition[] // Define qué variantes tiene este producto
  imagenUrl?: string // Imagen principal del producto
  activo: boolean
  creadoEn: Date
  actualizadoEn: Date
}

// ============================================
// STOCK
// ============================================

export interface Stock {
  _id?: ObjectId
  varianteProductoId: ObjectId // Referencia a ProductVariant
  sucursalId: ObjectId
  cantidad: number
  cantidadMinima?: number // Para alertas de stock bajo
  actualizadoEn: Date
}

// ============================================
// VENTAS
// ============================================

export type SaleType = "venta" | "cambio" | "seña"
export type PaymentMethod = "efectivo" | "tarjeta_credito" | "tarjeta_debito" | "transferencia"

export interface SaleItem {
  varianteProductoId: ObjectId
  nombreProducto: string
  variantes: Record<string, string>
  cantidad: number
  precioUnitario: number // Precio al momento de la venta
  descuento: number // Descuento aplicado en porcentaje
  subtotal: number // (precioUnitario * cantidad) - descuento
}

export interface Sale {
  _id?: ObjectId
  numeroVenta: string // Número único de venta
  sucursalId: ObjectId
  usuarioId: ObjectId // Usuario que realizó la venta
  tipo: SaleType
  items: SaleItem[]
  subtotal: number
  descuentoTotal: number
  total: number
  metodoPago: PaymentMethod
  montoSeña?: number // Si es seña, cuánto dejó
  saldoPendiente?: number // Si es seña, cuánto falta
  observaciones?: string
  fecha: Date
  creadoEn: Date
}

// ============================================
// CAJA
// ============================================

export interface CashRegister {
  _id?: ObjectId
  sucursalId: ObjectId
  usuarioId: ObjectId
  montoInicial: number
  montoFinal?: number
  fecha: Date
  horaApertura: Date
  horaCierre?: Date
  abierta: boolean
  ventasEfectivo: number
  ventasTarjeta: number
  ventasTransferencia: number
  totalVentas: number
  observaciones?: string
}
