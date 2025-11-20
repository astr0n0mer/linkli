export enum LinkVisibility {
	PUBLIC = "public",
	PRIVATE = "private",
}

export interface LinkType {
	id: string // unique identifier in the system
	title: string
	url: string
	slug: string // suffix to the app's hosted URL; basically the short URL
	ownerId: string // who created it
	createdAt: number
	updatedAt: number
	visibility: LinkVisibility
	category: string
	order: number
}

export interface Profile {
	userid: string // Clerk user ID - links to Clerk user
	bio: string // Custom bio field (not stored in Clerk)
}
