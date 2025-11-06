'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Initialize from DOM class (set by script) or localStorage or system preference
    if (typeof window !== 'undefined') {
      try {
        // First check if dark class is already on the document (from script)
        const hasDarkClass = document.documentElement.classList.contains('dark')
        if (hasDarkClass) {
          return 'dark'
        }
        
        // Then check localStorage
        const savedTheme = localStorage.getItem('theme') as Theme | null
        if (savedTheme === 'light' || savedTheme === 'dark') {
          return savedTheme
        }
        
        // Finally fall back to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      } catch (e) {
        console.error('Error reading theme from localStorage:', e)
        return 'light'
      }
    }
    return 'light'
  })
  const [mounted, setMounted] = useState(false)

  // Sync theme with DOM
  useEffect(() => {
    setMounted(true)
    const root = document.documentElement
    try {
      if (theme === 'dark') {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
      root.setAttribute('data-theme', theme)
      localStorage.setItem('theme', theme)
    } catch (e) {
      console.error('Error setting theme:', e)
    }
  }, [theme])

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((currentTheme) => {
      return currentTheme === 'light' ? 'dark' : 'light'
    })
  }, [])

  // Prevent flash of wrong theme on initial load
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

