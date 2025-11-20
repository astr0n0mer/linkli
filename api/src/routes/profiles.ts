import express from "express"
import { requireAuth, getAuth, clerkClient } from "@clerk/express"
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

// Get any user's profile by username (public endpoint)
router.get("/username/:username", async (req, res) => {
	try {
		// First, find the Clerk user by username
		const users = await clerkClient.users.getUserList({
			username: [req.params.username]
		})

		if (!users.data || users.data.length === 0) {
			return res.sendStatus(404)
		}

		const user = users.data[0]
		const profilesService = getProfilesService()

		// Get profile from database (for bio)
		const profile = await profilesService.getByUserId(user.id)

		// Combine Clerk user data with database profile
		const publicProfile = {
			userid: user.id,
			username: user.username || '',
			firstName: user.firstName || '',
			lastName: user.lastName || '',
			avatarUrl: user.imageUrl || '',
			bio: profile?.bio || ''
		}

		res.send({ data: publicProfile })
	} catch (error) {
		console.error('Error fetching profile:', error)
		res.status(500).send({ error: 'Failed to fetch profile' })
	}
})

// Get any user's profile by userId (public endpoint - kept for backwards compatibility)
router.get("/:userId", async (req, res) => {
	try {
		const profilesService = getProfilesService()
		const profile = await profilesService.getByUserId(req.params.userId)

		if (!profile) {
			return res.sendStatus(404)
		}

		// Fetch Clerk user data to get firstName, lastName, and imageUrl
		try {
			const user = await clerkClient.users.getUser(req.params.userId)

			// Combine database profile (bio) with Clerk user data
			const publicProfile = {
				...profile,
				firstName: user.firstName || '',
				lastName: user.lastName || '',
				avatarUrl: user.imageUrl || ''
			}

			res.send({ data: publicProfile })
		} catch (clerkError) {
			console.error('Error fetching Clerk user data:', clerkError)
			// If Clerk fetch fails, return profile with empty name fields
			res.send({
				data: {
					...profile,
					firstName: '',
					lastName: '',
					avatarUrl: ''
				}
			})
		}
	} catch (error) {
		console.error('Error fetching profile:', error)
		res.status(500).send({ error: 'Failed to fetch profile' })
	}
})

export default router
