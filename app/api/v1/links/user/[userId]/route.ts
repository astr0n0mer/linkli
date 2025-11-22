import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/app/api/lib/db'
import { LinksService } from '@/app/api/lib/services/LinksService'

// GET /api/v1/links/user/[userId] - Get public links by userId (backwards compatibility)
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ userId: string }> }
) {
	try {
		const { userId } = await params

		await connectToDatabase()
		const linksService = new LinksService()
		const links = await linksService.getByOwnerId(userId)

		// Filter to only return public links
		const publicLinks = links.filter(link => link.visibility === 'public')

		return NextResponse.json({ data: publicLinks })
	} catch (error) {
		console.error('Error fetching links:', error)
		return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 })
	}
}
