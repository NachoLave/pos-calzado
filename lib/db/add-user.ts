/**
 * Función para agregar usuario específico
 */

import { getDb } from "@/lib/mongodb"
import { Collections } from "./collections"
import bcrypt from "bcryptjs"

export async function addUser(email: string, password: string, nombre: string, rol: "dueño" | "empleado" = "dueño") {
  const db = await getDb()

  // Verificar si el usuario ya existe
  const existingUser = await db.collection(Collections.USERS).findOne({ email })
  if (existingUser) {
    console.log(`[v0] Usuario ${email} ya existe`)
    return { success: false, message: "Usuario ya existe" }
  }

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 10)

  // Obtener primera sucursal para asignar
  const firstBranch = await db.collection(Collections.BRANCHES).findOne({ activa: true })
  const sucursalId = firstBranch?._id

  // Crear usuario
  const result = await db.collection(Collections.USERS).insertOne({
    nombre,
    email,
    password: hashedPassword,
    rol,
    sucursalId,
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

  console.log(`[v0] Usuario ${email} creado exitosamente`)
  return { success: true, message: `Usuario ${email} creado exitosamente` }
}
