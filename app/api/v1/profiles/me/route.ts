import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/app/api/lib/db'
import { ProfilesService } from '@/app/api/lib/services/ProfilesService'

// GET /api/v1/profiles/me - Get own profile (authenticated)
export async function GET() {
	try {
		const { userId } = await auth()
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		await connectToDatabase()
		const profilesService = new ProfilesService()
		const profile = await profilesService.getByUserId(userId)

		if (!profile) {
			return new NextResponse(null, { status: 404 })
		}

		return NextResponse.json({ data: profile })
	} catch (error) {
		console.error('Error fetching profile:', error)
		return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
	}
}

// PUT /api/v1/profiles/me - Update own profile (authenticated)
export async function PUT(request: Request) {
	try {
		const { userId } = await auth()
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const body = await request.json()
		const { bio } = body

		await connectToDatabase()
		const profilesService = new ProfilesService()

		const updatedProfile = await profilesService.upsert(userId, { bio })

		return NextResponse.json({ data: updatedProfile })
	} catch (error) {
		console.error('Error updating profile:', error)
		return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
	}
}
