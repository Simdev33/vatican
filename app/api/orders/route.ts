import { NextResponse } from "next/server"
import { prepareCheckoutOrder } from "@/lib/orders"
import { createCheckoutSession } from "@/lib/stripe-checkout"
import { isLocale } from "@/lib/i18n"
import { getRequestIpAddress, sendTiktokServerEvent } from "@/lib/tiktok-server-events"

export const runtime = "nodejs"
export const preferredRegion = "fra1"

interface OrderRequestBody {
  productId?: string
  visitDate?: string
  visitTime?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  locale?: string
  marketingConsent?: boolean
  pageUrl?: string
  ttclid?: string
  ticketBreakdown?: Array<{
    id?: string
    label?: string
    quantity?: number
  }>
  items?: Array<{
    productId?: string
    visitDate?: string
    visitTime?: string
    ticketBreakdown?: Array<{
      id?: string
      label?: string
      quantity?: number
    }>
  }>
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderRequestBody
    const firstScheduledItem = body.items?.[0]
    const order = await prepareCheckoutOrder({
      productId: body.productId ?? "",
      visitDate: body.visitDate ?? firstScheduledItem?.visitDate ?? "",
      visitTime: body.visitTime ?? firstScheduledItem?.visitTime ?? "",
      customerName: body.customerName ?? "",
      customerEmail: body.customerEmail ?? "",
      customerPhone: body.customerPhone,
      locale: isLocale(body.locale) ? body.locale : "en",
      ticketBreakdown: body.ticketBreakdown?.map((item) => ({
        id: item.id ?? "",
        label: item.label ?? "",
        quantity: item.quantity ?? 0,
      })),
      items: body.items?.map((item) => ({
        productId: item.productId ?? "",
        visitDate: item.visitDate ?? "",
        visitTime: item.visitTime ?? "",
        ticketBreakdown: item.ticketBreakdown?.map((breakdownItem) => ({
          id: breakdownItem.id ?? "",
          label: breakdownItem.label ?? "",
          quantity: breakdownItem.quantity ?? 0,
        })),
      })),
    })
    const origin = request.headers.get("origin") ?? new URL(request.url).origin
    const session = await createCheckoutSession({
      order,
      origin,
      tracking: {
        marketingConsent: body.marketingConsent === true,
        pageUrl: body.pageUrl,
        ttclid: body.ttclid,
        ipAddress: getRequestIpAddress(request),
        userAgent: request.headers.get("user-agent") ?? undefined,
      },
    })

    if (body.marketingConsent === true) {
      await sendTiktokServerEvent({
        event: "InitiateCheckout",
        eventId: `checkout:${session.id}`,
        contents: [
          {
            content_id: order.orderInput.productId,
            content_type: "product",
            content_name: order.productTitle,
          },
        ],
        value: order.totalPrice,
        currency: "EUR",
        pageUrl: body.pageUrl,
        ttclid: body.ttclid,
        customerEmail: order.orderInput.customerEmail,
        customerPhone: order.orderInput.customerPhone,
        externalId: order.orderInput.customerEmail,
        ipAddress: getRequestIpAddress(request),
        userAgent: request.headers.get("user-agent") ?? undefined,
      }).catch(() => false)
    }

    return NextResponse.json(
      {
        ok: true,
        checkoutUrl: session.url,
        checkoutSessionId: session.id,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Could not create order.",
      },
      {
        status: 400,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    )
  }
}
