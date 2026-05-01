import { NextResponse } from "next/server"
import { prepareCheckoutOrder } from "@/lib/orders"
import { createCheckoutSession } from "@/lib/stripe-checkout"
import { isLocale } from "@/lib/i18n"

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
    })

    return NextResponse.json(
      {
        ok: true,
        checkoutUrl: session.url,
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
