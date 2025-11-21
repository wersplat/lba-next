'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { leaguesApi, type LeagueInfo } from '@/services/leagues'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  leagueInfo: LeagueInfo | null
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Default colors (fallback)
const DEFAULT_PRIMARY = '#7A60A8'
const DEFAULT_SECONDARY = '#21104A'
const DEFAULT_ACCENT = '#B51E4E'

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
  const [leagueInfo, setLeagueInfo] = useState<LeagueInfo | null>(null)

  // Apply league colors to CSS variables
  const applyLeagueColors = useCallback((info: LeagueInfo) => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    const primary = info.color_primary || DEFAULT_PRIMARY
    const secondary = info.color_secondary || DEFAULT_SECONDARY
    const accent = info.color_accent || DEFAULT_ACCENT

    // Set CSS variables for league colors
    root.style.setProperty('--league-primary', primary)
    root.style.setProperty('--league-secondary', secondary)
    root.style.setProperty('--league-accent', accent)

    // Also set legacy variable names for backward compatibility
    root.style.setProperty('--legends-purple', primary)
    root.style.setProperty('--legends-red', secondary)
    root.style.setProperty('--legends-blue', accent)
  }, [])

  // Apply default colors
  const applyDefaultColors = useCallback(() => {
    if (typeof window === 'undefined') return

    const root = document.documentElement
    root.style.setProperty('--league-primary', DEFAULT_PRIMARY)
    root.style.setProperty('--league-secondary', DEFAULT_SECONDARY)
    root.style.setProperty('--league-accent', DEFAULT_ACCENT)
    root.style.setProperty('--legends-purple', DEFAULT_PRIMARY)
    root.style.setProperty('--legends-red', DEFAULT_SECONDARY)
    root.style.setProperty('--legends-blue', DEFAULT_ACCENT)
  }, [])

  // Fetch league info and apply colors
  useEffect(() => {
    const fetchLeagueInfo = async () => {
      try {
        const info = await leaguesApi.getLegendsLeagueInfo()
        if (info) {
          setLeagueInfo(info)
          applyLeagueColors(info)
        } else {
          // Apply default colors if no league info found
          applyDefaultColors()
        }
      } catch (error) {
        console.error('Error fetching league info:', error)
        applyDefaultColors()
      }
    }

    fetchLeagueInfo()
  }, [applyLeagueColors, applyDefaultColors])

  // Sync theme with DOM
  useEffect(() => {
    if (typeof window === 'undefined') return
    
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
      const newTheme = currentTheme === 'light' ? 'dark' : 'light'
      return newTheme
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, leagueInfo }}>
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

