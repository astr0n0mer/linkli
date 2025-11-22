'use client'

import { use } from 'react'
import { useAuth, useUser, SignInButton, UserButton } from '@clerk/nextjs'
import Profile from '@/app/components/Profile'
import Links from '@/app/components/Links'
import LinkForm from '@/app/components/LinkForm'
import { Button } from '@/app/components/ui/button'
import { ThemeToggle } from '@/app/components/ThemeToggle'
import { ProfileProvider } from '@/app/contexts/ProfileContext'
import { LinksProvider } from '@/app/contexts/LinksContext'
import { useRouter } from 'next/navigation'

function ProfileContent({ username }: { username: string }) {
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth()
  const { user, isLoaded: isUserLoaded } = useUser()
  const router = useRouter()

  // Wait for both auth and user to be loaded before determining ownership
  const isFullyLoaded = isAuthLoaded && isUserLoaded

  // Check if the current user is viewing their own profile
  // Only set to true once we're sure the user data is loaded
  const isOwnProfile = isFullyLoaded && isSignedIn && user?.username === username

  // Don't render LinksProvider until we know the ownership state for certain
  // This prevents a double-fetch where it first fetches public-only, then refetches with auth
  if (!isFullyLoaded) {
    return (
      <>
        <Profile />
        <div className="flex flex-col gap-4 max-w-2xl mx-auto px-4 py-4">
          <div className="animate-pulse space-y-4">
            <div className="h-16 bg-gray-300 rounded" />
            <div className="h-16 bg-gray-300 rounded" />
            <div className="h-16 bg-gray-300 rounded" />
          </div>
        </div>
      </>
    )
  }

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
        ) : isSignedIn ? (
          <div className="flex justify-center py-8">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">Want to manage your own links?</p>
              <Button
                size="lg"
                variant="default"
                onClick={() => router.push(`/u/${user?.username}`)}
              >
                Go to Your Linkli
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-8">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">Want your own page like this?</p>
              <SignInButton mode="modal">
                <Button size="lg" variant="default">
                  Create Your Linkli
                </Button>
              </SignInButton>
            </div>
          </div>
        )}
      </LinksProvider>
    </>
  )
}

export default function UserProfilePage({
  params
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = use(params)
  const { isSignedIn } = useAuth()

  if (!username) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Invalid profile URL</p>
      </div>
    )
  }

  return (
    <>
      <div className="fixed top-4 left-4 z-50">
        <ThemeToggle />
      </div>

      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {isSignedIn && <UserButton />}
      </div>

      <ProfileProvider targetUsername={username}>
        <ProfileContent username={username} />
      </ProfileProvider>
    </>
  )
}
