import { Collection } from 'mongodb'
import { getDatabase } from '../db.ts'
import { Profile } from '../types/index.ts'

export class ProfilesService {
	private collection: Collection<Profile>

	constructor() {
		const db = getDatabase()
		this.collection = db.collection<Profile>('profiles')
	}

	async getByUserId(userId: string): Promise<Profile | null> {
		return await this.collection.findOne({ userid: userId })
	}

	async create(profile: Profile): Promise<Profile> {
		await this.collection.insertOne(profile)
		return profile
	}

	async update(userId: string, updates: Partial<Omit<Profile, 'userid'>>): Promise<Profile | null> {
		const result = await this.collection.findOneAndUpdate(
			{ userid: userId },
			{ $set: updates },
			{ returnDocument: 'after' }
		)

		return result || null
	}

	async upsert(userId: string, profileData: Partial<Omit<Profile, 'userid'>>): Promise<Profile> {
		const result = await this.collection.findOneAndUpdate(
			{ userid: userId },
			{ $set: { ...profileData, userid: userId } },
			{ returnDocument: 'after', upsert: true }
		)

		if (!result) {
			throw new Error('Failed to upsert profile')
		}

		return result
	}

	async delete(userId: string): Promise<boolean> {
		const result = await this.collection.deleteOne({ userid: userId })
		return result.deletedCount > 0
	}
}
