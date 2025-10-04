/**
 * Nombres de las colecciones de MongoDB
 * Centraliza los nombres para evitar errores de tipeo
 */

export const Collections = {
  USERS: "usuarios",
  BRANCHES: "sucursales",
  PRICE_LISTS: "listas_precio",
  SUPPLIERS: "proveedores",
  PRODUCT_TYPES: "tipos_producto",
  PRODUCTS: "productos",
  PRODUCT_VARIANTS: "variantes_producto",
  STOCK: "stock",
  SALES: "ventas",
  CASH_REGISTERS: "cajas",
} as const
