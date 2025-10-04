/**
 * API Routes para gestión de tipo de producto individual
 */

import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { Collections } from "@/lib/db/collections"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/auth/session"

// PUT - Actualizar tipo de producto
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { nombre, descripcion, tieneDescuentoEfectivo } = body

    const db = await getDb()

    await db.collection(Collections.PRODUCT_TYPES).updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          nombre,
          descripcion,
          tieneDescuentoEfectivo,
          actualizadoEn: new Date(),
        },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error al actualizar tipo de producto:", error)
    return NextResponse.json({ error: "Error al actualizar tipo de producto" }, { status: 500 })
  }
}

// DELETE - Desactivar tipo de producto
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const db = await getDb()

    await db
      .collection(Collections.PRODUCT_TYPES)
      .updateOne({ _id: new ObjectId(params.id) }, { $set: { activo: false } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error al eliminar tipo de producto:", error)
    return NextResponse.json({ error: "Error al eliminar tipo de producto" }, { status: 500 })
  }
}
