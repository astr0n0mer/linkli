'use client'

import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/nextjs'
import { ThemeToggle } from '@/app/components/ThemeToggle'
import { Button } from '@/app/components/ui/button'
import { ProfileProvider, useProfile } from '@/app/contexts/ProfileContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function HomeRedirect() {
  const { profile, loading } = useProfile()
  const router = useRouter()

  useEffect(() => {
    if (!loading && profile?.username) {
      router.push(`/u/${profile.username}`)
    }
  }, [loading, profile, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // If user has a username, redirect to their profile page
  if (profile?.username) {
    return null // Router will handle redirect
  }

  // Otherwise show username setup prompt
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Welcome! Set up your profile</h2>
        <p className="text-muted-foreground">
          Choose a username to create your personalized link page
        </p>
        {/* TODO: Add username setup form */}
      </div>
    </div>
  )
}

export default function HomePage() {
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
          <div className="text-center space-y-4 max-w-md px-4">
            <h1 className="text-4xl font-bold">Create Your Linkli</h1>
            <p className="text-muted-foreground text-lg">
              One link to share everything. Connect your audience to all your content with a single link.
            </p>
            <SignInButton mode="modal">
              <Button size="lg">Get Started</Button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <ProfileProvider>
          <HomeRedirect />
        </ProfileProvider>
      </SignedIn>
    </>
  )
}
