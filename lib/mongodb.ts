/**
 * Configuración de conexión a MongoDB
 * Implementa el patrón singleton para reutilizar la conexión
 */

import { MongoClient, type Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Por favor define la variable MONGODB_URI en las variables de entorno")
}

const uri = process.env.MONGODB_URI
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// En desarrollo, usar una variable global para preservar la conexión entre hot reloads
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === "development") {
  // En desarrollo, usar variable global para no crear múltiples conexiones
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // En producción, crear nueva conexión
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

/**
 * Obtiene la instancia de la base de datos
 */
export async function getDb(): Promise<Db> {
  const client = await clientPromise
  return client.db("pos_calzado")
}

export default clientPromise
