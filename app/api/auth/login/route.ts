/**
 * API Route para iniciar sesión
 */

import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { Collections } from "@/lib/db/collections"
import type { User } from "@/lib/db/models"
import { verifyPassword } from "@/lib/auth/password"
import { createSession } from "@/lib/auth/session"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validar datos
    if (!email || !password) {
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    // Buscar usuario
    const db = await getDb()
    const user = (await db.collection(Collections.USERS).findOne({ email, activo: true })) as User | null

    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Verificar contraseña
    const isValidPassword = await verifyPassword(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Crear sesión
    const session = await createSession(user)

    return NextResponse.json({
      success: true,
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
    console.error("[v0] Error en login:", error)
    return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 })
  }
}
