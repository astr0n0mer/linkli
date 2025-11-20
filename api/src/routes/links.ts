import express from "express"
import { requireAuth, getAuth } from "@clerk/express"
import { LinksService } from "../services/LinksService.ts"
import { ProfilesService } from "../services/ProfilesService.ts"

const router = express.Router()

const getLinksService = () => new LinksService()
const getProfilesService = () => new ProfilesService()

// Get own links (authenticated)
router.get("/", requireAuth(), async (req, res) => {
	try {
		const { userId } = getAuth(req)
		const linksService = getLinksService()
		const links = await linksService.getByOwnerId(userId)
		res.send({ data: links })
	} catch (error) {
		console.error('Error fetching links:', error)
		res.status(500).send({ error: 'Failed to fetch links' })
	}
})

// Get public links by username (public endpoint - only returns public links)
router.get("/username/:username", async (req, res) => {
	try {
		const { clerkClient } = await import("@clerk/express")

		// First, find the Clerk user by username
		const users = await clerkClient.users.getUserList({
			username: [req.params.username]
		})

		if (!users.data || users.data.length === 0) {
			return res.sendStatus(404)
		}

		const user = users.data[0]
		const linksService = getLinksService()
		const links = await linksService.getByOwnerId(user.id)

		// Filter to only return public links for public endpoint
		const publicLinks = links.filter(link => link.visibility === 'public')

		res.send({ data: publicLinks })
	} catch (error) {
		console.error('Error fetching links:', error)
		res.status(500).send({ error: 'Failed to fetch links' })
	}
})

// Get public links by userId (public endpoint - only returns public links - kept for backwards compatibility)
router.get("/user/:userId", async (req, res) => {
	try {
		const linksService = getLinksService()
		const links = await linksService.getByOwnerId(req.params.userId)

		// Filter to only return public links for public endpoint
		const publicLinks = links.filter(link => link.visibility === 'public')

		res.send({ data: publicLinks })
	} catch (error) {
		console.error('Error fetching links:', error)
		res.status(500).send({ error: 'Failed to fetch links' })
	}
})

router.get("/:id", requireAuth(), async (req, res) => {
	try {
		const { userId } = getAuth(req)
		const linksService = getLinksService()
		const link = await linksService.getById(req.params.id)

		if (!link) {
			return res.sendStatus(404)
		}

		// Ensure user can only access their own links
		if (link.ownerId !== userId) {
			return res.sendStatus(403)
		}

		res.send({ data: link })
	} catch (error) {
		console.error('Error fetching link:', error)
		res.status(500).send({ error: 'Failed to fetch link' })
	}
})

router.post("/", requireAuth(), async (req, res) => {
	try {
		const { userId } = getAuth(req)
		const linksService = getLinksService()
		const { title, url, slug, visibility, category, order } = req.body

		if (!title || !url || !slug) {
			return res.status(400).send({ error: 'Missing required fields: title, url, slug' })
		}

		const newLink = await linksService.create({
			title,
			url,
			slug,
			ownerId: userId, // Use authenticated userId
			visibility: visibility || 'public',
			category: category || '',
			order: order || 0
		})

		res.status(201).send({ data: newLink })
	} catch (error) {
		console.error('Error creating link:', error)
		res.status(500).send({ error: 'Failed to create link' })
	}
})

router.put("/:id", requireAuth(), async (req, res) => {
	try {
		const { userId } = getAuth(req)
		const linksService = getLinksService()

		// First, check if the link exists and belongs to the user
		const existingLink = await linksService.getById(req.params.id)
		if (!existingLink) {
			return res.sendStatus(404)
		}

		if (existingLink.ownerId !== userId) {
			return res.sendStatus(403)
		}

		const { title, url, slug, visibility, category, order } = req.body

		const updatedLink = await linksService.update(req.params.id, {
			title,
			url,
			slug,
			visibility,
			category,
			order
		})

		res.send({ data: updatedLink })
	} catch (error) {
		console.error('Error updating link:', error)
		res.status(500).send({ error: 'Failed to update link' })
	}
})

router.delete("/:id", requireAuth(), async (req, res) => {
	try {
		const { userId } = getAuth(req)
		const linksService = getLinksService()

		// First, check if the link exists and belongs to the user
		const existingLink = await linksService.getById(req.params.id)
		if (!existingLink) {
			return res.sendStatus(404)
		}

		if (existingLink.ownerId !== userId) {
			return res.sendStatus(403)
		}

		await linksService.delete(req.params.id)
		res.sendStatus(204)
	} catch (error) {
		console.error('Error deleting link:', error)
		res.status(500).send({ error: 'Failed to delete link' })
	}
})

export default router
