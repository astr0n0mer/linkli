import express from "express"
import { ProfilesService } from "../services/ProfilesService.ts"

const router = express.Router()

// Webhook endpoint for Clerk events
// TODO: Add signature verification with svix for production (requires public webhook URL)
router.post("/clerk", express.json(), async (req, res) => {
	try {
		const { type, data } = req.body

		console.log(`Webhook received: ${type}`)

		if (type === 'user.created') {
			const profilesService = new ProfilesService()

			// Create profile with empty bio (username and avatar come from Clerk)
			const profile = {
				userid: data.id,
				bio: ''
			}

			await profilesService.create(profile)
			console.log('Profile created for user:', data.id)
		}

		res.status(200).json({ message: 'Webhook processed successfully' })
	} catch (error) {
		console.error('Webhook error:', error)
		res.status(500).json({ error: 'Webhook processing failed' })
	}
})

export default router
