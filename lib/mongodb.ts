/**
 * Configuración de conexión a MongoDB optimizada para Vercel
 * Implementa el patrón singleton para reutilizar la conexión
 */

import { MongoClient, type Db } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error("Por favor define la variable MONGODB_URI en las variables de entorno")
}

const uri = process.env.MONGODB_URI

// Configuración optimizada específicamente para Vercel Serverless Functions
const options = {
  // Configuraciones básicas para Vercel
  retryWrites: true,
  w: 'majority',
  
  // Configuraciones de timeout optimizadas para serverless
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  
  // Pool de conexiones reducido para serverless
  maxPoolSize: 1,
  
  // Configuraciones SSL simplificadas
  tls: true
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Simplificación para Vercel
async function createConnection(): Promise<MongoClient> {
  const mongoClient = new MongoClient(uri, options)
  await mongoClient.connect()
  console.log('[MongoDB] Connected successfully')
  return mongoClient
}

// En desarrollo, usar una variable global para preservar la conexión entre hot reloads
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === "development") {
  // En desarrollo, usar variable global para no crear múltiples conexiones
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, { ...options, maxPoolSize: 10 }) // Más conexiones en desarrollo
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // En producción (Vercel), crear nueva conexión simplificada
  clientPromise = createConnection()
}

/**
 * Obtiene la instancia de la base de datos
 */
export async function getDb(): Promise<Db> {
  const client = await clientPromise
  return client.db("pos_calzado")
}

export default clientPromise
