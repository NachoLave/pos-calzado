/**
 * Middleware de Next.js para proteger rutas
 * Verifica la sesión antes de permitir acceso a rutas protegidas
 */

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { decrypt } from "@/lib/auth/session"

// Rutas públicas que no requieren autenticación
const publicRoutes = ["/login", "/api/auth/login", "/api/init-db", "/admin/init-db"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir acceso a rutas públicas
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Verificar sesión
  const sessionCookie = request.cookies.get("session")?.value

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const session = await decrypt(sessionCookie)

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Usuario autenticado, permitir acceso
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
