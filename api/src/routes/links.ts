import express from "express"
import { addLink, deleteLink, getLinks, updateLink } from "../database.ts"

const router = express.Router()

router.get("/", async (req, res) => {
	const links = await getLinks()
	res.send({ data: links })
})

router.delete("/:id", async (req, res) => {
	await deleteLink(req.params.id)
	res.sendStatus(201)
})

router.post("/", async (req, res) => {
	const link = req.body
	await addLink({ ...link, createdAt: 1e3, updatedAt: 1e3 })
	res.sendStatus(201)
})

router.put("/:id", async (req, res) => {
	const links = await getLinks()
	const link = links.find(l => l.id === req.params.id)
	if (!link) {
		res.sendStatus(401)
	}

	await updateLink({ ...link, ...req.body })
	res.sendStatus(201)
})

export default router
