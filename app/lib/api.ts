import type { LinkType, Profile } from './types'

// API is now same-origin (Next.js API routes), so no need for external URL
const API_URL = ''

// Extended profile with Clerk data (returned by public profile endpoints)
interface PublicProfile extends Profile {
	username: string
	firstName: string
	lastName: string
	avatarUrl: string
}

interface ApiOptions extends RequestInit {
	token?: string
}

class ApiError extends Error {
	status: number
	constructor(status: number, message: string) {
		super(message)
		this.status = status
		this.name = 'ApiError'
	}
}

interface ApiResponse<T> {
	data: T
}

async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
	const { token, ...fetchOptions } = options

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
	}

	if (token) {
		headers['Authorization'] = `Bearer ${token}`
	}

	const response = await fetch(`${API_URL}${endpoint}`, {
		...fetchOptions,
		headers,
	})

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({ error: 'Request failed' }))
		const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`
		throw new ApiError(response.status, errorMessage)
	}

	// Handle 204 No Content
	if (response.status === 204) {
		return {} as T
	}

	return response.json()
}

export const api = {
	// Links endpoints
	links: {
		getAll: (token: string) =>
			apiRequest<ApiResponse<LinkType[]>>('/api/v1/links', { token }),

		getByUsername: (username: string) =>
			apiRequest<ApiResponse<LinkType[]>>(`/api/v1/links/username/${username}`),

		getByUserId: (userId: string) =>
			apiRequest<ApiResponse<LinkType[]>>(`/api/v1/links/user/${userId}`),

		getById: (id: string, token: string) =>
			apiRequest<ApiResponse<LinkType>>(`/api/v1/links/${id}`, { token }),

		create: (data: Pick<LinkType, 'title' | 'url' | 'slug' | 'category'>, token: string) =>
			apiRequest<ApiResponse<LinkType>>('/api/v1/links', {
				method: 'POST',
				body: JSON.stringify(data),
				token,
			}),

		update: (id: string, data: Partial<Omit<LinkType, 'id' | 'createdAt' | 'updatedAt' | 'ownerId'>>, token: string) =>
			apiRequest<ApiResponse<LinkType>>(`/api/v1/links/${id}`, {
				method: 'PUT',
				body: JSON.stringify(data),
				token,
			}),

		delete: (id: string, token: string) =>
			apiRequest<Record<string, never>>(`/api/v1/links/${id}`, {
				method: 'DELETE',
				token,
			}),
	},

	// Profile endpoints
	profile: {
		getMe: (token: string) =>
			apiRequest<ApiResponse<Profile>>('/api/v1/profiles/me', { token }),

		getByUsername: (username: string) =>
			apiRequest<ApiResponse<PublicProfile>>(`/api/v1/profiles/username/${username}`),

		getByUserId: (userId: string) =>
			apiRequest<ApiResponse<PublicProfile>>(`/api/v1/profiles/${userId}`),

		updateMe: (data: Partial<Omit<Profile, 'userid'>>, token: string) =>
			apiRequest<ApiResponse<Profile>>('/api/v1/profiles/me', {
				method: 'PUT',
				body: JSON.stringify(data),
				token,
			}),
	},
}
