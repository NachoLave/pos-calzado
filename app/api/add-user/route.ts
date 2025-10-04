/**
 * API Route para agregar un usuario específico
 */

import { NextResponse } from "next/server"
import { addUser } from "@/lib/db/add-user"

export async function POST(request: Request) {
  try {
    const { email, password, nombre, rol } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email y contraseña son requeridos" },
        { status: 400 }
      )
    }

    const result = await addUser(
      email, 
      password, 
      nombre || "Usuario", 
      rol || "dueño"
    )

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(
        result,
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("[Error] Error al agregar usuario:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al crear usuario",
      },
      { status: 500 }
    )
  }
}
