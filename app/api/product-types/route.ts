/**
 * API Routes para gestión de tipos de producto
 */

import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { Collections } from "@/lib/db/collections"
import type { ProductType } from "@/lib/db/models"
import { getSession } from "@/lib/auth/session"

// GET - Obtener todos los tipos de producto
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const db = await getDb()
    const tipos = await db.collection(Collections.PRODUCT_TYPES).find({ activo: true }).sort({ nombre: 1 }).toArray()

    return NextResponse.json({ tipos })
  } catch (error) {
    console.error("[v0] Error al obtener tipos de producto:", error)
    return NextResponse.json({ error: "Error al obtener tipos de producto" }, { status: 500 })
  }
}

// POST - Crear nuevo tipo de producto
export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { nombre, descripcion, tieneDescuentoEfectivo } = body

    const db = await getDb()

    const tipo: ProductType = {
      nombre,
      descripcion,
      tieneDescuentoEfectivo: tieneDescuentoEfectivo || false,
      activo: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    }

    const result = await db.collection(Collections.PRODUCT_TYPES).insertOne(tipo)

    return NextResponse.json({ success: true, id: result.insertedId.toString() })
  } catch (error) {
    console.error("[v0] Error al crear tipo de producto:", error)
    return NextResponse.json({ error: "Error al crear tipo de producto" }, { status: 500 })
  }
}
