/**
 * Layout especial para la página de login
 * No muestra el sidebar ni requiere autenticación
 */

import type React from "react"

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
