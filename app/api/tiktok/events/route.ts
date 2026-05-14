import { NextResponse } from "next/server"
import { getRequestIpAddress, sendTiktokServerEvent } from "@/lib/tiktok-server-events"

export const runtime = "nodejs"

type TiktokEventRequestBody = {
  event?: "ViewContent"
  eventId?: string
  contents?: Array<{
    content_id?: string
    content_type?: "product" | "product_group"
    content_name?: string
  }>
  value?: number
  currency?: string
  marketingConsent?: boolean
  pageUrl?: string
  ttclid?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as TiktokEventRequestBody

    if (body.marketingConsent !== true || body.event !== "ViewContent" || !body.eventId) {
      return NextResponse.json({ ok: true, skipped: true })
    }

    const contents = (body.contents ?? [])
      .map((item) => ({
        content_id: item.content_id ?? "",
        content_type: item.content_type ?? "product",
        content_name: item.content_name ?? "",
      }))
      .filter((item) => item.content_id && item.content_name)

    if (contents.length === 0) {
      return NextResponse.json({ ok: true, skipped: true })
    }

    await sendTiktokServerEvent({
      event: "ViewContent",
      eventId: body.eventId,
      contents,
      value: Number(body.value ?? 0),
      currency: body.currency ?? "EUR",
      pageUrl: body.pageUrl,
      ttclid: body.ttclid,
      ipAddress: getRequestIpAddress(request),
      userAgent: request.headers.get("user-agent") ?? undefined,
    }).catch(() => false)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
