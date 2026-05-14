import { createHash } from "crypto"

type TiktokServerEventName = "ViewContent" | "InitiateCheckout" | "Purchase"

type TiktokServerContent = {
  content_id: string
  content_type: "product" | "product_group"
  content_name: string
}

type TiktokServerEventInput = {
  event: TiktokServerEventName
  eventId: string
  contents: TiktokServerContent[]
  value: number
  currency: string
  pageUrl?: string
  userAgent?: string
  ipAddress?: string
  ttclid?: string
  customerEmail?: string
  customerPhone?: string
  externalId?: string
}

const TIKTOK_PIXEL_CODE = process.env.TIKTOK_PIXEL_CODE ?? "D82P31BC77U26NJHHR5G"
const TIKTOK_EVENTS_API_URL = "https://business-api.tiktok.com/open_api/v1.3/pixel/track/"

function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function normalizePhoneNumber(phoneNumber: string) {
  return phoneNumber.replace(/[^\d+]/g, "")
}

function getUserData(input: TiktokServerEventInput) {
  return {
    ...(input.customerEmail ? { email: sha256(normalizeEmail(input.customerEmail)) } : {}),
    ...(input.customerPhone ? { phone_number: sha256(normalizePhoneNumber(input.customerPhone)) } : {}),
    ...(input.externalId ? { external_id: sha256(input.externalId.trim()) } : {}),
    ...(input.ipAddress ? { ip: input.ipAddress } : {}),
    ...(input.userAgent ? { user_agent: input.userAgent } : {}),
  }
}

export function getRequestIpAddress(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()

  return (
    forwardedFor ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    undefined
  )
}

export async function sendTiktokServerEvent(input: TiktokServerEventInput) {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN

  if (!accessToken) return false

  const response = await fetch(TIKTOK_EVENTS_API_URL, {
    method: "POST",
    headers: {
      "Access-Token": accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pixel_code: TIKTOK_PIXEL_CODE,
      event: input.event,
      event_id: input.eventId,
      timestamp: new Date().toISOString(),
      ...(process.env.TIKTOK_TEST_EVENT_CODE ? { test_event_code: process.env.TIKTOK_TEST_EVENT_CODE } : {}),
      context: {
        ...(input.ttclid ? { ad: { callback: input.ttclid } } : {}),
        ...(input.pageUrl ? { page: { url: input.pageUrl } } : {}),
        user: getUserData(input),
      },
      properties: {
        contents: input.contents,
        value: input.value,
        currency: input.currency,
      },
    }),
  })

  return response.ok
}
