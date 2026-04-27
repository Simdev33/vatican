import Stripe from "stripe"

let stripeClient: Stripe | null = null

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured")
  }

  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY)
  }

  return stripeClient
}

function toStripeAmount(value: number) {
  return Math.round(value * 100)
}

export async function createCheckoutSession(input: {
  orderId: string
  orderNumber: string
  productTitle: string
  totalPrice: number
  customerEmail: string
  origin: string
}) {
  const amount = toStripeAmount(input.totalPrice)

  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Invalid checkout amount.")
  }

  return getStripe().checkout.sessions.create({
    mode: "payment",
    customer_email: input.customerEmail,
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: input.productTitle,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    metadata: {
      orderId: input.orderId,
      orderNumber: input.orderNumber,
    },
    success_url: `${input.origin}/thank-you?order=${encodeURIComponent(
      input.orderNumber,
    )}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${input.origin}/#tickets`,
  })
}

export async function getPaidCheckoutSession(sessionId: string) {
  const session = await getStripe().checkout.sessions.retrieve(sessionId)

  if (session.payment_status !== "paid") {
    return null
  }

  return {
    transactionId: session.metadata?.orderNumber ?? session.id,
    value: Number(((session.amount_total ?? 0) / 100).toFixed(2)),
    currency: session.currency?.toUpperCase() ?? "EUR",
  }
}
