"use client"

import * as React from "react"
import { createTiktokContent, identifyTiktokCustomer, trackTiktokEvent } from "@/lib/tiktok-events"

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

interface PurchaseTrackingProps {
  transactionId: string
  value: number
  currency: string
  productId?: string
  productTitle?: string
  customerEmail?: string
  customerPhone?: string
}

export function PurchaseTracking({
  transactionId,
  value,
  currency,
  productId,
  productTitle,
  customerEmail,
  customerPhone,
}: PurchaseTrackingProps) {
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

  React.useEffect(() => {
    if (!transactionId || value <= 0 || !productId) return

    const storageKey = `tiktok-purchase-tracked:${transactionId}`
    if (window.sessionStorage.getItem(storageKey)) return

    const trackedProductId = productId
    const trackedProductTitle = productTitle ?? productId
    let isCancelled = false

    async function trackPurchase() {
      await identifyTiktokCustomer({
        email: customerEmail,
        phoneNumber: customerPhone,
        externalId: transactionId,
      })

      const tracked = await trackTiktokEvent("Purchase", {
        contents: [
          createTiktokContent({
            id: trackedProductId,
            name: trackedProductTitle,
          }),
        ],
        value,
        currency,
      })

      if (!isCancelled && tracked) {
        window.sessionStorage.setItem(storageKey, "true")
      }
    }

    void trackPurchase()

    return () => {
      isCancelled = true
    }
  }, [currency, customerEmail, customerPhone, productId, productTitle, transactionId, value])

  return null
}
