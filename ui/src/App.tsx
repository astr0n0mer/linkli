import './App.css'
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/clerk-react'
import Profile from '@/components/Profile'
import Links from '@/components/Links'
import LinkForm from '@/components/LinkForm'
import { LinksProvider } from '@/contexts/LinksContext'
import { ProfileProvider } from '@/contexts/ProfileContext'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'

function App() {
	const { isLoaded } = useAuth()

	// Show loading state while Clerk is checking authentication
	if (!isLoaded) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center space-y-4">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
					<p className="text-muted-foreground">Loading...</p>
				</div>
			</div>
		)
	}

	return (
		<>
			<div className="fixed top-4 left-4 z-50">
				<ThemeToggle />
			</div>

			<div className="fixed top-4 right-4 z-50 flex gap-2">
				<SignedIn>
					<UserButton />
				</SignedIn>
			</div>

			<SignedOut>
				<div className="flex min-h-screen items-center justify-center">
					<div className="text-center space-y-4">
						<h1 className="text-4xl font-bold">Welcome to Linktree</h1>
						<p className="text-muted-foreground">Sign in to manage your links</p>
						<SignInButton mode="modal">
							<Button size="lg">Sign In</Button>
						</SignInButton>
					</div>
				</div>
			</SignedOut>

			<SignedIn>
				<ProfileProvider>
					<Profile />
				</ProfileProvider>

				<LinksProvider>
					<Links />
					<div className="flex justify-center py-4">
						<LinkForm
							mode="add"
							trigger={<Button>Add Link</Button>}
						/>
					</div>
				</LinksProvider>
			</SignedIn>
		</>
	)
}

export default App
