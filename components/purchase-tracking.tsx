"use client"

import * as React from "react"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

interface PurchaseTrackingProps {
  transactionId: string
  value: number
  currency: string
}

export function PurchaseTracking({ transactionId, value, currency }: PurchaseTrackingProps) {
  React.useEffect(() => {
    if (!transactionId || value <= 0) return

    const storageKey = `purchase-tracked:${transactionId}`
    if (window.sessionStorage.getItem(storageKey)) return

    const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
    const googleAdsLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL

    const event = {
      transaction_id: transactionId,
      value,
      currency,
    }

    let isTracked = false
    let attempts = 0
    const maxAttempts = 40

    const tryTrackPurchase = () => {
      if (isTracked || window.sessionStorage.getItem(storageKey)) {
        isTracked = true
        return true
      }

      if (!window.gtag) return false

      window.gtag("event", "purchase", event)

      if (googleAdsId && googleAdsLabel) {
        window.gtag("event", "conversion", {
          send_to: `${googleAdsId}/${googleAdsLabel}`,
          ...event,
        })
      }

      window.sessionStorage.setItem(storageKey, "true")
      isTracked = true
      return true
    }

    if (tryTrackPurchase()) return

    const retryTimer = window.setInterval(() => {
      attempts += 1

      const tracked = tryTrackPurchase()
      if (tracked || attempts >= maxAttempts) {
        window.clearInterval(retryTimer)
      }
    }, 250)

    return () => window.clearInterval(retryTimer)
  }, [currency, transactionId, value])

  return null
}
