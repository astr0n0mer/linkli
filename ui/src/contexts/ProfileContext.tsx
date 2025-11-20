import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { api } from '@/lib/api'

export interface ProfileData {
	fullName: string
	bio: string
	imageUrl: string
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
			setProfile({
				fullName: response.data.username || user.fullName || '',
				bio: response.data.bio || '',
				imageUrl: response.data.avatarUrl || user.imageUrl || ''
			})
		} catch (err) {
			// If profile doesn't exist yet, create it from Clerk user data
			const is404 = (err as any)?.status === 404

			if (is404 && user) {
				const defaultProfile = {
					fullName: user.fullName || user.firstName || '',
					bio: '',
					imageUrl: user.imageUrl || ''
				}

				// Create profile in database
				try {
					const token = await getToken()
					if (token) {
						await api.profile.updateMe({
							username: defaultProfile.fullName,
							bio: defaultProfile.bio,
							avatarUrl: defaultProfile.imageUrl
						}, token)
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

			const response = await api.profile.updateMe({
				username: data.fullName,
				bio: data.bio,
				avatarUrl: data.imageUrl
			}, token)

			setProfile({
				fullName: response.data.username || '',
				bio: response.data.bio || '',
				imageUrl: response.data.avatarUrl || ''
			})
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
