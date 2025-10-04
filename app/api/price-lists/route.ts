/**
 * API Routes para gestión de listas de precio
 */

import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { Collections } from "@/lib/db/collections"
import type { PriceList } from "@/lib/db/models"
import { getSession } from "@/lib/auth/session"

// GET - Obtener todas las listas de precio
export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const db = await getDb()
    const listas = await db.collection(Collections.PRICE_LISTS).find({ activa: true }).sort({ nombre: 1 }).toArray()

    return NextResponse.json({ listas })
  } catch (error) {
    console.error("[v0] Error al obtener listas de precio:", error)
    return NextResponse.json({ error: "Error al obtener listas de precio" }, { status: 500 })
  }
}

// POST - Crear nueva lista de precio
export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { nombre, descripcion, descuentoPorcentaje } = body

    const db = await getDb()

    const lista: PriceList = {
      nombre,
      descripcion,
      descuentoPorcentaje: descuentoPorcentaje || 0,
      activa: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    }

    const result = await db.collection(Collections.PRICE_LISTS).insertOne(lista)

    return NextResponse.json({ success: true, id: result.insertedId.toString() })
  } catch (error) {
    console.error("[v0] Error al crear lista de precio:", error)
    return NextResponse.json({ error: "Error al crear lista de precio" }, { status: 500 })
  }
}
