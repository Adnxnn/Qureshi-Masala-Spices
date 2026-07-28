'use client'

import { useCallback, useEffect, useState } from 'react'
import { MoonStar, SunMedium } from 'lucide-react'

type Theme = 'dark' | 'light'

const STORAGE_KEY = 'qms-theme-v1'

function getDocumentTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    setTheme(getDocumentTheme())

    const syncTheme = () => setTheme(getDocumentTheme())
    window.addEventListener('qms-theme-change', syncTheme)
    return () => window.removeEventListener('qms-theme-change', syncTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    const nextTheme: Theme = getDocumentTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = nextTheme
    localStorage.setItem(STORAGE_KEY, nextTheme)

    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (themeColor) {
      themeColor.content = nextTheme === 'dark' ? '#07070b' : '#fff7e4'
    }

    setTheme(nextTheme)
    window.dispatchEvent(new Event('qms-theme-change'))
  }, [])

  const nextThemeLabel = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="qms-theme-toggle"
      aria-label={`Switch to ${nextThemeLabel} theme`}
      title={`Switch to ${nextThemeLabel} theme`}
    >
      <SunMedium className="qms-theme-icon qms-theme-icon-sun" size={17} aria-hidden="true" />
      <MoonStar className="qms-theme-icon qms-theme-icon-moon" size={17} aria-hidden="true" />
      <span className="sr-only">Switch colour theme</span>
    </button>
  )
}
