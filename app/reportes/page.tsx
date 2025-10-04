/**
 * Página de Reportes
 * Análisis y reportes del negocio
 */
"use client"

import { Card } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"

export default function ReportesPage() {
  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="ml-12">
          <h1 className="text-3xl font-bold mb-2">Reportes</h1>
          <p className="text-muted-foreground">Análisis y estadísticas del negocio</p>
        </div>

        <Card className="p-12 flex flex-col items-center justify-center text-center">
          <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Próximamente</h2>
          <p className="text-muted-foreground">Esta sección estará disponible pronto con reportes detallados</p>
        </Card>
      </div>
    </div>
  )
}
