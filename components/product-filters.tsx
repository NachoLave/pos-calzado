"use client"

/**
 * Filtros de productos
 * Permite filtrar por categoría y proveedor
 */
import { Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ProductFiltersProps {
  selectedCategory: string
  selectedSupplier: string
  onCategoryChange: (category: string) => void
  onSupplierChange: (supplier: string) => void
}

const categories = [
  { value: "all", label: "Todas las categorías" },
  { value: "shoes", label: "Zapatos" },
  { value: "boots", label: "Botas" },
  { value: "bags", label: "Carteras" },
  { value: "belts", label: "Cinturones" },
]

const suppliers = [
  { value: "all", label: "Todos los proveedores" },
  { value: "premium-leather", label: "Premium Leather" },
  { value: "urban-style", label: "Urban Style" },
  { value: "classic-fashion", label: "Classic Fashion" },
  { value: "modern-accessories", label: "Modern Accessories" },
]

export function ProductFilters({
  selectedCategory,
  selectedSupplier,
  onCategoryChange,
  onSupplierChange,
}: ProductFiltersProps) {
  const hasActiveFilters = selectedCategory !== "all" || selectedSupplier !== "all"

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2 h-11 relative bg-transparent">
          <Filter className="w-4 h-4" />
          Filtros
          {hasActiveFilters && <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2 text-sm">Categoría</h4>
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-sm">Proveedor</h4>
            <Select value={selectedSupplier} onValueChange={onSupplierChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.value} value={supplier.value}>
                    {supplier.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => {
                onCategoryChange("all")
                onSupplierChange("all")
              }}
            >
              Limpiar filtros
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
