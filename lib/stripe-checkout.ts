import Stripe from "stripe"
import { createOrder, type CreateOrderInput, type PreparedCheckoutOrder } from "@/lib/orders"

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
  order: PreparedCheckoutOrder
  origin: string
}) {
  const amount = toStripeAmount(input.order.totalPrice)

  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Invalid checkout amount.")
  }

  return getStripe().checkout.sessions.create({
    mode: "payment",
    customer_email: input.order.customerEmail,
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: input.order.productTitle,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    metadata: {
      productId: input.order.orderInput.productId,
      visitDate: input.order.orderInput.visitDate,
      visitTime: input.order.orderInput.visitTime,
      customerName: input.order.orderInput.customerName,
      customerEmail: input.order.orderInput.customerEmail,
      customerPhone: input.order.orderInput.customerPhone ?? "",
      items: JSON.stringify(input.order.orderInput.items ?? []),
    },
    success_url: `${input.origin}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${input.origin}/#tickets`,
  })
}

function getOrderInputFromSession(session: Stripe.Checkout.Session): CreateOrderInput {
  const metadata = session.metadata

  if (!metadata?.productId || !metadata.visitDate || !metadata.customerName || !metadata.customerEmail) {
    throw new Error("Stripe session is missing order details.")
  }

  return {
    productId: metadata.productId,
    visitDate: metadata.visitDate,
    visitTime: metadata.visitTime ?? "",
    customerName: metadata.customerName,
    customerEmail: metadata.customerEmail,
    customerPhone: metadata.customerPhone || undefined,
    items: metadata.items ? JSON.parse(metadata.items) : undefined,
  }
}

export async function completePaidCheckoutSession(sessionId: string) {
  const session = await getStripe().checkout.sessions.retrieve(sessionId)

  if (session.payment_status !== "paid") {
    return null
  }

  if (session.metadata?.orderNumber) {
    return {
      orderNumber: session.metadata.orderNumber,
      transactionId: session.metadata.orderNumber,
      value: Number(((session.amount_total ?? 0) / 100).toFixed(2)),
      currency: session.currency?.toUpperCase() ?? "EUR",
    }
  }

  const orderInput = getOrderInputFromSession(session)
  const order = await createOrder(orderInput)
  await getStripe().checkout.sessions.update(session.id, {
    metadata: {
      ...session.metadata,
      orderId: order.orderId,
      orderNumber: order.orderNumber,
    },
  })

  return {
    orderNumber: order.orderNumber,
    transactionId: order.orderNumber,
    value: Number(((session.amount_total ?? 0) / 100).toFixed(2)),
    currency: session.currency?.toUpperCase() ?? "EUR",
  }
}

export async function constructStripeWebhookEvent(payload: string, signature: string) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured")
  }

  return getStripe().webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET)
}
