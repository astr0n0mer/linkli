export enum LinkStatus {
	ACTIVE = "active",
	INACTIVE = "inactive",
}

export interface LinkType {
	id: string // unique identifier in the system
	title: string
	url: string
	slug: string // suffix to the app's hosted URL; basically the short URL
	ownerId: string // who created it
	createdAt: number
	updatedAt: number
	status: LinkStatus
	category: string
	order: number
}

export interface Profile {
	userid: string
	username: string
	avatarUrl: string
	bio: string
}
