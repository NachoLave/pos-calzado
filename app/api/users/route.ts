/**
 * API Route para gestionar usuarios
 * Permite crear nuevos usuarios
 */

import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { Collections } from "@/lib/db/collections"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password, nombre = "Usuario", rol = "empleado" } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email y contraseña son requeridos" },
        { status: 400 }
      )
    }

    const db = await getDb()

    // Verificar si el usuario ya existe
    const existingUser = await db.collection(Collections.USERS).findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "El usuario ya existe" },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario
    await db.collection(Collections.USERS).insertOne({
      nombre,
      email,
      password: hashedPassword,
      rol,
      sucursalId: null, // Sin sucursal asignada por defecto
      permisos: {
        verDatosInicio: rol === "dueño",
        verReportes: rol === "dueño",
        verVentasTodasSucursales: rol === "dueño",
        administrarCostos: rol === "dueño",
        verVentasOtrasSucursales: rol === "dueño",
        verVentasTiendaNube: rol === "dueño",
        administrarStockOtrasSucursales: rol === "dueño",
      },
      activo: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: `Usuario ${email} creado exitosamente`,
    })
  } catch (error) {
    console.error("[Error] Error al crear usuario:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al crear usuario",
      },
      { status: 500 }
    )
  }
}
