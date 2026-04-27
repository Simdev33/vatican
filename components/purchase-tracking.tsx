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
    if (!window.gtag || !transactionId || value <= 0) return

    const storageKey = `purchase-tracked:${transactionId}`
    if (window.sessionStorage.getItem(storageKey)) return

    const event = {
      transaction_id: transactionId,
      value,
      currency,
    }

    window.gtag("event", "purchase", event)
    window.sessionStorage.setItem(storageKey, "true")

    const googleAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID
    const googleAdsLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL

    if (googleAdsId && googleAdsLabel) {
      window.gtag("event", "conversion", {
        send_to: `${googleAdsId}/${googleAdsLabel}`,
        ...event,
      })
    }
  }, [currency, transactionId, value])

  return null
}
