/**
 * API Route para obtener información del usuario actual
 */

import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: session.userId,
        email: session.email,
        nombre: session.nombre,
        rol: session.rol,
        sucursalId: session.sucursalId,
        permisos: session.permisos,
      },
    })
  } catch (error) {
    console.error("[v0] Error al obtener usuario:", error)
    return NextResponse.json({ error: "Error al obtener usuario" }, { status: 500 })
  }
}
