/**
 * API Routes para gestión de productos
 */

import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { Collections } from "@/lib/db/collections"
import type { Product } from "@/lib/db/models"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/auth/session"

// GET - Obtener todos los productos con sus variantes
export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const tipoId = searchParams.get("tipo")
    const proveedorId = searchParams.get("proveedor")

    const db = await getDb()

    // Construir filtro
    const filter: any = { activo: true }
    if (search) {
      filter.nombre = { $regex: search, $options: "i" }
    }
    if (tipoId) {
      filter.tipoProductoId = new ObjectId(tipoId)
    }
    if (proveedorId) {
      filter.proveedorId = new ObjectId(proveedorId)
    }

    // Obtener productos
    const productos = await db.collection(Collections.PRODUCTS).find(filter).sort({ nombre: 1 }).toArray()

    // Obtener variantes para cada producto
    const productosConVariantes = await Promise.all(
      productos.map(async (producto) => {
        const variantes = await db
          .collection(Collections.PRODUCT_VARIANTS)
          .find({ productoBaseId: producto._id, activo: true })
          .toArray()

        return {
          ...producto,
          variantes,
        }
      }),
    )

    return NextResponse.json({ productos: productosConVariantes })
  } catch (error) {
    console.error("[v0] Error al obtener productos:", error)
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 })
  }
}

// POST - Crear nuevo producto con variantes
export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { nombre, descripcion, proveedorId, tipoProductoId, definicionVariantes, imagenUrl, variantes } = body

    const db = await getDb()

    // Crear producto base
    const producto: Product = {
      nombre,
      descripcion,
      proveedorId: new ObjectId(proveedorId),
      tipoProductoId: new ObjectId(tipoProductoId),
      definicionVariantes,
      imagenUrl,
      activo: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    }

    const resultProducto = await db.collection(Collections.PRODUCTS).insertOne(producto)
    const productoId = resultProducto.insertedId

    // Crear variantes
    const variantesACrear = variantes.map((v: any) => ({
      productoBaseId: productoId,
      nombreCompleto: v.nombreCompleto,
      codigoSKU: v.codigoSKU,
      variantes: v.variantes,
      precios: v.precios.map((p: any) => ({
        listaPrecioId: new ObjectId(p.listaPrecioId),
        precio: p.precio,
      })),
      costo: v.costo,
      imagenUrl: v.imagenUrl || imagenUrl,
      activo: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    }))

    await db.collection(Collections.PRODUCT_VARIANTS).insertMany(variantesACrear)

    return NextResponse.json({ success: true, productoId: productoId.toString() })
  } catch (error) {
    console.error("[v0] Error al crear producto:", error)
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 })
  }
}
