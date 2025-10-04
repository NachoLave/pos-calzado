/**
 * Tab de gestión de listas de precio
 */

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, DollarSign } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function PriceListsTab() {
  const [lists, setLists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    descuentoPorcentaje: 0,
  })

  useEffect(() => {
    loadLists()
  }, [])

  const loadLists = async () => {
    try {
      const response = await fetch("/api/price-lists")
      if (response.ok) {
        const data = await response.json()
        setLists(data.listas)
      }
    } catch (error) {
      console.error("[v0] Error al cargar listas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/price-lists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setDialogOpen(false)
        setFormData({ nombre: "", descripcion: "", descuentoPorcentaje: 0 })
        loadLists()
      }
    } catch (error) {
      console.error("[v0] Error al crear lista:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta lista de precio?")) return

    try {
      const response = await fetch(`/api/price-lists/${id}`, { method: "DELETE" })
      if (response.ok) {
        loadLists()
      }
    } catch (error) {
      console.error("[v0] Error al eliminar lista:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Listas de Precio
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva Lista
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Nueva Lista de Precio</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Ej: Precio Efectivo, Precio Tarjeta"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="descuento">Descuento/Recargo (%)</Label>
                  <Input
                    id="descuento"
                    type="number"
                    step="0.01"
                    value={formData.descuentoPorcentaje}
                    onChange={(e) =>
                      setFormData({ ...formData, descuentoPorcentaje: Number.parseFloat(e.target.value) })
                    }
                    placeholder="20 para descuento, -10 para recargo"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Valores positivos = descuento, valores negativos = recargo
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Crear</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Cargando listas...</div>
        ) : lists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <DollarSign className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No hay listas de precio</h3>
            <p className="text-muted-foreground">Comienza agregando tu primera lista</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Descuento/Recargo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lists.map((list) => (
                <TableRow key={list._id}>
                  <TableCell className="font-medium">{list.nombre}</TableCell>
                  <TableCell>{list.descripcion || "-"}</TableCell>
                  <TableCell>
                    {list.descuentoPorcentaje > 0
                      ? `${list.descuentoPorcentaje}% descuento`
                      : list.descuentoPorcentaje < 0
                        ? `${Math.abs(list.descuentoPorcentaje)}% recargo`
                        : "Sin modificación"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(list._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
