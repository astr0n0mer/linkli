import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/app/api/lib/db'
import { LinksService } from '@/app/api/lib/services/LinksService'

// GET /api/v1/links - Get own links (authenticated)
export async function GET() {
	try {
		const { userId } = await auth()
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		await connectToDatabase()
		const linksService = new LinksService()
		const links = await linksService.getByOwnerId(userId)

		return NextResponse.json({ data: links })
	} catch (error) {
		console.error('Error fetching links:', error)
		return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 })
	}
}

// POST /api/v1/links - Create a new link (authenticated)
export async function POST(request: Request) {
	try {
		const { userId } = await auth()
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const body = await request.json()
		const { title, url, slug, visibility, category, order } = body

		if (!title || !url || !slug) {
			return NextResponse.json(
				{ error: 'Missing required fields: title, url, slug' },
				{ status: 400 }
			)
		}

		await connectToDatabase()
		const linksService = new LinksService()

		const newLink = await linksService.create({
			title,
			url,
			slug,
			ownerId: userId,
			visibility: visibility || 'public',
			category: category || '',
			order: order || 0
		})

		return NextResponse.json({ data: newLink }, { status: 201 })
	} catch (error) {
		console.error('Error creating link:', error)
		return NextResponse.json({ error: 'Failed to create link' }, { status: 500 })
	}
}
