/**
 * API Routes para gestión de producto individual
 */

import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { Collections } from "@/lib/db/collections"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/auth/session"

// GET - Obtener producto por ID con sus variantes
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const db = await getDb()
    const producto = await db.collection(Collections.PRODUCTS).findOne({ _id: new ObjectId(params.id) })

    if (!producto) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    const variantes = await db
      .collection(Collections.PRODUCT_VARIANTS)
      .find({ productoBaseId: new ObjectId(params.id) })
      .toArray()

    return NextResponse.json({ producto: { ...producto, variantes } })
  } catch (error) {
    console.error("[v0] Error al obtener producto:", error)
    return NextResponse.json({ error: "Error al obtener producto" }, { status: 500 })
  }
}

// PUT - Actualizar producto
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { nombre, descripcion, proveedorId, tipoProductoId, definicionVariantes, imagenUrl } = body

    const db = await getDb()

    await db.collection(Collections.PRODUCTS).updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          nombre,
          descripcion,
          proveedorId: new ObjectId(proveedorId),
          tipoProductoId: new ObjectId(tipoProductoId),
          definicionVariantes,
          imagenUrl,
          actualizadoEn: new Date(),
        },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error al actualizar producto:", error)
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 })
  }
}

// DELETE - Desactivar producto (soft delete)
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const db = await getDb()

    // Desactivar producto
    await db.collection(Collections.PRODUCTS).updateOne({ _id: new ObjectId(params.id) }, { $set: { activo: false } })

    // Desactivar todas sus variantes
    await db
      .collection(Collections.PRODUCT_VARIANTS)
      .updateMany({ productoBaseId: new ObjectId(params.id) }, { $set: { activo: false } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error al eliminar producto:", error)
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 })
  }
}
