import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import "../styles/fullscreen.css"
import { Sidebar } from "@/components/sidebar"
import { Suspense } from "react"
import { AuthProvider } from "@/lib/auth/context"
import MobileViewport from "@/components/MobileViewport"

export const metadata: Metadata = {
  title: "POS Calzado",
  description: "Sistema de punto de venta para calzado y accesorios",
  generator: "v0.app",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover",
  themeColor: "#1e40af",
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-tap-highlight" content="no" />
        <script src="/fullscreen-script.js" defer></script>
      </head>
      <body className="font-sans antialiased">
        <MobileViewport />
        <AuthProvider>
          <div className="flex h-screen overflow-hidden tablet-fullscreen">
            <Suspense fallback={<div>Loading...</div>}>
              <Sidebar />
            </Suspense>
            <main className="flex-1 overflow-hidden fullscreen-main">{children}</main>
          </div>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
