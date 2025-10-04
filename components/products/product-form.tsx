/**
 * Formulario para crear/editar productos con variantes dinámicas
 */

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, Loader2 } from "lucide-react"
import { useAuth } from "@/lib/auth/context"

interface ProductFormProps {
  productId?: string
  onSuccess: () => void
}

export function ProductForm({ productId, onSuccess }: ProductFormProps) {
  const { user, hasPermission } = useAuth()
  const [loading, setLoading] = useState(false)
  const [suppliers, setSuppliers] = useState<any[]>([])
  const [productTypes, setProductTypes] = useState<any[]>([])
  const [priceLists, setPriceLists] = useState<any[]>([])

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    proveedorId: "",
    tipoProductoId: "",
    imagenUrl: "",
    definicionVariantes: [{ nombre: "Talle", valores: [""] }],
  })

  const [variantes, setVariantes] = useState<any[]>([])

  useEffect(() => {
    loadConfigData()
  }, [])

  const loadConfigData = async () => {
    try {
      const [suppliersRes, typesRes, priceListsRes] = await Promise.all([
        fetch("/api/suppliers"),
        fetch("/api/product-types"),
        fetch("/api/price-lists"),
      ])

      if (suppliersRes.ok) {
        const data = await suppliersRes.json()
        setSuppliers(data.proveedores || [])
      }
      if (typesRes.ok) {
        const data = await typesRes.json()
        setProductTypes(data.tipos || [])
      }
      if (priceListsRes.ok) {
        const data = await priceListsRes.json()
        setPriceLists(data.listas || [])
      }
    } catch (error) {
      console.error("[v0] Error al cargar configuración:", error)
    }
  }

  const addVariantDefinition = () => {
    setFormData({
      ...formData,
      definicionVariantes: [...formData.definicionVariantes, { nombre: "", valores: [""] }],
    })
  }

  const removeVariantDefinition = (index: number) => {
    const newDefs = formData.definicionVariantes.filter((_, i) => i !== index)
    setFormData({ ...formData, definicionVariantes: newDefs })
  }

  const updateVariantDefinition = (index: number, field: string, value: any) => {
    const newDefs = [...formData.definicionVariantes]
    newDefs[index] = { ...newDefs[index], [field]: value }
    setFormData({ ...formData, definicionVariantes: newDefs })
  }

  const addVariantValue = (defIndex: number) => {
    const newDefs = [...formData.definicionVariantes]
    newDefs[defIndex].valores.push("")
    setFormData({ ...formData, definicionVariantes: newDefs })
  }

  const removeVariantValue = (defIndex: number, valueIndex: number) => {
    const newDefs = [...formData.definicionVariantes]
    newDefs[defIndex].valores = newDefs[defIndex].valores.filter((_: any, i: number) => i !== valueIndex)
    setFormData({ ...formData, definicionVariantes: newDefs })
  }

  const updateVariantValue = (defIndex: number, valueIndex: number, value: string) => {
    const newDefs = [...formData.definicionVariantes]
    newDefs[defIndex].valores[valueIndex] = value
    setFormData({ ...formData, definicionVariantes: newDefs })
  }

  const generateVariants = () => {
    // Generar todas las combinaciones posibles de variantes
    const combinations: any[] = []

    const generate = (current: any, depth: number) => {
      if (depth === formData.definicionVariantes.length) {
        combinations.push({ ...current })
        return
      }

      const def = formData.definicionVariantes[depth]
      for (const valor of def.valores.filter((v) => v.trim())) {
        generate({ ...current, [def.nombre]: valor }, depth + 1)
      }
    }

    generate({}, 0)

    // Crear variantes con precios
    const newVariantes = combinations.map((combo) => {
      const variantName = Object.entries(combo)
        .map(([key, value]) => `${value}`)
        .join(" - ")
      const sku = Object.values(combo)
        .map((v: any) => v.substring(0, 3).toUpperCase())
        .join("-")

      return {
        nombreCompleto: `${formData.nombre} - ${variantName}`,
        codigoSKU: sku,
        variantes: combo,
        precios: priceLists.map((lista) => ({
          listaPrecioId: lista._id,
          precio: 0,
        })),
        costo: 0,
        imagenUrl: formData.imagenUrl,
      }
    })

    setVariantes(newVariantes)
  }

  const updateVariantPrice = (variantIndex: number, priceListId: string, precio: number) => {
    const newVariantes = [...variantes]
    const priceIndex = newVariantes[variantIndex].precios.findIndex((p: any) => p.listaPrecioId === priceListId)
    if (priceIndex !== -1) {
      newVariantes[variantIndex].precios[priceIndex].precio = precio
    }
    setVariantes(newVariantes)
  }

  const updateVariantCost = (variantIndex: number, costo: number) => {
    const newVariantes = [...variantes]
    newVariantes[variantIndex].costo = costo
    setVariantes(newVariantes)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          variantes,
        }),
      })

      if (response.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error("[v0] Error al crear producto:", error)
    } finally {
      setLoading(false)
    }
  }

  const canSeeCost = hasPermission("administrarCostos")

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="nombre">Nombre del Producto</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="proveedor">Proveedor</Label>
            <Select
              value={formData.proveedorId}
              onValueChange={(value) => setFormData({ ...formData, proveedorId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar proveedor" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier._id} value={supplier._id}>
                    {supplier.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tipo">Tipo de Producto</Label>
            <Select
              value={formData.tipoProductoId}
              onValueChange={(value) => setFormData({ ...formData, tipoProductoId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                {productTypes.map((type) => (
                  <SelectItem key={type._id} value={type._id}>
                    {type.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="imagenUrl">URL de Imagen</Label>
          <Input
            id="imagenUrl"
            value={formData.imagenUrl}
            onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
            placeholder="/placeholder.svg?height=400&width=400"
          />
        </div>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Definir Variantes</h3>
          <Button type="button" variant="outline" size="sm" onClick={addVariantDefinition}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Variante
          </Button>
        </div>

        {formData.definicionVariantes.map((def, defIndex) => (
          <div key={defIndex} className="space-y-2 rounded border p-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Nombre (ej: Talle, Color)"
                value={def.nombre}
                onChange={(e) => updateVariantDefinition(defIndex, "nombre", e.target.value)}
                className="flex-1"
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeVariantDefinition(defIndex)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {def.valores.map((valor: string, valueIndex: number) => (
                <div key={valueIndex} className="flex items-center gap-2">
                  <Input
                    placeholder="Valor (ej: 39, Negro)"
                    value={valor}
                    onChange={(e) => updateVariantValue(defIndex, valueIndex, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVariantValue(defIndex, valueIndex)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addVariantValue(defIndex)}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Valor
              </Button>
            </div>
          </div>
        ))}

        <Button type="button" onClick={generateVariants} className="w-full" variant="secondary">
          Generar Variantes
        </Button>
      </div>

      {variantes.length > 0 && (
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="font-semibold">Variantes Generadas ({variantes.length})</h3>
          <div className="max-h-96 space-y-3 overflow-y-auto">
            {variantes.map((variante, index) => (
              <div key={index} className="space-y-2 rounded border p-3">
                <p className="font-medium text-sm">{variante.nombreCompleto}</p>
                <p className="text-xs text-muted-foreground">SKU: {variante.codigoSKU}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {priceLists.map((lista) => (
                    <div key={lista._id}>
                      <Label className="text-xs">{lista.nombre}</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={variante.precios.find((p: any) => p.listaPrecioId === lista._id)?.precio || ""}
                        onChange={(e) => updateVariantPrice(index, lista._id, Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  ))}
                  {canSeeCost && (
                    <div>
                      <Label className="text-xs">Costo</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={variante.costo || ""}
                        onChange={(e) => updateVariantCost(index, Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading || variantes.length === 0}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creando...
            </>
          ) : (
            "Crear Producto"
          )}
        </Button>
      </div>
    </form>
  )
}
