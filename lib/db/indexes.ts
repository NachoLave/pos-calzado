/**
 * Definición de índices para optimizar consultas
 * Se ejecuta al inicializar la base de datos
 */

import { getDb } from "@/lib/mongodb"
import { Collections } from "./collections"

export async function createIndexes() {
  const db = await getDb()

  // Índices para Usuarios
  await db
    .collection(Collections.USERS)
    .createIndexes([{ key: { email: 1 }, unique: true }, { key: { sucursalId: 1 } }, { key: { activo: 1 } }])

  // Índices para Productos
  await db
    .collection(Collections.PRODUCTS)
    .createIndexes([
      { key: { nombre: 1 } },
      { key: { proveedorId: 1 } },
      { key: { tipoProductoId: 1 } },
      { key: { activo: 1 } },
    ])

  // Índices para Variantes de Producto
  await db
    .collection(Collections.PRODUCT_VARIANTS)
    .createIndexes([{ key: { productoBaseId: 1 } }, { key: { codigoSKU: 1 }, unique: true }, { key: { activo: 1 } }])

  // Índices para Stock
  await db
    .collection(Collections.STOCK)
    .createIndexes([
      { key: { varianteProductoId: 1, sucursalId: 1 }, unique: true },
      { key: { sucursalId: 1 } },
      { key: { cantidad: 1 } },
    ])

  // Índices para Ventas
  await db.collection(Collections.SALES).createIndexes([
    { key: { numeroVenta: 1 }, unique: true },
    { key: { sucursalId: 1 } },
    { key: { usuarioId: 1 } },
    { key: { fecha: -1 } }, // Ordenar por fecha descendente
    { key: { tipo: 1 } },
    { key: { metodoPago: 1 } },
  ])

  // Índices para Cajas
  await db
    .collection(Collections.CASH_REGISTERS)
    .createIndexes([{ key: { sucursalId: 1, fecha: -1 } }, { key: { usuarioId: 1 } }, { key: { abierta: 1 } }])

  // Índices para Sucursales
  await db.collection(Collections.BRANCHES).createIndexes([{ key: { nombre: 1 } }, { key: { activa: 1 } }])

  // Índices para Proveedores
  await db.collection(Collections.SUPPLIERS).createIndexes([{ key: { nombre: 1 } }, { key: { activo: 1 } }])

  // Índices para Tipos de Producto
  await db.collection(Collections.PRODUCT_TYPES).createIndexes([{ key: { nombre: 1 } }, { key: { activo: 1 } }])

  // Índices para Listas de Precio
  await db.collection(Collections.PRICE_LISTS).createIndexes([{ key: { nombre: 1 } }, { key: { activa: 1 } }])

  console.log("[v0] Índices de MongoDB creados exitosamente")
}
