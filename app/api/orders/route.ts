import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { createOrder } from "@/lib/orders"
import { createCheckoutSession } from "@/lib/stripe-checkout"

export const runtime = "nodejs"
export const preferredRegion = "fra1"

interface OrderRequestBody {
  productId?: string
  visitDate?: string
  visitTime?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  items?: Array<{
    productId?: string
    visitDate?: string
    visitTime?: string
  }>
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderRequestBody
    const firstScheduledItem = body.items?.[0]
    const order = await createOrder({
      productId: body.productId ?? "",
      visitDate: body.visitDate ?? firstScheduledItem?.visitDate ?? "",
      visitTime: body.visitTime ?? firstScheduledItem?.visitTime ?? "",
      customerName: body.customerName ?? "",
      customerEmail: body.customerEmail ?? "",
      customerPhone: body.customerPhone,
      items: body.items?.map((item) => ({
        productId: item.productId ?? "",
        visitDate: item.visitDate ?? "",
        visitTime: item.visitTime ?? "",
      })),
    })
    const origin = request.headers.get("origin") ?? new URL(request.url).origin
    const session = await createCheckoutSession({
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      productTitle: order.productTitle,
      totalPrice: order.totalPrice,
      customerEmail: order.customerEmail,
      origin,
    })

    revalidatePath("/admin")

    return NextResponse.json({
      ok: true,
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      checkoutUrl: session.url,
    })
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Could not create order.",
      },
      { status: 400 },
    )
  }
}
