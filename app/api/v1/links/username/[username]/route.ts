import { NextResponse } from 'next/server'
import { clerkClient } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/app/api/lib/db'
import { LinksService } from '@/app/api/lib/services/LinksService'

// GET /api/v1/links/username/[username] - Get public links by username
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
		const linksService = new LinksService()
		const links = await linksService.getByOwnerId(user.id)

		// Filter to only return public links
		const publicLinks = links.filter(link => link.visibility === 'public')

		return NextResponse.json({ data: publicLinks })
	} catch (error) {
		console.error('Error fetching links:', error)
		return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 })
	}
}
