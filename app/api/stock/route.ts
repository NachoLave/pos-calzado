/**
 * API Routes para gestión de stock
 */

import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { Collections } from "@/lib/db/collections"
import { getSession } from "@/lib/auth/session"
import { ObjectId } from "mongodb"

// GET - Obtener stock con filtros
export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const sucursalId = searchParams.get("sucursalId") || session.sucursalId

    // Verificar permisos
    if (sucursalId !== session.sucursalId && !session.permisos.administrarStockOtrasSucursales) {
      return NextResponse.json({ error: "Sin permisos para ver stock de otras sucursales" }, { status: 403 })
    }

    const db = await getDb()

    // Obtener stock con información de productos
    const stock = await db
      .collection(Collections.STOCK)
      .aggregate([
        {
          $match: {
            sucursalId: new ObjectId(sucursalId),
          },
        },
        {
          $lookup: {
            from: Collections.PRODUCT_VARIANTS,
            localField: "varianteProductoId",
            foreignField: "_id",
            as: "variante",
          },
        },
        { $unwind: "$variante" },
        {
          $lookup: {
            from: Collections.PRODUCTS,
            localField: "variante.productoBaseId",
            foreignField: "_id",
            as: "producto",
          },
        },
        { $unwind: "$producto" },
        {
          $sort: { "producto.nombre": 1 },
        },
      ])
      .toArray()

    return NextResponse.json({ stock })
  } catch (error) {
    console.error("[v0] Error al obtener stock:", error)
    return NextResponse.json({ error: "Error al obtener stock" }, { status: 500 })
  }
}

// PUT - Actualizar cantidad de stock
export async function PUT(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { varianteProductoId, sucursalId, cantidad } = body

    // Verificar permisos
    if (sucursalId !== session.sucursalId && !session.permisos.administrarStockOtrasSucursales) {
      return NextResponse.json({ error: "Sin permisos para modificar stock de otras sucursales" }, { status: 403 })
    }

    const db = await getDb()

    // Actualizar o crear stock
    await db.collection(Collections.STOCK).updateOne(
      {
        varianteProductoId: new ObjectId(varianteProductoId),
        sucursalId: new ObjectId(sucursalId),
      },
      {
        $set: {
          cantidad,
          actualizadoEn: new Date(),
        },
      },
      { upsert: true },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error al actualizar stock:", error)
    return NextResponse.json({ error: "Error al actualizar stock" }, { status: 500 })
  }
}
