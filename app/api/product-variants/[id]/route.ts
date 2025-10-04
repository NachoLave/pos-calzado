/**
 * API Routes para gestión de variantes individuales
 */

import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { Collections } from "@/lib/db/collections"
import { ObjectId } from "mongodb"
import { getSession } from "@/lib/auth/session"

// PUT - Actualizar variante
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { nombreCompleto, codigoSKU, variantes, precios, costo, imagenUrl } = body

    const db = await getDb()

    await db.collection(Collections.PRODUCT_VARIANTS).updateOne(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          nombreCompleto,
          codigoSKU,
          variantes,
          precios: precios.map((p: any) => ({
            listaPrecioId: new ObjectId(p.listaPrecioId),
            precio: p.precio,
          })),
          costo,
          imagenUrl,
          actualizadoEn: new Date(),
        },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error al actualizar variante:", error)
    return NextResponse.json({ error: "Error al actualizar variante" }, { status: 500 })
  }
}
