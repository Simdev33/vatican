"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/components/language-provider"

const navItems = [
  { key: "tickets", href: "#tickets" },
  { key: "gallery", href: "#gallery" },
  { key: "discover", href: "#discover" },
  { key: "contact", href: "#contact" },
] as const

const navLabels = {
  tickets: "tickets",
  gallery: "gallery",
  discover: "discover",
  contact: "contact",
} as const

const brandTagline = {
  en: "by TicketCompass",
  fr: "by TicketCompass",
  de: "by TicketCompass",
  es: "by TicketCompass",
  it: "by TicketCompass",
} as const

const getNavLabel = (labels: ReturnType<typeof useLanguage>["t"]["nav"], key: keyof typeof navLabels) =>
  labels[navLabels[key]].toUpperCase()

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { locale, t } = useLanguage()
  const headerOffset = 170

  const handleMenuClick = (href: string, closeMobileMenu = false) => {
    if (typeof window === "undefined") return

    if (!href.startsWith("#")) return

    const target = document.querySelector(href)
    if (!target) {
      window.location.href = `/${href}`
      if (closeMobileMenu) {
        setMobileMenuOpen(false)
      }
      return
    }

    const topPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset
    window.scrollTo({
      top: Math.max(topPosition, 0),
      behavior: "smooth",
    })

    if (closeMobileMenu) {
      setMobileMenuOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="bg-[#1a365d] py-1.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-medium text-white/80">{t.ownershipNotice}</p>
          <LanguageSwitcher />
        </div>
      </div>

      {/* Main header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d4a853]">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
                <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.5l5.5 3.44v6.12L12 17.5l-5.5-3.44V7.94L12 4.5z"/>
                <path d="M12 8a2 2 0 100 4 2 2 0 000-4z"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-tight tracking-tight text-[#1a365d]">Paris Tour Pass</span>
              <span className="text-[9px] tracking-[0.2em] text-gray-400">{brandTagline[locale]}</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={(event) => {
                  event.preventDefault()
                  handleMenuClick(item.href)
                }}
                className="relative text-sm font-medium tracking-wide text-gray-600 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#d4a853] after:transition-all hover:text-[#1a365d] hover:after:w-full"
              >
                {getNavLabel(t.nav, item.key)}
              </Link>
            ))}
          </nav>

          {/* Book Now Button (Desktop) */}
          <a
            href="#tickets"
            onClick={(event) => {
              event.preventDefault()
              handleMenuClick("#tickets")
            }}
            className="hidden rounded-full bg-[#d4a853] px-5 py-2 text-sm font-semibold text-[#1a365d] transition-all hover:bg-[#e5b964] hover:shadow-md lg:block"
          >
            {t.nav.bookNow}
          </a>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher variant="light" />
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <nav className="flex flex-col space-y-1 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="rounded-lg px-3 py-3 text-base font-medium tracking-wide text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#1a365d]"
                onClick={(event) => {
                  event.preventDefault()
                  handleMenuClick(item.href, true)
                }}
              >
                {getNavLabel(t.nav, item.key)}
              </Link>
            ))}
            <a
              href="#tickets"
              className="mt-2 rounded-lg bg-[#d4a853] px-3 py-3 text-center text-base font-semibold text-[#1a365d]"
              onClick={(event) => {
                event.preventDefault()
                handleMenuClick("#tickets", true)
              }}
            >
              {t.nav.bookNow}
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
