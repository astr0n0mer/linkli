import { Collection, ObjectId } from 'mongodb'
import { getDatabase } from '../db'
import type { LinkType } from '../types'

export class LinksService {
	private collection: Collection<LinkType>

	constructor() {
		const db = getDatabase()
		this.collection = db.collection<LinkType>('links')
	}

	async getAll(): Promise<LinkType[]> {
		return await this.collection.find({}).sort({ order: 1 }).toArray()
	}

	async getById(id: string): Promise<LinkType | null> {
		return await this.collection.findOne({ id })
	}

	async getByOwnerId(ownerId: string): Promise<LinkType[]> {
		return await this.collection.find({ ownerId }).sort({ order: 1 }).toArray()
	}

	async create(link: Omit<LinkType, 'id' | 'createdAt' | 'updatedAt'>): Promise<LinkType> {
		const newLink: LinkType = {
			...link,
			id: new ObjectId().toString(),
			createdAt: Date.now(),
			updatedAt: Date.now(),
		}

		await this.collection.insertOne(newLink)
		return newLink
	}

	async update(id: string, updates: Partial<Omit<LinkType, 'id' | 'createdAt' | 'ownerId'>>): Promise<LinkType | null> {
		const result = await this.collection.findOneAndUpdate(
			{ id },
			{
				$set: {
					...updates,
					updatedAt: Date.now()
				}
			},
			{ returnDocument: 'after' }
		)

		return result || null
	}

	async delete(id: string): Promise<boolean> {
		const result = await this.collection.deleteOne({ id })
		return result.deletedCount > 0
	}

	async deleteByOwnerId(ownerId: string): Promise<number> {
		const result = await this.collection.deleteMany({ ownerId })
		return result.deletedCount
	}
}
