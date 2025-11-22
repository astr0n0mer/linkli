import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/app/api/lib/db'
import { ProfilesService } from '@/app/api/lib/services/ProfilesService'

// POST /api/webhooks/clerk - Handle Clerk webhook events
export async function POST(request: Request) {
	try {
		// TODO: Add signature verification with svix for production
		const body = await request.json()
		const { type, data } = body

		console.log(`Webhook received: ${type}`)

		if (type === 'user.created') {
			await connectToDatabase()
			const profilesService = new ProfilesService()

			// Create profile with empty bio (username and avatar come from Clerk)
			const profile = {
				userid: data.id,
				bio: ''
			}

			await profilesService.create(profile)
			console.log('Profile created for user:', data.id)
		}

		return NextResponse.json({ message: 'Webhook processed successfully' })
	} catch (error) {
		console.error('Webhook error:', error)
		return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
	}
}
