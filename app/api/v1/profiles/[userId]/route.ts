import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/app/api/lib/db'
import { ProfilesService } from '@/app/api/lib/services/ProfilesService'

// GET /api/v1/profiles/[userId] - Get public profile by userId (backwards compatibility)
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ userId: string }> }
) {
	try {
		const { userId } = await params

		await connectToDatabase()
		const profilesService = new ProfilesService()
		const profile = await profilesService.getByUserId(userId)

		if (!profile) {
			return new NextResponse(null, { status: 404 })
		}

		// Fetch Clerk user data to get firstName, lastName, and imageUrl
		try {
			const client = await clerkClient()
			const user = await client.users.getUser(userId)

			// Combine database profile (bio) with Clerk user data
			const publicProfile = {
				...profile,
				firstName: user.firstName || '',
				lastName: user.lastName || '',
				avatarUrl: user.imageUrl || ''
			}

			return NextResponse.json({ data: publicProfile })
		} catch (clerkError) {
			console.error('Error fetching Clerk user data:', clerkError)
			// If Clerk fetch fails, return profile with empty name fields
			return NextResponse.json({
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
		return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
	}
}
