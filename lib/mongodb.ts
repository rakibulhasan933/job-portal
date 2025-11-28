import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  )
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var myMongoose: MongooseCache | undefined
}

const cached: MongooseCache = global.myMongoose || { conn: null, promise: null }

if (!global.myMongoose) {
  global.myMongoose = cached
}

/**
 * Get the current MongoDB connection state
 */
export function getConnectionState(): string {
  const states: Record<number, string> = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  }
  return states[mongoose.connection.readyState] || "unknown"
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    }

    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
      console.log("✅ MongoDB connected successfully")
      console.log(`   Database: ${mongoose.connection.db?.databaseName}`)
      console.log(`   State: ${getConnectionState()}`)
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error("❌ MongoDB connection error:", e)
    throw e
  }

  return cached.conn
}

/**
 * Check if the database is currently connected
 */
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1
}

/**
 * Get detailed connection status information
 */
export async function getConnectionStatus() {
  try {
    const state = getConnectionState()
    const connected = isConnected()

    if (connected && cached.conn) {
      const db = cached.conn.connection.db
      return {
        connected: true,
        state,
        database: db?.databaseName || "unknown",
        host: mongoose.connection.host || "unknown",
        port: mongoose.connection.port || "unknown",
        readyState: mongoose.connection.readyState,
      }
    }

    return {
      connected: false,
      state,
      readyState: mongoose.connection.readyState,
      error: connected ? null : "Not connected to database",
    }
  } catch (error) {
    return {
      connected: false,
      state: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
