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
	moveLink: (id: string, direction: 'up' | 'down') => void
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

	const moveLink = (id: string, direction: 'up' | 'down') => {
		dispatch({ type: 'MOVE_LINK', payload: { id, direction } })
	}

	const toggleLinkStatus = async (id: string) => {
		try {
			const token = await getToken()
			if (!token) throw new Error('No auth token')

			const link = links.find(l => l.id === id)
			if (!link) throw new Error('Link not found')

			const newVisibility = link.visibility === 'public' ? 'private' : 'public'
			const response = await api.links.update(id, {
				title: link.title,
				url: link.url,
				slug: link.slug,
				category: link.category,
				visibility: newVisibility
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
