export type LinkVisibility = 'public' | 'private'

export interface LinkType {
	id: string
	title: string
	url: string
	slug: string
	ownerId: string
	createdAt: number
	updatedAt: number
	visibility: LinkVisibility
	category: string
	order: number
}

export interface Profile {
	userid: string
	bio: string
}
