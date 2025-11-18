import { type Link, LinkStatus } from "./models/index.ts";

let links: Link[] = [
	{
		id: 'asdf',
		title: "asdf",
		url: "https://google.com",
		createdAt: 0,
		updatedAt: 1,
		ownerId: "123",
		status: LinkStatus.ACTIVE,
		category: "test",
		order: 1
	}
]

export const getLinks = async () => links

export const deleteLink = async (id: String) => { links = links.filter(l => l.id !== id) }

export const addLink = async (link: Link) => { links = [...links, link] }

export const updateLink = async (link: Link) => {
	links = [...(links.filter(l => l.id !== link.id)), link]
}



