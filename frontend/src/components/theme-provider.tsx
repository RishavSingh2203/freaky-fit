import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
}

// Create context
const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

// Custom hook for using the theme context
function useTheme() {
  const context = useContext(ThemeProviderContext)
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
    
  return context
}

// Theme Provider component
function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "freaky-fit-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    // Remove existing classes
    root.classList.remove("light", "dark")
    
    // Add the current theme class
    root.classList.add(theme)
  }, [theme])
  
  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
  }
  
  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export { ThemeProvider, useTheme } 