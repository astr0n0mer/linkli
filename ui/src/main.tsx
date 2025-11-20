import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import './index.css'
import App from './App.tsx'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key')
}

function ClerkWithTheme({ children }: { children: React.ReactNode }) {
  const { actualTheme } = useTheme()

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: actualTheme === 'dark' ? dark : undefined,
      }}
    >
      {children}
    </ClerkProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ClerkWithTheme>
        <App />
      </ClerkWithTheme>
    </ThemeProvider>
  </StrictMode>,
)
