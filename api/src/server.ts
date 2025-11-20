import 'dotenv/config'
import { clerkClient, clerkMiddleware, getAuth, requireAuth } from "@clerk/express"
import express from "express"
import cors from "cors"
import { connectToDatabase } from "./db.ts"
import linksRouter from "./routes/links.ts"
import profilesRouter from "./routes/profiles.ts"
import webhooksRouter from "./routes/webhooks.ts"

const app = express()
const PORT = 3001

// CORS configuration - allow all origins for debugging
app.use(cors())

// Webhooks need raw body - must be before express.json()
app.use("/webhooks", webhooksRouter)

app.use(clerkMiddleware())
app.use(express.json())

// API v1 routes
app.use("/api/v1/links", linksRouter)
app.use("/api/v1/profiles", profilesRouter)

app.get("/health", (req, res) => {
	res.send({ status: "online" })
})

app.get("/protected", requireAuth(), async (req, res) => {
	const { userId } = getAuth(req)
	const user = await clerkClient.users.getUser(userId)
	return res.json({ user })
})

const startServer = async () => {
	try {
		await connectToDatabase()
		app.listen(PORT, () => {
			console.debug(`listening on http://localhost:${PORT}`)
		})
	} catch (error) {
		console.error('Failed to start server:', error)
		process.exit(1)
	}
}

startServer()
