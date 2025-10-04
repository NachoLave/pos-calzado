/**
 * API Route de prueba para agregar usuario rápidamente
 */

import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { Collections } from "@/lib/db/collections"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const db = await getDb()

    // Verificar si el usuario ya existe
    const existingUser = await db.collection(Collections.USERS).findOne({ email: "admin@example.com" })
    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: "Usuario admin@example.com ya existe",
      })
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash("admin123", 10)

    // Obtener primera sucursal
    const firstBranch = await db.collection(Collections.BRANCHES).findOne({ activa: true })
    const sucursalId = firstBranch?._id

    // Crear usuario
    await db.collection(Collections.USERS).insertOne({
      nombre: "Propietario",
      email: "admin@example.com",
      password: hashedPassword,
      rol: "dueño",
      sucursalId,
      permisos: {
        verDatosInicio: true,
        verReportes: true,
        verVentasTodasSucursales: true,
        administrarCostos: true,
        verVentasOtrasSucursales: true,
        verVentasTiendaNube: true,
        administrarStockOtrasSucursales: true,
      },
      activo: true,
      creadoEn: new Date(),
      actualizadoEn: new Date(),
    })

    return NextResponse.json({
      success: true,
      message: "Usuario admin@example.com creado exitosamente",
    })
  } catch (error) {
    console.error("[Error] Error al crear usuario:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al crear usuario",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    )
  }
}
