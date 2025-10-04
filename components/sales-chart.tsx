/**
 * Gráfico de barras para ventas mensuales
 * Muestra las ventas de todas las sucursales por mes
 */
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface SalesChartProps {
  data: Array<{
    month: string
    sucursal1: number
    sucursal2: number
    sucursal3: number
  }>
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis dataKey="month" className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "8px",
          }}
        />
        <Legend />
        <Bar dataKey="sucursal1" name="Centro" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
        <Bar dataKey="sucursal2" name="Norte" fill="hsl(210, 100%, 60%)" radius={[8, 8, 0, 0]} />
        <Bar dataKey="sucursal3" name="Sur" fill="hsl(180, 100%, 50%)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
