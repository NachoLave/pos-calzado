/**
 * Página de Configuración
 * Gestión de proveedores, tipos de producto y listas de precio
 */
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SuppliersTab } from "@/components/config/suppliers-tab"
import { ProductTypesTab } from "@/components/config/product-types-tab"
import { PriceListsTab } from "@/components/config/price-lists-tab"

export default function ConfiguracionPage() {
  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <div className="ml-12">
          <h1 className="mb-2 text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground">Gestión de proveedores, tipos de producto y listas de precio</p>
        </div>

        <Tabs defaultValue="suppliers" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="suppliers">Proveedores</TabsTrigger>
            <TabsTrigger value="types">Tipos de Producto</TabsTrigger>
            <TabsTrigger value="prices">Listas de Precio</TabsTrigger>
          </TabsList>
          <TabsContent value="suppliers">
            <SuppliersTab />
          </TabsContent>
          <TabsContent value="types">
            <ProductTypesTab />
          </TabsContent>
          <TabsContent value="prices">
            <PriceListsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
