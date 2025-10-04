/**
 * API Route para inicializar la base de datos
 * Crea índices y opcionalmente ejecuta el seed
 */

import { NextResponse } from "next/server"
import { createIndexes } from "@/lib/db/indexes"
import { seedDatabase } from "@/lib/db/seed"

export async function POST(request: Request) {
  try {
    const { seed } = await request.json()

    // Crear índices
    await createIndexes()

    // Si se solicita, ejecutar seed
    if (seed) {
      await seedDatabase()
    }

    return NextResponse.json({
      success: true,
      message: "Base de datos inicializada correctamente",
    })
  } catch (error) {
    console.error("[v0] Error al inicializar la base de datos:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al inicializar la base de datos",
      },
      { status: 500 },
    )
  }
}
