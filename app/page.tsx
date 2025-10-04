/**
 * Página de Inicio - Dashboard
 * Muestra estadísticas generales de ventas y rendimiento con datos reales
 */
"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { DollarSign, TrendingUp, Store, Package } from "lucide-react"
import { SalesChart } from "@/components/sales-chart"
import { useAuth } from "@/lib/auth/context"

interface DashboardStats {
  todaySales: number
  monthSales: number
  branchSales: number
  topSupplier: {
    name: string
    productsSold: number
  }
  monthlySales: any[]
}

export default function DashboardPage() {
  const { user, hasPermission } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && hasPermission("verDatosInicio")) {
      loadStats()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("[v0] Error al cargar estadísticas:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  if (!hasPermission("verDatosInicio")) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <Card className="p-12 text-center">
          <h2 className="mb-2 text-xl font-semibold">Acceso Restringido</h2>
          <p className="text-muted-foreground">No tienes permisos para ver el dashboard</p>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <div className="text-muted-foreground">Cargando estadísticas...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="flex h-full items-center justify-center bg-background">
        <Card className="p-12 text-center">
          <h2 className="mb-2 text-xl font-semibold">Error</h2>
          <p className="text-muted-foreground">No se pudieron cargar las estadísticas</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Header */}
        <div className="ml-12">
          <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Resumen de ventas y estadísticas</p>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total vendido hoy */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="mb-1 text-sm text-muted-foreground">Vendido Hoy</p>
            <p className="text-3xl font-bold">
              ${stats.todaySales.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </p>
          </Card>

          {/* Total vendido este mes */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <p className="mb-1 text-sm text-muted-foreground">Vendido Este Mes</p>
            <p className="text-3xl font-bold">
              ${stats.monthSales.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </p>
          </Card>

          {/* Total por sucursal */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
                <Store className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="mb-1 text-sm text-muted-foreground">Tu Sucursal</p>
            <p className="text-3xl font-bold">
              ${stats.branchSales.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Este mes</p>
          </Card>

          {/* Proveedor más vendido */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                <Package className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <p className="mb-1 text-sm text-muted-foreground">Top Proveedor</p>
            <p className="text-2xl font-bold">{stats.topSupplier.name}</p>
            <p className="mt-2 text-xs text-muted-foreground">{stats.topSupplier.productsSold} productos vendidos</p>
          </Card>
        </div>

        {/* Gráfico de ventas mensuales */}
        {stats.monthlySales.length > 0 && (
          <Card className="p-6">
            <h2 className="mb-6 text-xl font-bold">Ventas Mensuales por Sucursal</h2>
            <SalesChart data={stats.monthlySales} />
          </Card>
        )}
      </div>
    </div>
  )
}
