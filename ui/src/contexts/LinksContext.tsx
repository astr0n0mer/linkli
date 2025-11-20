import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from 'react'
import { useAuth } from '@clerk/clerk-react'
import type { LinkType } from '@/lib/types'
import { linksReducer, type LinksAction } from '@/reducers/linksReducer'
import { api } from '@/lib/api'

interface LinksContextType {
	links: LinkType[]
	loading: boolean
	error: string | null
	dispatch: React.Dispatch<LinksAction>
	addLink: (data: { title: string; url: string; slug: string; category: string }) => Promise<void>
	editLink: (id: string, data: { title: string; url: string; slug: string; category: string }) => Promise<void>
	deleteLink: (id: string) => Promise<void>
	moveLink: (id: string, direction: 'up' | 'down') => void
	refetch: () => Promise<void>
}

const LinksContext = createContext<LinksContextType | undefined>(undefined)

export const LinksProvider = ({ children }: { children: ReactNode }) => {
	const { getToken, isSignedIn } = useAuth()
	const [links, dispatch] = useReducer(linksReducer, [])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const refetch = async () => {
		if (!isSignedIn) return

		try {
			setLoading(true)
			setError(null)
			const token = await getToken()
			if (!token) throw new Error('No auth token')

			const response = await api.links.getAll(token)
			dispatch({ type: 'SET_LINKS', payload: response.data })
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to fetch links')
			console.error('Error fetching links:', err)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		refetch()
	}, [isSignedIn])

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

	return (
		<LinksContext.Provider value={{ links, loading, error, dispatch, addLink, editLink, deleteLink, moveLink, refetch }}>
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
