import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/app/api/lib/db'
import { ProfilesService } from '@/app/api/lib/services/ProfilesService'

// GET /api/v1/profiles/username/[username] - Get public profile by username
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ username: string }> }
) {
	try {
		const { username } = await params
		const client = await clerkClient()

		// Find the Clerk user by username
		const users = await client.users.getUserList({
			username: [username]
		})

		if (!users.data || users.data.length === 0) {
			return new NextResponse(null, { status: 404 })
		}

		const user = users.data[0]
		if (!user) {
			return new NextResponse(null, { status: 404 })
		}

		await connectToDatabase()
		const profilesService = new ProfilesService()

		// Get profile from database (for bio)
		const profile = await profilesService.getByUserId(user.id)

		// Combine Clerk user data with database profile
		const publicProfile = {
			userid: user.id,
			username: user.username ?? '',
			firstName: user.firstName ?? '',
			lastName: user.lastName ?? '',
			avatarUrl: user.imageUrl ?? '',
			bio: profile?.bio ?? ''
		}

		return NextResponse.json({ data: publicProfile })
	} catch (error) {
		console.error('Error fetching profile:', error)
		return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
	}
}
