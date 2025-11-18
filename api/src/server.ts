import 'dotenv/config'
import { clerkClient, clerkMiddleware, getAuth, requireAuth } from "@clerk/express"
import express from "express"
import linksRouter from "./routes/links.ts"

const app = express()
const PORT = 3001

app.use(clerkMiddleware())
app.use(express.json())

app.use("/links", linksRouter)

app.get("/health", (req, res) => {
	res.send({ status: "online" })
})


app.get("/protected", requireAuth(), async (req, res) => {
	const { userId } = getAuth(req)
	const user = await clerkClient.users.getUser(userId)
	return res.json({ user })
})


app.listen(PORT, () => {
	console.debug(`listening on http://localhost:${PORT}`)
})
