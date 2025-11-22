'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { ThemeProvider, useTheme } from '@/app/contexts/ThemeContext'

function ClerkWithTheme({ children }: { children: React.ReactNode }) {
  const { actualTheme } = useTheme()

  return (
    <ClerkProvider
      appearance={{
        baseTheme: actualTheme === 'dark' ? dark : undefined,
      }}
    >
      {children}
    </ClerkProvider>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ClerkWithTheme>
        {children}
      </ClerkWithTheme>
    </ThemeProvider>
  )
}
