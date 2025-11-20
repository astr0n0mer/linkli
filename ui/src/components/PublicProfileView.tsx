import { useParams } from 'react-router-dom'
import { useAuth, useUser, SignInButton } from '@clerk/clerk-react'
import Profile from './Profile'
import Links from './Links'
import LinkForm from './LinkForm'
import { Button } from './ui/button'
import { ProfileProvider, useProfile } from '@/contexts/ProfileContext'
import { LinksProvider } from '@/contexts/LinksContext'

function ProfileContent({ username }: { username: string }) {
	const { isSignedIn } = useAuth()
	const { user } = useUser()
	const { profile } = useProfile()

	// Check if the current user is viewing their own profile
	// Use Clerk user.username for comparison (always available when signed in)
	const isOwnProfile = isSignedIn && user?.username === username

	return (
		<>
			<Profile />
			<LinksProvider targetUsername={username} isOwnProfile={isOwnProfile}>
				<Links />

				{isOwnProfile ? (
					<div className="flex justify-center py-4">
						<LinkForm
							mode="add"
							trigger={<Button>Add Link</Button>}
						/>
					</div>
				) : (
					<div className="flex justify-center py-8">
						<div className="text-center space-y-4">
							<p className="text-muted-foreground">Want your own page like this?</p>
							<SignInButton mode="modal">
								<Button size="lg" variant="default">
									Create Your Linktree
								</Button>
							</SignInButton>
						</div>
					</div>
				)}
			</LinksProvider>
		</>
	)
}

export const PublicProfileView = () => {
	const { username } = useParams<{ username: string }>()

	if (!username) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<p className="text-muted-foreground">Invalid profile URL</p>
			</div>
		)
	}

	return (
		<ProfileProvider targetUsername={username}>
			<ProfileContent username={username} />
		</ProfileProvider>
	)
}

export default PublicProfileView
