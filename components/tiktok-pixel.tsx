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
const TIKTOK_PIXEL_ID = "D82P31BC77U26NJHHR5G"

function readStoredConsent() {
  try {
    const storedConsent = window.localStorage.getItem(CONSENT_STORAGE_KEY)

    if (!storedConsent) return null

    return JSON.parse(storedConsent) as CookieConsent
  } catch {
    return null
  }
}

export function TiktokPixel() {
  const [consent, setConsent] = useState<CookieConsent | null>(null)

  useEffect(() => {
    setConsent(readStoredConsent())

    function handleConsentUpdate(event: Event) {
      setConsent((event as CustomEvent<CookieConsent>).detail)
    }

    window.addEventListener("cookie-consent-updated", handleConsentUpdate)

    return () => window.removeEventListener("cookie-consent-updated", handleConsentUpdate)
  }, [])

  if (!consent?.marketing) return null

  return (
    <Script id="tiktok-pixel" strategy="afterInteractive">
      {`
        !function (w, d, t) {
          w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(
        var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script")
        ;n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};

          ttq.load('${TIKTOK_PIXEL_ID}');
          ttq.page();
        }(window, document, 'ttq');
      `}
    </Script>
  )
}
