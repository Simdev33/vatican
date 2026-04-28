"use client"

import Script from "next/script"
import { useEffect, useState } from "react"

type CookieConsent = {
  necessary: true
  analytics: boolean
  marketing: boolean
  savedAt: string
}

const CONSENT_STORAGE_KEY = "paristourpass-cookie-consent-v1"

function readStoredConsent() {
  try {
    const storedConsent = window.localStorage.getItem(CONSENT_STORAGE_KEY)

    if (!storedConsent) return null

    return JSON.parse(storedConsent) as CookieConsent
  } catch {
    return null
  }
}

export function GoogleTags() {
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
  const tagId = gaMeasurementId ?? googleAdsId
  const [consent, setConsent] = useState<CookieConsent | null>(null)

  useEffect(() => {
    setConsent(readStoredConsent())

    function handleConsentUpdate(event: Event) {
      setConsent((event as CustomEvent<CookieConsent>).detail)
    }

    window.addEventListener("cookie-consent-updated", handleConsentUpdate)

    return () => window.removeEventListener("cookie-consent-updated", handleConsentUpdate)
  }, [])

  if (!tagId || (!consent?.analytics && !consent?.marketing)) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${tagId}`} strategy="afterInteractive" />
      <Script id="google-tags" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('consent', 'default', {
            analytics_storage: '${consent.analytics ? "granted" : "denied"}',
            ad_storage: '${consent.marketing ? "granted" : "denied"}',
            ad_user_data: '${consent.marketing ? "granted" : "denied"}',
            ad_personalization: '${consent.marketing ? "granted" : "denied"}'
          });
          gtag('js', new Date());
          ${gaMeasurementId ? `gtag('config', '${gaMeasurementId}');` : ""}
          ${googleAdsId ? `gtag('config', '${googleAdsId}');` : ""}
        `}
      </Script>
    </>
  )
}
