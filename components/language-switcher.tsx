"use client"

import { localeLabels, locales, type Locale } from "@/lib/i18n"
import { useLanguage } from "@/components/language-provider"
import { cn } from "@/lib/utils"

const shortLabels: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  de: "DE",
  es: "ES",
  it: "IT",
}

export function LanguageSwitcher({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const { locale, setLocale } = useLanguage()
  const isLight = variant === "light"

  return (
    <label className={cn("inline-flex items-center gap-2 text-xs", isLight ? "text-[#1a365d]" : "text-white/80")}>
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        className={cn(
          "rounded-full border px-2 py-1 text-xs font-semibold outline-none",
          isLight
            ? "border-gray-200 bg-gray-50 text-[#1a365d]"
            : "border-white/20 bg-[#1a365d] text-white",
        )}
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
