/**
 * Página de administración para inicializar la base de datos
 * Solo debe usarse en desarrollo o primera configuración
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function InitDbPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInitialize = async (withSeed: boolean) => {
    setLoading(true)
    setSuccess(false)
    setError(null)

    try {
      const response = await fetch("/api/init-db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ seed: withSeed }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
      } else {
        setError(data.error || "Error desconocido")
      }
    } catch (err) {
      setError("Error al conectar con el servidor")
      console.error("[v0] Error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-8">
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-sky-600" />
              <div>
                <CardTitle>Inicializar Base de Datos</CardTitle>
                <CardDescription>Configura la base de datos MongoDB con índices y datos de prueba</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Base de datos inicializada correctamente. Puedes comenzar a usar el sistema.
                  <br />
                  <strong>Usuario dueño creado:</strong> admin / admin.123
                  <br />
                  <span className="text-sm">
                    Como dueño, puedes crear sucursales y usuarios empleados desde la configuración.
                  </span>
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
                <h3 className="mb-2 font-semibold text-sky-900">Crear solo índices</h3>
                <p className="mb-4 text-sm text-sky-700">
                  Crea los índices necesarios en la base de datos sin agregar datos de prueba. Útil si ya tienes datos o
                  quieres empezar desde cero.
                </p>
                <Button onClick={() => handleInitialize(false)} disabled={loading} variant="outline" className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Inicializando...
                    </>
                  ) : (
                    "Crear Índices"
                  )}
                </Button>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h3 className="mb-2 font-semibold text-blue-900">Crear índices y datos de prueba</h3>
                <p className="mb-4 text-sm text-blue-700">
                  Crea los índices y agrega datos de prueba incluyendo sucursales, productos, stock y un usuario
                  <strong> dueño</strong> con todos los permisos. El dueño puede crear sucursales y usuarios empleados.
                </p>
                <Button
                  onClick={() => handleInitialize(true)}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Inicializando...
                    </>
                  ) : (
                    "Crear Índices y Datos de Prueba"
                  )}
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h4 className="mb-2 font-semibold text-amber-900">Importante</h4>
              <ul className="space-y-1 text-sm text-amber-800">
                <li>• Asegúrate de tener la variable MONGODB_URI configurada</li>
                <li>• Esta operación es segura y no eliminará datos existentes</li>
                <li>• Los datos de prueba solo se crearán si la base de datos está vacía</li>
                <li>
                  • El primer usuario creado es el <strong>dueño</strong> con permisos completos
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
