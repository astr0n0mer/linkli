import express from "express"
import { requireAuth, getAuth } from "@clerk/express"
import { ProfilesService } from "../services/ProfilesService.ts"

const router = express.Router()

const getProfilesService = () => new ProfilesService()

// Get own profile
router.get("/me", requireAuth(), async (req, res) => {
	try {
		const { userId } = getAuth(req)
		const profilesService = getProfilesService()
		const profile = await profilesService.getByUserId(userId)

		if (!profile) {
			return res.sendStatus(404)
		}

		res.send({ data: profile })
	} catch (error) {
		console.error('Error fetching profile:', error)
		res.status(500).send({ error: 'Failed to fetch profile' })
	}
})

// Update own profile
router.put("/me", requireAuth(), async (req, res) => {
	try {
		const { userId } = getAuth(req)
		const profilesService = getProfilesService()
		const { bio } = req.body

		const updatedProfile = await profilesService.upsert(userId, {
			bio
		})

		res.send({ data: updatedProfile })
	} catch (error) {
		console.error('Error updating profile:', error)
		res.status(500).send({ error: 'Failed to update profile' })
	}
})

// Get any user's profile (public endpoint)
router.get("/:userId", async (req, res) => {
	try {
		const profilesService = getProfilesService()
		const profile = await profilesService.getByUserId(req.params.userId)

		if (!profile) {
			return res.sendStatus(404)
		}

		res.send({ data: profile })
	} catch (error) {
		console.error('Error fetching profile:', error)
		res.status(500).send({ error: 'Failed to fetch profile' })
	}
})

export default router
