/**
 * Sidebar colapsable del sistema
 * Navegación principal con menú desplegable que se oculta automáticamente
 */
"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Home, ShoppingCart, Package, BarChart3, Settings, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/context"

const menuItems = [
  {
    id: "inicio",
    label: "Inicio",
    icon: Home,
    href: "/",
  },
  {
    id: "ventas",
    label: "Ventas",
    icon: ShoppingCart,
    href: "/ventas",
  },
  {
    id: "stock",
    label: "Stock",
    icon: Package,
    href: "/stock",
  },
  {
    id: "reportes",
    label: "Reportes",
    icon: BarChart3,
    href: "/reportes",
  },
  {
    id: "configuracion",
    label: "Configuración",
    icon: Settings,
    href: "/configuracion",
  },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Cierra el sidebar al hacer click en un link
  const handleLinkClick = () => {
    setIsOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
  }

  if (pathname === "/login") {
    return null
  }

  return (
    <>
      {/* Botón para abrir el sidebar */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 border border-border bg-card shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay oscuro cuando el sidebar está abierto */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-full w-64 transform border-r border-border bg-card transition-transform duration-300 ease-in-out fullscreen-sidebar ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header del sidebar */}
        <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
          <h2 className="mb-1 text-xl font-bold">Calzados & Accesorios</h2>
          <p className="text-sm opacity-90">Sistema POS</p>
        </div>

        {user && (
          <div className="border-b border-border bg-muted/50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold">{user.nombre}</p>
                <p className="truncate text-xs text-muted-foreground">{user.rol}</p>
              </div>
            </div>
          </div>
        )}

        {/* Menú de navegación */}
        <nav className="space-y-2 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={handleLinkClick}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                  isActive ? "bg-primary font-semibold text-primary-foreground" : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-border p-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </aside>
    </>
  )
}
