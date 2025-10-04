/**
 * API Route para cerrar sesión
 */

import { NextResponse } from "next/server"
import { deleteSession } from "@/lib/auth/session"

export async function POST() {
  try {
    await deleteSession()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error en logout:", error)
    return NextResponse.json({ error: "Error al cerrar sesión" }, { status: 500 })
  }
}
