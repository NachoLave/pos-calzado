import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Sidebar } from "@/components/sidebar"
import { Suspense } from "react"
import { AuthProvider } from "@/lib/auth/context"

export const metadata: Metadata = {
  title: "Punto de Venta - Calzado",
  description: "Sistema de punto de venta para calzado y accesorios",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <AuthProvider>
          <div className="flex h-screen overflow-hidden">
            <Suspense fallback={<div>Loading...</div>}>
              <Sidebar />
            </Suspense>
            <main className="flex-1 overflow-hidden">{children}</main>
          </div>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
