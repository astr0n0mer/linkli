import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { connectToDatabase } from '@/app/api/lib/db'
import { LinksService } from '@/app/api/lib/services/LinksService'

// GET /api/v1/links/[id] - Get a specific link (authenticated)
export async function GET(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { userId } = await auth()
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { id } = await params

		await connectToDatabase()
		const linksService = new LinksService()
		const link = await linksService.getById(id)

		if (!link) {
			return new NextResponse(null, { status: 404 })
		}

		if (link.ownerId !== userId) {
			return new NextResponse(null, { status: 403 })
		}

		return NextResponse.json({ data: link })
	} catch (error) {
		console.error('Error fetching link:', error)
		return NextResponse.json({ error: 'Failed to fetch link' }, { status: 500 })
	}
}

// PUT /api/v1/links/[id] - Update a link (authenticated)
export async function PUT(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { userId } = await auth()
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { id } = await params

		await connectToDatabase()
		const linksService = new LinksService()

		const existingLink = await linksService.getById(id)
		if (!existingLink) {
			return new NextResponse(null, { status: 404 })
		}

		if (existingLink.ownerId !== userId) {
			return new NextResponse(null, { status: 403 })
		}

		const body = await request.json()
		const { title, url, slug, visibility, category, order } = body

		const updatedLink = await linksService.update(id, {
			title,
			url,
			slug,
			visibility,
			category,
			order
		})

		return NextResponse.json({ data: updatedLink })
	} catch (error) {
		console.error('Error updating link:', error)
		return NextResponse.json({ error: 'Failed to update link' }, { status: 500 })
	}
}

// DELETE /api/v1/links/[id] - Delete a link (authenticated)
export async function DELETE(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { userId } = await auth()
		if (!userId) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const { id } = await params

		await connectToDatabase()
		const linksService = new LinksService()

		const existingLink = await linksService.getById(id)
		if (!existingLink) {
			return new NextResponse(null, { status: 404 })
		}

		if (existingLink.ownerId !== userId) {
			return new NextResponse(null, { status: 403 })
		}

		await linksService.delete(id)
		return new NextResponse(null, { status: 204 })
	} catch (error) {
		console.error('Error deleting link:', error)
		return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 })
	}
}
