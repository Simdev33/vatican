export type TiktokContent = {
  content_id: string
  content_type: "product" | "product_group"
  content_name: string
}

export type TiktokEventPayload = {
  contents: TiktokContent[]
  value: number
  currency: string
  event_id?: string
  search_string?: string
}

type TiktokEventName =
  | "ViewContent"
  | "AddToWishlist"
  | "Search"
  | "AddPaymentInfo"
  | "AddToCart"
  | "InitiateCheckout"
  | "PlaceAnOrder"
  | "CompleteRegistration"
  | "Purchase"

type TiktokIdentity = {
  email?: string
  phone_number?: string
  external_id?: string
}

type TiktokAnalytics = {
  track: (eventName: TiktokEventName, payload: TiktokEventPayload) => void
  identify: (identity: TiktokIdentity) => void
}

declare global {
  interface Window {
    ttq?: TiktokAnalytics
  }
}

function waitForTiktok(maxAttempts = 40) {
  return new Promise<TiktokAnalytics | null>((resolve) => {
    if (typeof window === "undefined") {
      resolve(null)
      return
    }

    let attempts = 0

    const check = () => {
      if (window.ttq?.track) {
        resolve(window.ttq)
        return
      }

      attempts += 1

      if (attempts >= maxAttempts) {
        resolve(null)
        return
      }

      window.setTimeout(check, 250)
    }

    check()
  })
}

async function sha256(value: string) {
  if (!window.crypto?.subtle) return null

  const encoded = new TextEncoder().encode(value)
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", encoded)

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function normalizePhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/[^\d+]/g, "")
}

export function hasTiktokMarketingConsent() {
  if (typeof window === "undefined") return false

  try {
    const storedConsent = window.localStorage.getItem("paristourpass-cookie-consent-v1")

    if (!storedConsent) return false

    return JSON.parse(storedConsent)?.marketing === true
  } catch {
    return false
  }
}

export function readStoredTiktokClickId() {
  if (typeof window === "undefined") return undefined

  const url = new URL(window.location.href)
  const ttclid = url.searchParams.get("ttclid")

  if (ttclid) {
    window.localStorage.setItem("tiktok-ttclid", ttclid)
    return ttclid
  }

  return window.localStorage.getItem("tiktok-ttclid") ?? undefined
}

export function createTiktokContent(input: {
  id: string
  name: string
  type?: "product" | "product_group"
}) {
  return {
    content_id: input.id,
    content_type: input.type ?? "product",
    content_name: input.name,
  } satisfies TiktokContent
}

export async function identifyTiktokCustomer(input: {
  email?: string
  phoneNumber?: string
  externalId?: string
}) {
  const ttq = await waitForTiktok()

  if (!ttq) return false

  const [email, phoneNumber, externalId] = await Promise.all([
    input.email ? sha256(normalizeEmail(input.email)) : Promise.resolve(null),
    input.phoneNumber ? sha256(normalizePhoneNumber(input.phoneNumber)) : Promise.resolve(null),
    input.externalId ? sha256(input.externalId.trim()) : Promise.resolve(null),
  ])
  const identity: TiktokIdentity = {
    ...(email ? { email } : {}),
    ...(phoneNumber ? { phone_number: phoneNumber } : {}),
    ...(externalId ? { external_id: externalId } : {}),
  }

  if (Object.keys(identity).length === 0) return false

  ttq.identify(identity)
  return true
}

export async function trackTiktokEvent(eventName: TiktokEventName, payload: TiktokEventPayload) {
  const ttq = await waitForTiktok()

  if (!ttq) return false

  ttq.track(eventName, payload)
  return true
}
