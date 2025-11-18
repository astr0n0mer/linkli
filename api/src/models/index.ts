export enum LinkStatus {
	ACTIVE = "active",
	INACTIVE = "inactive",
}

export interface Link {
	id: string
	title: string
	url: string
	ownerId: string
	createdAt: number
	updatedAt: number
	status: LinkStatus
	category: string
	order: number
}

export interface Profile {
	userid: string
	avatarUrl: string
	bio: string
}
