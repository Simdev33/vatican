"use client"

import { localeLabels, locales, type Locale } from "@/lib/i18n"
import { useLanguage } from "@/components/language-provider"

const shortLabels: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  de: "DE",
  es: "ES",
  it: "IT",
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage()

  return (
    <label className="inline-flex items-center gap-2 text-xs text-white/80">
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        className="rounded-full border border-white/20 bg-[#1a365d] px-2 py-1 text-xs font-semibold text-white outline-none"
        aria-label="Language"
      >
        {locales.map((item) => (
          <option key={item} value={item}>
            {shortLabels[item]} - {localeLabels[item]}
          </option>
        ))}
      </select>
    </label>
  )
}
