/**
 * API Routes para gestión de proveedores
 */

import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { Collections } from "@/lib/db/collections"
import type { Supplier } from "@/lib/db/models"
import { getSession } from "@/lib/auth/session"

// GET - Obtener todos los proveedores
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const db = await getDb()
    const proveedores = await db.collection(Collections.SUPPLIERS).find({ activo: true }).sort({ nombre: 1 }).toArray()

    return NextResponse.json({ proveedores })
  } catch (error) {
    console.error("[v0] Error al obtener proveedores:", error)
    return NextResponse.json({ error: "Error al obtener proveedores" }, { status: 500 })
  }
}

// POST - Crear nuevo proveedor
export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { nombre, contacto, telefono, email, direccion } = body

    const db = await getDb()

    const proveedor: Supplier = {
      nombre,
      contacto,
      telefono,
      email,
      direccion,
      activo: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    }

    const result = await db.collection(Collections.SUPPLIERS).insertOne(proveedor)

    return NextResponse.json({ success: true, id: result.insertedId.toString() })
  } catch (error) {
    console.error("[v0] Error al crear proveedor:", error)
    return NextResponse.json({ error: "Error al crear proveedor" }, { status: 500 })
  }
}
