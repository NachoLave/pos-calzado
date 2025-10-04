/**
 * API Routes para gestión de proveedor individual
 */

import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { Collections } from "@/lib/db/collections"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/auth/session"

// PUT - Actualizar proveedor
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { nombre, contacto, telefono, email, direccion } = body

    const db = await getDb()

    await db.collection(Collections.SUPPLIERS).updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          nombre,
          contacto,
          telefono,
          email,
          direccion,
          actualizadoEn: new Date(),
        },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error al actualizar proveedor:", error)
    return NextResponse.json({ error: "Error al actualizar proveedor" }, { status: 500 })
  }
}

// DELETE - Desactivar proveedor
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const db = await getDb()

    await db.collection(Collections.SUPPLIERS).updateOne({ _id: new ObjectId(params.id) }, { $set: { activo: false } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error al eliminar proveedor:", error)
    return NextResponse.json({ error: "Error al eliminar proveedor" }, { status: 500 })
  }
}
