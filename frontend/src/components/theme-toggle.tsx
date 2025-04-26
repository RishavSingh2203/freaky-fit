import React, { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only show the toggle after mounted to avoid hydration errors
  useEffect(() => {
    setMounted(true)
  }, [])

  // Simple toggle between light and dark
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    
    // Directly manipulate DOM for immediate visual feedback
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(newTheme)
  }

  if (!mounted) {
    return <div className="w-10 h-10" />
  }

  return (
    <Button 
      variant="outline"
      size="icon" 
      onClick={toggleTheme}
      className="w-10 h-10 border border-input rounded-md"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
      <span className="sr-only">
        {theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
      </span>
    </Button>
  )
} 