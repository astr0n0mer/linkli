import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
	theme: Theme
	setTheme: (theme: Theme) => void
	actualTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setThemeState] = useState<Theme>(() => {
		// Check localStorage first, fallback to system preference
		const stored = localStorage.getItem('theme') as Theme
		return stored || 'system'
	})

	const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')

	useEffect(() => {
		const root = document.documentElement

		// Function to get the actual theme based on current selection
		const getActualTheme = (): 'light' | 'dark' => {
			if (theme === 'system') {
				return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
			}
			return theme
		}

		const applyTheme = () => {
			const newActualTheme = getActualTheme()
			setActualTheme(newActualTheme)

			// Remove both classes first
			root.classList.remove('light', 'dark')
			// Add the appropriate class
			root.classList.add(newActualTheme)
		}

		// Apply theme on mount and when theme changes
		applyTheme()

		// Listen for system theme changes when in system mode
		if (theme === 'system') {
			const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
			const handler = () => applyTheme()
			mediaQuery.addEventListener('change', handler)
			return () => mediaQuery.removeEventListener('change', handler)
		}
	}, [theme])

	const setTheme = (newTheme: Theme) => {
		setThemeState(newTheme)
		localStorage.setItem('theme', newTheme)
	}

	return (
		<ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}

export const useTheme = () => {
	const context = useContext(ThemeContext)
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}
	return context
}
