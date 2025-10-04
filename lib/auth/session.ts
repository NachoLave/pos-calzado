/**
 * Gestión de sesiones de usuario
 * Utiliza cookies seguras para mantener la sesión
 */

import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import type { User } from "@/lib/db/models"

const secretKey = process.env.JWT_SECRET || "tu-secreto-super-seguro-cambiar-en-produccion"
const key = new TextEncoder().encode(secretKey)

export interface SessionData {
  userId: string
  email: string
  nombre: string
  rol: "dueño" | "empleado"
  sucursalId: string
  permisos: {
    verDatosInicio: boolean
    verReportes: boolean
    verVentasTodasSucursales: boolean
    administrarCostos: boolean
    verVentasOtrasSucursales: boolean
    verVentasTiendaNube: boolean
    administrarStockOtrasSucursales: boolean
  }
}

/**
 * Encripta y crea un token JWT con los datos de sesión
 */
export async function encrypt(payload: SessionData) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key)
}

/**
 * Desencripta y verifica un token JWT
 */
export async function decrypt(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    })
    return payload as SessionData
  } catch (error) {
    console.error("[v0] Error al verificar token:", error)
    return null
  }
}

/**
 * Crea una nueva sesión para el usuario
 */
export async function createSession(user: User) {
  const sessionData: SessionData = {
    userId: user._id!.toString(),
    email: user.email,
    nombre: user.nombre,
    rol: user.rol,
    sucursalId: user.sucursalId.toString(),
    permisos: user.permisos,
  }

  const token = await encrypt(sessionData)
  const cookieStore = await cookies()

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 horas
    path: "/",
  })

  return sessionData
}

/**
 * Obtiene la sesión actual del usuario
 */
export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) return null

  return await decrypt(token)
}

/**
 * Elimina la sesión actual
 */
export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

/**
 * Verifica si el usuario tiene un permiso específico
 */
export function hasPermission(session: SessionData | null, permission: keyof SessionData["permisos"]): boolean {
  if (!session) return false
  return session.permisos[permission] === true
}
