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
  // Configuraciones SSL/TLS optimizadas para Vercel
  authMechanism: 'SCRAM-SHA-1',
  retryWrites: true,
  w: 'majority',
  
  // Configuraciones de connection
  maxPoolSize: 1, // Reducido para serverless
  serverSelectionTimeoutMS: 3000, // Timeout más corto
  connectTimeoutMS: 10000,
  socketTimeoutMS: 0, // Sin timeout de socket para serverless
  
  // Configuraciones modernas
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
  // Configuraciones SSL específicas para Vercel
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  tlsInsecure: false,
  
  // Configuraciones de red optimizadas para Vercel
  maxIdleTimeMS: 10000,
  heartbeatFrequencyMS: 10000,
  directConnection: false
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Optimización para serverless (Vercel)
let isConnected = false

async function connectToDatabase() {
  if (isConnected && client) {
    return client
  }

  try {
    client = new MongoClient(uri, options)
    await client.connect()
    isConnected = true
    console.log('Connected to MongoDB Atlas via Vercel')
    return client
  } catch (error) {
    console.error('MongoDB connection error:', error)
    isConnected = false
    throw error
  }
}

clientPromise = connectToDatabase()

/**
 * Obtiene la instancia de la base de datos
 */
export async function getDb(): Promise<Db> {
  const mongoClient = await clientPromise
  return mongoClient.db("pos_calzado")
}

export default clientPromise
