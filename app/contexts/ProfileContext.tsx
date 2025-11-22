'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { api } from '@/app/lib/api'

// Profile data combining Clerk user info with custom data from database
export interface ProfileData {
	firstName: string // From Clerk
	lastName: string // From Clerk
	imageUrl: string // From Clerk
	username: string // From Clerk - unique username for URL
	bio: string // From database
}

interface ProfileContextType {
	profile: ProfileData | null
	loading: boolean
	error: string | null
	isOwnProfile: boolean
	updateProfile: (data: Partial<ProfileData>) => Promise<void>
	refetch: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export const ProfileProvider = ({ children, targetUsername }: { children: ReactNode; targetUsername?: string }) => {
	const { getToken, isSignedIn } = useAuth()
	const { user } = useUser()
	const [profile, setProfile] = useState<ProfileData | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Check if viewing own profile - use Clerk user.username for comparison
	const isOwnProfile = isSignedIn && (!targetUsername || user?.username === targetUsername)

	const refetch = useCallback(async () => {
		// If no target username and not signed in, nothing to fetch
		if (!targetUsername && !isSignedIn) {
			setProfile(null)
			setLoading(false)
			return
		}

		try {
			setLoading(true)
			setError(null)

			// If no target username, viewing own profile (signed in)
			if (!targetUsername && isSignedIn && user) {
				const token = await getToken()
				if (!token) throw new Error('No auth token')

				const response = await api.profile.getMe(token)

				// Combine Clerk data with database data
				setProfile({
					firstName: user.firstName || '',
					lastName: user.lastName || '',
					imageUrl: user.imageUrl || '',
					username: user.username || '', // From Clerk
					bio: response.data.bio || ''
				})
			} else if (targetUsername) {
				// Viewing someone else's profile by username - use public endpoint
				const response = await api.profile.getByUsername(targetUsername)

				// Backend returns combined Clerk + database data
				setProfile({
					firstName: response.data.firstName || '',
					lastName: response.data.lastName || '',
					imageUrl: response.data.avatarUrl || '',
					username: response.data.username,
					bio: response.data.bio || ''
				})
			}
		} catch (err) {
			// If profile doesn't exist yet and it's the current user, create it
			const is404 = (err as { status?: number })?.status === 404

			if (is404 && !targetUsername && user && isSignedIn) {
				const defaultProfile = {
					firstName: user.firstName || '',
					lastName: user.lastName || '',
					imageUrl: user.imageUrl || '',
					username: user.username || '', // From Clerk
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
	}, [targetUsername, isSignedIn, user, getToken])

	useEffect(() => {
		refetch()
	}, [refetch])

	const updateProfile = async (data: Partial<ProfileData>) => {
		try {
			const token = await getToken()
			if (!token) throw new Error('No auth token')

			// Only update bio in database (firstName, lastName, imageUrl, and username come from Clerk)
			const response = await api.profile.updateMe({
				bio: data.bio
			}, token)

			// Combine updated data with current Clerk data
			if (user) {
				setProfile({
					firstName: user.firstName || '',
					lastName: user.lastName || '',
					imageUrl: user.imageUrl || '',
					username: user.username || '', // From Clerk
					bio: response.data.bio || ''
				})
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to update profile')
			throw err
		}
	}

	return (
		<ProfileContext.Provider value={{ profile, loading, error, isOwnProfile: isOwnProfile ?? false, updateProfile, refetch }}>
			{children}
		</ProfileContext.Provider>
	)
}

// eslint-disable-next-line react-refresh/only-export-components
export const useProfile = () => {
	const context = useContext(ProfileContext)
	if (context === undefined) {
		throw new Error('useProfile must be used within a ProfileProvider')
	}
	return context
}
