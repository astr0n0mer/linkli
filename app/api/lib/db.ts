import { MongoClient, Db } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const DB_NAME = process.env.DB_NAME || 'linkli'

let client: MongoClient | null = null
let db: Db | null = null

export const connectToDatabase = async (): Promise<Db> => {
	// Check if we have an active connection
	if (client && db) {
		try {
			// Verify connection is still alive
			await client.db('admin').command({ ping: 1 })
			return db
		} catch {
			// Connection lost, reset and reconnect
			client = null
			db = null
		}
	}

	try {
		client = new MongoClient(MONGODB_URI)
		await client.connect()
		db = client.db(DB_NAME)
		console.log('Connected to MongoDB')
		return db
	} catch (error) {
		console.error('Failed to connect to MongoDB:', error)
		throw error
	}
}

export const getDatabase = (): Db => {
	if (!db) {
		throw new Error('Database not initialized. Call connectToDatabase first.')
	}
	return db
}
