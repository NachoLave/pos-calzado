/**
 * API Routes para gestión de lista de precio individual
 */

import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { Collections } from "@/lib/db/collections"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/auth/session"

// PUT - Actualizar lista de precio
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { nombre, descripcion, descuentoPorcentaje } = body

    const db = await getDb()

    await db.collection(Collections.PRICE_LISTS).updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          nombre,
          descripcion,
          descuentoPorcentaje,
          actualizadoEn: new Date(),
        },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error al actualizar lista de precio:", error)
    return NextResponse.json({ error: "Error al actualizar lista de precio" }, { status: 500 })
  }
}

// DELETE - Desactivar lista de precio
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const db = await getDb()

    await db
      .collection(Collections.PRICE_LISTS)
      .updateOne({ _id: new ObjectId(params.id) }, { $set: { activa: false } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error al eliminar lista de precio:", error)
    return NextResponse.json({ error: "Error al eliminar lista de precio" }, { status: 500 })
  }
}
