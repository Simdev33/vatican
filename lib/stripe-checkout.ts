import Stripe from "stripe"
import { createOrder, type CreateOrderInput, type PreparedCheckoutOrder } from "@/lib/orders"
import { getTicketTypeOptions, type TicketBreakdownItem } from "@/lib/ticket-types"
import { isLocale, type Locale } from "@/lib/i18n"

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

function encodeBreakdown(productId: string, breakdown: TicketBreakdownItem[] | undefined) {
  const quantityById = new Map((breakdown ?? []).map((item) => [item.id, item.quantity]))
  const quantityByLabel = new Map((breakdown ?? []).map((item) => [item.label, item.quantity]))
  const quantities = getTicketTypeOptions(productId).map((option) => quantityById.get(option.id) ?? quantityByLabel.get(option.label) ?? 0)

  return quantities.join(",")
}

function encodeTicketBreakdowns(input: CreateOrderInput) {
  if (input.items?.length) {
    return input.items.map((item) => `${item.productId}:${encodeBreakdown(item.productId, item.ticketBreakdown)}`).join(";")
  }

  return `${input.productId}:${encodeBreakdown(input.productId, input.ticketBreakdown)}`
}

function decodeBreakdown(productId: string, encoded: string | undefined, locale: Locale) {
  const quantities = (encoded ?? "").split(",").map((value) => Math.max(0, Math.floor(Number(value) || 0)))

  return getTicketTypeOptions(productId, locale).map((option, index) => ({
    id: option.id,
    label: option.label,
    quantity: quantities[index] ?? 0,
  }))
}

function decodeTicketBreakdowns(encoded: string | undefined, locale: Locale) {
  return new Map(
    (encoded ?? "")
      .split(";")
      .filter(Boolean)
      .map((entry) => {
        const [productId, quantities] = entry.split(":")
        return [productId, decodeBreakdown(productId, quantities, locale)] as const
      }),
  )
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
      locale: input.order.orderInput.locale ?? "en",
      ticketBreakdowns: encodeTicketBreakdowns(input.order.orderInput),
      items: JSON.stringify(
        input.order.orderInput.items?.map(({ ticketBreakdown, ...item }) => item) ?? [],
      ),
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

  const locale = isLocale(metadata.locale) ? metadata.locale : "en"
  const ticketBreakdowns = decodeTicketBreakdowns(metadata.ticketBreakdowns, locale)
  const items = metadata.items ? JSON.parse(metadata.items) as CreateOrderInput["items"] : undefined

  return {
    productId: metadata.productId,
    visitDate: metadata.visitDate,
    visitTime: metadata.visitTime ?? "",
    customerName: metadata.customerName,
    customerEmail: metadata.customerEmail,
    customerPhone: metadata.customerPhone || undefined,
    locale,
    ticketBreakdown: ticketBreakdowns.get(metadata.productId),
    items: items?.map((item) => ({
      ...item,
      ticketBreakdown: ticketBreakdowns.get(item.productId),
    })),
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
