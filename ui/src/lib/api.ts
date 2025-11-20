const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

interface ApiOptions extends RequestInit {
	token?: string
}

class ApiError extends Error {
	constructor(public status: number, message: string) {
		super(message)
		this.name = 'ApiError'
	}
}

async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
	const { token, ...fetchOptions } = options

	const headers: HeadersInit = {
		'Content-Type': 'application/json',
		...fetchOptions.headers,
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
			apiRequest<{ data: any[] }>('/api/v1/links', { token }),

		getById: (id: string, token: string) =>
			apiRequest<{ data: any }>(`/api/v1/links/${id}`, { token }),

		create: (data: any, token: string) =>
			apiRequest<{ data: any }>('/api/v1/links', {
				method: 'POST',
				body: JSON.stringify(data),
				token,
			}),

		update: (id: string, data: any, token: string) =>
			apiRequest<{ data: any }>(`/api/v1/links/${id}`, {
				method: 'PUT',
				body: JSON.stringify(data),
				token,
			}),

		delete: (id: string, token: string) =>
			apiRequest<{}>(`/api/v1/links/${id}`, {
				method: 'DELETE',
				token,
			}),
	},

	// Profile endpoints
	profile: {
		getMe: (token: string) =>
			apiRequest<{ data: any }>('/api/v1/profiles/me', { token }),

		getByUserId: (userId: string) =>
			apiRequest<{ data: any }>(`/api/v1/profiles/${userId}`),

		updateMe: (data: any, token: string) =>
			apiRequest<{ data: any }>('/api/v1/profiles/me', {
				method: 'PUT',
				body: JSON.stringify(data),
				token,
			}),
	},
}
