import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import { completePaidCheckoutSession, constructStripeWebhookEvent } from "@/lib/stripe-checkout"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 })
  }

  try {
    const event = await constructStripeWebhookEvent(await request.text(), signature)

    if (event.type === "checkout.session.completed") {
      const session = event.data.object

      if (session.payment_status === "paid") {
        await completePaidCheckoutSession(session.id)
        revalidatePath("/admin")
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid Stripe webhook" },
      { status: 400 },
    )
  }
}
