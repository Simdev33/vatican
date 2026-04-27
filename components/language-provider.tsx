"use client"

import * as React from "react"
import { dictionaries, isLocale, type Locale } from "@/lib/i18n"

type LanguageContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (typeof dictionaries)[Locale]
}

const LanguageContext = React.createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = React.useState<Locale>("en")

  React.useEffect(() => {
    const storedLocale = window.localStorage.getItem("locale")
    const browserLocale = window.navigator.language.slice(0, 2)
    const nextLocale = isLocale(storedLocale) ? storedLocale : isLocale(browserLocale) ? browserLocale : "en"
    setLocaleState(nextLocale)
    document.documentElement.lang = nextLocale
  }, [])

  const setLocale = React.useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale)
    window.localStorage.setItem("locale", nextLocale)
    document.documentElement.lang = nextLocale
  }, [])

  const value = React.useMemo(
    () => ({
      locale,
      setLocale,
      t: dictionaries[locale],
    }),
    [locale, setLocale],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = React.useContext(LanguageContext)

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider")
  }

  return context
}
