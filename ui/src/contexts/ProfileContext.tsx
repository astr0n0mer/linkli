import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { api } from '@/lib/api'

// Profile data combining Clerk user info with custom bio from database
export interface ProfileData {
	firstName: string // From Clerk
	lastName: string // From Clerk
	imageUrl: string // From Clerk
	bio: string // From database
}

interface ProfileContextType {
	profile: ProfileData | null
	loading: boolean
	error: string | null
	updateProfile: (data: Partial<ProfileData>) => Promise<void>
	refetch: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
	const { getToken, isSignedIn } = useAuth()
	const { user } = useUser()
	const [profile, setProfile] = useState<ProfileData | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const refetch = async () => {
		if (!isSignedIn || !user) {
			setProfile(null)
			setLoading(false)
			return
		}

		try {
			setLoading(true)
			setError(null)
			const token = await getToken()
			if (!token) throw new Error('No auth token')

			const response = await api.profile.getMe(token)

			// Combine Clerk data with database bio
			setProfile({
				firstName: user.firstName || '',
				lastName: user.lastName || '',
				imageUrl: user.imageUrl || '',
				bio: response.data.bio || ''
			})
		} catch (err) {
			// If profile doesn't exist yet, create it with empty bio
			const is404 = (err as any)?.status === 404

			if (is404 && user) {
				const defaultProfile = {
					firstName: user.firstName || '',
					lastName: user.lastName || '',
					imageUrl: user.imageUrl || '',
					bio: ''
				}

				// Create profile in database (only stores bio)
				try {
					const token = await getToken()
					if (token) {
						await api.profile.updateMe({ bio: '' }, token)
					}
				} catch (createErr) {
					console.error('Error creating profile:', createErr)
				}

				setProfile(defaultProfile)
			} else {
				setError(err instanceof Error ? err.message : 'Failed to fetch profile')
				console.error('Error fetching profile:', err)
			}
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		refetch()
	}, [isSignedIn, user])

	const updateProfile = async (data: Partial<ProfileData>) => {
		try {
			const token = await getToken()
			if (!token) throw new Error('No auth token')

			// Only update bio in database (firstName, lastName, and imageUrl come from Clerk)
			const response = await api.profile.updateMe({
				bio: data.bio
			}, token)

			// Combine updated bio with current Clerk data
			if (user) {
				setProfile({
					firstName: user.firstName || '',
					lastName: user.lastName || '',
					imageUrl: user.imageUrl || '',
					bio: response.data.bio || ''
				})
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to update profile')
			throw err
		}
	}

	return (
		<ProfileContext.Provider value={{ profile, loading, error, updateProfile, refetch }}>
			{children}
		</ProfileContext.Provider>
	)
}

export const useProfile = () => {
	const context = useContext(ProfileContext)
	if (context === undefined) {
		throw new Error('useProfile must be used within a ProfileProvider')
	}
	return context
}
