"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

type CookieConsent = {
  necessary: true
  analytics: boolean
  marketing: boolean
  savedAt: string
}

const CONSENT_STORAGE_KEY = "paristourpass-cookie-consent-v1"

function updateGoogleConsent(consent: CookieConsent) {
  window.dispatchEvent(new CustomEvent("cookie-consent-updated", { detail: consent }))

  const gtag = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag

  if (!gtag) return

  gtag("consent", "update", {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: consent.marketing ? "granted" : "denied",
    ad_user_data: consent.marketing ? "granted" : "denied",
    ad_personalization: consent.marketing ? "granted" : "denied",
  })
}

export function CookieBanner() {
  const [isReady, setIsReady] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const storedConsent = window.localStorage.getItem(CONSENT_STORAGE_KEY)

    setIsVisible(!storedConsent)
    setIsReady(true)
  }, [])

  function saveConsent(nextConsent: Omit<CookieConsent, "necessary" | "savedAt">) {
    const consent: CookieConsent = {
      necessary: true,
      analytics: nextConsent.analytics,
      marketing: nextConsent.marketing,
      savedAt: new Date().toISOString(),
    }

    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent))
    updateGoogleConsent(consent)
    setIsVisible(false)
  }

  if (!isReady || !isVisible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6">
      <div className="mx-auto max-w-5xl rounded-2xl border border-[#d4a853]/50 bg-[#102746] p-5 text-white shadow-2xl">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#f2cb73]">Cookie Preferences</p>
            <h2 className="mt-2 text-xl font-semibold">We use cookies to improve your experience</h2>
            <p className="mt-2 text-sm leading-6 text-white/75">
              Necessary cookies keep the site working. With your permission, we also use analytics and marketing
              cookies to measure performance and improve our offers. You can learn more in our{" "}
              <Link href="/cookie-policy" className="font-medium text-[#f2cb73] underline underline-offset-4">
                Cookie Policy
              </Link>
              .
            </p>

            {isCustomizing && (
              <div className="mt-4 grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
                <label className="flex items-start gap-3">
                  <input checked disabled type="checkbox" className="mt-1 h-4 w-4 accent-[#d4a853]" />
                  <span>
                    <span className="font-semibold">Necessary cookies</span>
                    <span className="block text-white/65">Required for checkout, security, and core site features.</span>
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input
                    checked={analytics}
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-[#d4a853]"
                    onChange={(event) => setAnalytics(event.target.checked)}
                  />
                  <span>
                    <span className="font-semibold">Analytics cookies</span>
                    <span className="block text-white/65">Help us understand traffic and improve the website.</span>
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input
                    checked={marketing}
                    type="checkbox"
                    className="mt-1 h-4 w-4 accent-[#d4a853]"
                    onChange={(event) => setMarketing(event.target.checked)}
                  />
                  <span>
                    <span className="font-semibold">Marketing cookies</span>
                    <span className="block text-white/65">Allow ad measurement and relevant advertising.</span>
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:min-w-44">
            <button
              type="button"
              className="rounded-full bg-[#d4a853] px-5 py-2.5 text-sm font-semibold text-[#102746] transition hover:bg-[#f2cb73]"
              onClick={() => saveConsent({ analytics: true, marketing: true })}
            >
              Accept all
            </button>
            {isCustomizing ? (
              <button
                type="button"
                className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                onClick={() => saveConsent({ analytics, marketing })}
              >
                Save preferences
              </button>
            ) : (
              <button
                type="button"
                className="rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                onClick={() => setIsCustomizing(true)}
              >
                Customize
              </button>
            )}
            <button
              type="button"
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
              onClick={() => saveConsent({ analytics: false, marketing: false })}
            >
              Reject non-essential
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
