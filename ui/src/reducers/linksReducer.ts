import type { LinkType } from '@/lib/types'

export type LinksAction =
	| { type: 'SET_LINKS'; payload: LinkType[] }
	| { type: 'ADD_LINK'; payload: LinkType }
	| { type: 'EDIT_LINK'; payload: LinkType }
	| { type: 'DELETE_LINK'; payload: { id: string } }
	| { type: 'REORDER_LINKS'; payload: { links: LinkType[] } }
	| { type: 'MOVE_LINK'; payload: { id: string; direction: 'up' | 'down' } }

export const linksReducer = (state: LinkType[], action: LinksAction): LinkType[] => {
	switch (action.type) {
		case 'SET_LINKS': {
			return action.payload
		}

		case 'ADD_LINK': {
			return [...state, action.payload]
		}

		case 'EDIT_LINK': {
			return state.map(link =>
				link.id === action.payload.id ? action.payload : link
			)
		}

		case 'DELETE_LINK': {
			return state.filter(link => link.id !== action.payload.id)
		}

		case 'REORDER_LINKS': {
			return action.payload.links
		}

		case 'MOVE_LINK': {
			const { id, direction } = action.payload
			const index = state.findIndex(link => link.id === id)

			if (index === -1) return state

			// Can't move up if already at top
			if (direction === 'up' && index === 0) return state

			// Can't move down if already at bottom
			if (direction === 'down' && index === state.length - 1) return state

			const newState = [...state]
			const targetIndex = direction === 'up' ? index - 1 : index + 1

			// Swap the links
			const temp = newState[index]
			newState[index] = newState[targetIndex]
			newState[targetIndex] = temp

			// Update order values
			return newState.map((link, idx) => ({
				...link,
				order: idx + 1
			}))
		}

		default:
			return state
	}
}
