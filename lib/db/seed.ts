/**
 * Script para poblar la base de datos con datos iniciales
 * Útil para desarrollo y testing
 */

import { getDb } from "@/lib/mongodb"
import { Collections } from "./collections"
import bcrypt from "bcryptjs"

export async function seedDatabase() {
  const db = await getDb()

  // Verificar si ya hay datos
  const userCount = await db.collection(Collections.USERS).countDocuments()
  if (userCount > 0) {
    console.log("[v0] La base de datos ya tiene datos, saltando seed")
    return
  }
  
  // Limpiar usuarios existentes si es necesario (para desarrollo)
  await db.collection(Collections.USERS).deleteMany({})
  console.log("[v0] Usuarios existentes eliminados")

  console.log("[v0] Iniciando seed de la base de datos...")

  // 1. Crear Sucursales
  const sucursales = await db.collection(Collections.BRANCHES).insertMany([
    {
      nombre: "Sucursal Centro",
      direccion: "Av. Principal 123",
      telefono: "123-456-7890",
      activa: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: "Sucursal Norte",
      direccion: "Calle Norte 456",
      telefono: "123-456-7891",
      activa: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
  ])

  const sucursalCentroId = sucursales.insertedIds[0]
  const sucursalNorteId = sucursales.insertedIds[1]

  // 2. Crear Usuarios Dueños
  const hashedPasswordAdmin = await bcrypt.hash("admin.123", 10)
  await db.collection(Collections.USERS).insertOne({
    nombre: "Administrador",
    email: "admin",
    password: hashedPasswordAdmin,
    rol: "dueño",
    sucursalId: sucursalCentroId,
    permisos: {
      verDatosInicio: true,
      verReportes: true,
      verVentasTodasSucursales: true,
      administrarCostos: true,
      verVentasOtrasSucursales: true,
      verVentasTiendaNube: true,
      administrarStockOtrasSucursales: true,
    },
    activo: true,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
  })

  // Crear segundo usuario dueño
  const hashedPasswordDueño = await bcrypt.hash("admin123", 10)
  await db.collection(Collections.USERS).insertOne({
    nombre: "Propietario",
    email: "admin@example.com",
    password: hashedPasswordDueño,
    rol: "dueño",
    sucursalId: sucursalCentroId,
    permisos: {
      verDatosInicio: true,
      verReportes: true,
      verVentasTodasSucursales: true,
      administrarCostos: true,
      verVentasOtrasSucursales: true,
      verVentasTiendaNube: true,
      administrarStockOtrasSucursales: true,
    },
    activo: true,
    creadoEn: new Date(),
    actualizadoEn: new Date(),
  })

  // 3. Crear Listas de Precio
  const listas = await db.collection(Collections.PRICE_LISTS).insertMany([
    {
      nombre: "Precio Efectivo",
      descripcion: "20% descuento en calzado",
      descuentoPorcentaje: 20,
      activa: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: "Precio Tarjeta",
      descripcion: "Precio regular",
      descuentoPorcentaje: 0,
      activa: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
  ])

  const listaPrecioEfectivoId = listas.insertedIds[0]
  const listaPrecioTarjetaId = listas.insertedIds[1]

  // 4. Crear Proveedores
  const proveedores = await db.collection(Collections.SUPPLIERS).insertMany([
    {
      nombre: "Classic Fashion",
      contacto: "Juan Pérez",
      telefono: "123-456-7892",
      email: "contacto@classicfashion.com",
      activo: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: "Urban Style",
      contacto: "María García",
      telefono: "123-456-7893",
      email: "ventas@urbanstyle.com",
      activo: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
  ])

  const proveedorClassicId = proveedores.insertedIds[0]
  const proveedorUrbanId = proveedores.insertedIds[1]

  // 5. Crear Tipos de Producto
  const tipos = await db.collection(Collections.PRODUCT_TYPES).insertMany([
    {
      nombre: "Zapatos",
      descripcion: "Calzado formal y casual",
      tieneDescuentoEfectivo: true,
      activo: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: "Botas",
      descripcion: "Botas de todo tipo",
      tieneDescuentoEfectivo: true,
      activo: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: "Carteras",
      descripcion: "Bolsos y carteras",
      tieneDescuentoEfectivo: false,
      activo: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: "Cinturones",
      descripcion: "Cinturones de cuero y tela",
      tieneDescuentoEfectivo: false,
      activo: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
  ])

  const tipoZapatosId = tipos.insertedIds[0]
  const tipoBotasId = tipos.insertedIds[1]
  const tipoCarterasId = tipos.insertedIds[2]

  // 6. Crear Productos Base
  const productos = await db.collection(Collections.PRODUCTS).insertMany([
    {
      nombre: "Mocasines de Gamuza",
      descripcion: "Elegantes mocasines de gamuza",
      proveedorId: proveedorClassicId,
      tipoProductoId: tipoZapatosId,
      definicionVariantes: [
        {
          nombre: "Talle",
          valores: ["39", "40", "41", "42", "43"],
        },
      ],
      imagenUrl: "/elegant-brown-leather-dress-shoes.jpg",
      activo: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: "Zapatillas Deportivas",
      descripcion: "Zapatillas urbanas modernas",
      proveedorId: proveedorUrbanId,
      tipoProductoId: tipoZapatosId,
      definicionVariantes: [
        {
          nombre: "Talle",
          valores: ["38", "39", "40", "41", "42"],
        },
      ],
      imagenUrl: "/modern-white-sneakers-athletic-shoes.jpg",
      activo: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
    {
      nombre: "Botas Militares",
      descripcion: "Botas estilo militar",
      proveedorId: proveedorUrbanId,
      tipoProductoId: tipoBotasId,
      definicionVariantes: [
        {
          nombre: "Talle",
          valores: ["39", "40", "41", "42", "43", "44"],
        },
      ],
      imagenUrl: "/rugged-black-leather-combat-boots.jpg",
      activo: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    },
  ])

  const productoMocasinesId = productos.insertedIds[0]
  const productoZapatillasId = productos.insertedIds[1]
  const productoBotasId = productos.insertedIds[2]

  // 7. Crear Variantes de Productos
  const variantes = []

  // Mocasines - Talles 39-43
  for (const talle of ["39", "40", "41", "42", "43"]) {
    variantes.push({
      productoBaseId: productoMocasinesId,
      nombreCompleto: `Mocasines de Gamuza - Talle ${talle}`,
      codigoSKU: `MOC-GAM-${talle}`,
      variantes: { talle },
      precios: [
        { listaPrecioId: listaPrecioEfectivoId, precio: 63.99 }, // 20% descuento de 79.99
        { listaPrecioId: listaPrecioTarjetaId, precio: 79.99 },
      ],
      costo: 40.0,
      imagenUrl: "/elegant-brown-leather-dress-shoes.jpg",
      activo: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    })
  }

  // Zapatillas - Talles 38-42
  for (const talle of ["38", "39", "40", "41", "42"]) {
    variantes.push({
      productoBaseId: productoZapatillasId,
      nombreCompleto: `Zapatillas Deportivas - Talle ${talle}`,
      codigoSKU: `ZAP-DEP-${talle}`,
      variantes: { talle },
      precios: [
        { listaPrecioId: listaPrecioEfectivoId, precio: 103.99 }, // 20% descuento de 129.99
        { listaPrecioId: listaPrecioTarjetaId, precio: 129.99 },
      ],
      costo: 70.0,
      imagenUrl: "/modern-white-sneakers-athletic-shoes.jpg",
      activo: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    })
  }

  // Botas - Talles 39-44
  for (const talle of ["39", "40", "41", "42", "43", "44"]) {
    variantes.push({
      productoBaseId: productoBotasId,
      nombreCompleto: `Botas Militares - Talle ${talle}`,
      codigoSKU: `BOT-MIL-${talle}`,
      variantes: { talle },
      precios: [
        { listaPrecioId: listaPrecioEfectivoId, precio: 143.99 }, // 20% descuento de 179.99
        { listaPrecioId: listaPrecioTarjetaId, precio: 179.99 },
      ],
      costo: 95.0,
      imagenUrl: "/rugged-black-leather-combat-boots.jpg",
      activo: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    })
  }

  const variantesInsertadas = await db.collection(Collections.PRODUCT_VARIANTS).insertMany(variantes)

  // 8. Crear Stock para cada variante en ambas sucursales
  const stockItems = []
  for (const varianteId of Object.values(variantesInsertadas.insertedIds)) {
    // Stock en Sucursal Centro
    stockItems.push({
      varianteProductoId: varianteId,
      sucursalId: sucursalCentroId,
      cantidad: Math.floor(Math.random() * 10) + 5, // Entre 5 y 15 unidades
      cantidadMinima: 3,
      actualizadoEn: new Date(),
    })

    // Stock en Sucursal Norte
    stockItems.push({
      varianteProductoId: varianteId,
      sucursalId: sucursalNorteId,
      cantidad: Math.floor(Math.random() * 10) + 5,
      cantidadMinima: 3,
      actualizadoEn: new Date(),
    })
  }

  await db.collection(Collections.STOCK).insertMany(stockItems)

  console.log("[v0] Seed completado exitosamente")
  console.log("[v0] Usuarios de prueba:")
  console.log("[v0] - admin / admin.123")
  console.log("[v0] - admin@example.com / admin123")
}
