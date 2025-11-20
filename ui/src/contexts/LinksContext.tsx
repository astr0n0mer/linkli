import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from 'react'
import { useAuth } from '@clerk/clerk-react'
import type { LinkType } from '@/lib/types'
import { linksReducer, type LinksAction } from '@/reducers/linksReducer'
import { api } from '@/lib/api'

interface LinksContextType {
	links: LinkType[]
	loading: boolean
	error: string | null
	isOwnProfile: boolean
	dispatch: React.Dispatch<LinksAction>
	addLink: (data: { title: string; url: string; slug: string; category: string }) => Promise<void>
	editLink: (id: string, data: { title: string; url: string; slug: string; category: string }) => Promise<void>
	deleteLink: (id: string) => Promise<void>
	moveLink: (id: string, direction: 'up' | 'down') => Promise<void>
	toggleLinkStatus: (id: string) => Promise<void>
	refetch: () => Promise<void>
}

const LinksContext = createContext<LinksContextType | undefined>(undefined)

export const LinksProvider = ({ children, targetUsername, isOwnProfile }: { children: ReactNode; targetUsername?: string; isOwnProfile?: boolean }) => {
	const { getToken, isSignedIn } = useAuth()
	const [links, dispatch] = useReducer(linksReducer, [])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const refetch = async () => {
		// If no target username and not signed in, nothing to fetch
		if (!targetUsername && !isSignedIn) {
			dispatch({ type: 'SET_LINKS', payload: [] })
			setLoading(false)
			return
		}

		try {
			setLoading(true)
			setError(null)

			// If viewing own profile (either no target username, or target username matches own)
			// fetch all links (including private)
			if ((!targetUsername && isSignedIn) || (isOwnProfile && isSignedIn)) {
				const token = await getToken()
				if (!token) throw new Error('No auth token')

				const response = await api.links.getAll(token)
				dispatch({ type: 'SET_LINKS', payload: response.data })
			} else if (targetUsername) {
				// Viewing someone else's links by username - only public links
				const response = await api.links.getByUsername(targetUsername)
				dispatch({ type: 'SET_LINKS', payload: response.data })
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch links')
			console.error('Error fetching links:', err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		refetch()
	}, [targetUsername, isSignedIn, isOwnProfile])

	const addLink = async (data: { title: string; url: string; slug: string; category: string }) => {
		try {
			const token = await getToken()
			if (!token) throw new Error('No auth token')

			const response = await api.links.create(data, token)
			dispatch({ type: 'ADD_LINK', payload: response.data })
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to add link')
			throw err
		}
	}

	const editLink = async (id: string, data: { title: string; url: string; slug: string; category: string }) => {
		try {
			const token = await getToken()
			if (!token) throw new Error('No auth token')

			const response = await api.links.update(id, data, token)
			dispatch({ type: 'EDIT_LINK', payload: response.data })
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to edit link')
			throw err
		}
	}

	const deleteLink = async (id: string) => {
		try {
			const token = await getToken()
			if (!token) throw new Error('No auth token')

			await api.links.delete(id, token)
			dispatch({ type: 'DELETE_LINK', payload: { id } })
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to delete link')
			throw err
		}
	}

	const moveLink = async (id: string, direction: 'up' | 'down') => {
		try {
			// First update local state for immediate UI feedback
			dispatch({ type: 'MOVE_LINK', payload: { id, direction } })

			const token = await getToken()
			if (!token) throw new Error('No auth token')

			// Find the current link and target link to swap
			const currentIndex = links.findIndex(l => l.id === id)
			if (currentIndex === -1) return

			const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
			if (targetIndex < 0 || targetIndex >= links.length) return

			const currentLink = links[currentIndex]
			const targetLink = links[targetIndex]

			// Update both links with swapped order values
			await Promise.all([
				api.links.update(currentLink.id, {
					title: currentLink.title,
					url: currentLink.url,
					slug: currentLink.slug,
					category: currentLink.category,
					visibility: currentLink.visibility,
					order: targetLink.order
				}, token),
				api.links.update(targetLink.id, {
					title: targetLink.title,
					url: targetLink.url,
					slug: targetLink.slug,
					category: targetLink.category,
					visibility: targetLink.visibility,
					order: currentLink.order
				}, token)
			])
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to move link')
			// Refetch to restore correct state if backend update fails
			await refetch()
			throw err
		}
	}

	const toggleLinkStatus = async (id: string) => {
		try {
			const token = await getToken()
			if (!token) throw new Error('No auth token')

			const link = links.find(l => l.id === id)
			if (!link) throw new Error('Link not found')

			const newVisibility = link.visibility === 'public' ? 'private' : 'public'

			// If changing from private to public, set order to be last among public links
			// If changing from public to private, keep the same order
			let newOrder = link.order
			if (newVisibility === 'public' && link.visibility === 'private') {
				// Find the maximum order value among public links and add 1
				const publicLinks = links.filter(l => l.visibility === 'public')
				newOrder = publicLinks.length > 0
					? Math.max(...publicLinks.map(l => l.order)) + 1
					: 0
			}

			const response = await api.links.update(id, {
				title: link.title,
				url: link.url,
				slug: link.slug,
				category: link.category,
				visibility: newVisibility,
				order: newOrder
			}, token)

			dispatch({ type: 'EDIT_LINK', payload: response.data })
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to toggle link visibility')
			throw err
		}
	}

	return (
		<LinksContext.Provider value={{ links, loading, error, isOwnProfile: isOwnProfile || false, dispatch, addLink, editLink, deleteLink, moveLink, toggleLinkStatus, refetch }}>
			{children}
		</LinksContext.Provider>
	)
}

export const useLinks = () => {
	const context = useContext(LinksContext)
	if (context === undefined) {
		throw new Error('useLinks must be used within a LinksProvider')
	}
	return context
}
