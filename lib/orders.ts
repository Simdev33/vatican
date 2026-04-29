import { getProductComponentIds } from "@/lib/product-components"
import { eqFilter, supabaseRequest } from "@/lib/supabase-rest"
import { isPastBookingDate, isPastBookingSlot } from "@/lib/booking-time"
import type { Locale } from "@/lib/i18n"

export interface CreateOrderInput {
  productId: string
  visitDate: string
  visitTime: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  locale?: Locale
  ticketBreakdown?: Array<{
    id?: string
    label: string
    quantity: number
  }>
  items?: Array<{
    productId: string
    visitDate: string
    visitTime: string
    ticketBreakdown?: Array<{
      id?: string
      label: string
      quantity: number
    }>
  }>
  stripeCheckoutSessionId?: string
}

export interface PreparedCheckoutOrder {
  productTitle: string
  totalPrice: number
  customerEmail: string
  orderInput: CreateOrderInput
}

export interface AdminOrderLine {
  orderId: string
  orderNumber: string
  orderItemId: string
  productId: string
  productTitle: string
  selectedProductTitle: string
  isCombo: boolean
  visitDate: string
  visitTime: string
  customerName: string
  customerEmail: string
  customerPhone: string | null
  totalPrice: number
  itemPrice: number
  currency: string
  status: string
  createdAt: string
  sentOut: boolean
  writtenOut: boolean
  ticketBreakdown: string[]
}

type OrderItemSnapshot = {
  productId: string
  productTitle: string
  parentProductId: string
  visitDate: string
  visitTime: string | null
  ticketBreakdown: TicketBreakdownRow[]
}

type OrderRowInsert = {
  selected_product_id: string
  selected_product_title: string
  parent_product_id: string
  parent_product_title: string
  visit_date: string
  visit_time: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  total_price: number
  order_total_price: number
  locale: Locale
  ticket_breakdown: TicketBreakdownRow[]
  product_summary: string
  sent_out: boolean
  written_out: boolean
  stripe_checkout_session_id?: string
} & OrderTicketCounts

type OrderTicketCounts = {
  adult_count: number
  child_count: number
  infant_count: number
}

interface ProductRow {
  id: string
  title: string
  price: string
  ticket_type_prices: Record<string, number> | null
  category: string
}

interface RestOrderRow {
  id: string
  order_number: number
  selected_product_id: string
  selected_product_title: string
  parent_product_id?: string | null
  parent_product_title?: string | null
  ticket_breakdown?: TicketBreakdownRow[] | null
  visit_date: string
  visit_time: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  total_price: string
  order_total_price?: string | null
  currency: string
  status: string
  created_at: string
  sent_out?: boolean
  written_out?: boolean
}

function normalize(value: string) {
  return value.trim()
}

function formatOrderNumber(orderNumber: number) {
  return String(orderNumber).padStart(5, "0")
}

const TICKET_BREAKDOWN_TITLE_SEPARATOR = "\nTicket types:\n"
type TicketBreakdownRow = NonNullable<CreateOrderInput["ticketBreakdown"]>[number]

function normalizeTicketBreakdown(
  breakdown: CreateOrderInput["ticketBreakdown"],
) {
  return (breakdown ?? [])
    .map((item) => ({
      id: item.id ? normalize(item.id) : undefined,
      label: normalize(item.label),
      quantity: Math.max(0, Math.floor(Number(item.quantity) || 0)),
    }))
    .filter((item) => item.label)
}

function formatTicketBreakdownLines(breakdown: TicketBreakdownRow[]) {
  return breakdown.map((item) => `${item.label}: ${item.quantity}`)
}

function getTicketTypePrice(product: ProductRow, typeId: string | undefined) {
  if (typeId && typeof product.ticket_type_prices?.[typeId] === "number") {
    return Number(product.ticket_type_prices[typeId])
  }

  return Number(product.price)
}

function priceTicketBreakdown(product: ProductRow, breakdown: ReturnType<typeof normalizeTicketBreakdown>) {
  return breakdown.map((item) => {
    const unitPrice = getTicketTypePrice(product, item.id)

    return {
      ...item,
      unitPrice,
      totalPrice: Number((unitPrice * item.quantity).toFixed(2)),
    }
  })
}

function getPricedTicketBreakdownTotal(breakdown: ReturnType<typeof priceTicketBreakdown>) {
  return breakdown.reduce((sum, ticketType) => sum + ticketType.totalPrice, 0)
}

function parseProductTitleWithTicketBreakdown(title: string) {
  const [cleanTitle, details] = title.split(TICKET_BREAKDOWN_TITLE_SEPARATOR)

  return {
    title: cleanTitle,
    ticketBreakdown: details ? details.split("\n").filter(Boolean) : [],
  }
}

function emptyOrderTicketCounts(): OrderTicketCounts {
  return {
    adult_count: 0,
    child_count: 0,
    infant_count: 0,
  }
}

function addTicketCounts(counts: OrderTicketCounts, breakdown: TicketBreakdownRow[]) {
  for (const ticketType of breakdown) {
    const quantity = ticketType.quantity

    if (ticketType.id === "adult") {
      counts.adult_count += quantity
    }

    if (ticketType.id === "child") {
      counts.child_count += quantity
    }

    if (ticketType.id === "infant") {
      counts.infant_count += quantity
    }
  }

  return counts
}

function formatProductSummary(item: OrderItemSnapshot) {
  const counts = item.ticketBreakdown
    .filter((ticketType) => ticketType.quantity > 0)
    .map((ticketType) => `${ticketType.quantity} ${ticketType.label}`)
    .join(", ")

  return counts ? `${item.productTitle}: ${counts}` : item.productTitle
}

function isMissingOrderLineColumnError(error: unknown) {
  return error instanceof Error && error.message.includes("column orders.") && error.message.includes("does not exist")
}

async function assertProductIsAvailable(productIds: string[], visitDate: string, visitTime: string) {
  if (visitTime ? isPastBookingSlot(visitDate, visitTime) : isPastBookingDate(visitDate)) {
    throw new Error("The selected time is no longer available.")
  }

  const productIdList = productIds.join(",")
  const closedDays = await supabaseRequest<Array<{ product_id: string }>>(
    `product_closed_days?select=product_id&product_id=in.(${productIdList})&date=${eqFilter(visitDate)}&limit=1`,
  )

  if (closedDays.length > 0) {
    throw new Error("The selected date is no longer available.")
  }

  if (!visitTime) return

  const closedSlots = await supabaseRequest<Array<{ product_id: string }>>(
    `product_closed_slots?select=product_id&product_id=in.(${productIdList})&date=${eqFilter(
      visitDate,
    )}&time=${eqFilter(visitTime)}&limit=1`,
  )

  if (closedSlots.length > 0) {
    throw new Error("The selected time is no longer available.")
  }
}

async function assertScheduleIsAvailable(
  schedule: Array<{ productId: string; visitDate: string; visitTime: string }>,
) {
  for (const item of schedule) {
    await assertProductIsAvailable([item.productId], item.visitDate, item.visitTime)
  }
}

async function prepareOrder(input: CreateOrderInput, options: { skipAvailabilityCheck?: boolean } = {}) {
  const productId = normalize(input.productId)
  const visitDate = normalize(input.visitDate)
  const visitTime = normalize(input.visitTime)
  const customerName = normalize(input.customerName)
  const customerEmail = normalize(input.customerEmail).toLowerCase()
  const customerPhone = input.customerPhone ? normalize(input.customerPhone) : null
  const locale = input.locale ?? "en"
  const componentIds = getProductComponentIds(productId)
  const schedule = input.items?.length
    ? input.items.map((item) => ({
        productId: normalize(item.productId),
        visitDate: normalize(item.visitDate),
        visitTime: normalize(item.visitTime),
        ticketBreakdown: normalizeTicketBreakdown(item.ticketBreakdown),
      }))
    : componentIds.map((componentId) => ({
        productId: componentId,
        visitDate,
        visitTime,
        ticketBreakdown: normalizeTicketBreakdown(input.ticketBreakdown),
      }))

  if (!productId || !visitDate || !customerName || !customerEmail) {
    throw new Error("Missing required order fields.")
  }

  const productRows = await supabaseRequest<ProductRow[]>(
    `products?select=id,title,price,ticket_type_prices,category&id=${eqFilter(productId)}&is_active=eq.true&limit=1`,
  )
  const product = productRows[0]

  if (!product) {
    throw new Error("Selected product does not exist.")
  }

  const componentRows = await supabaseRequest<ProductRow[]>(
    `products?select=id,title,price,ticket_type_prices,category&id=in.(${componentIds.join(",")})&is_active=eq.true`,
  )
  const componentsById = new Map(componentRows.map((row) => [row.id, row]))
  const requiresTime = (component: ProductRow | undefined) => component?.category !== "River Cruise"

  if (
    schedule.length !== componentIds.length ||
    schedule.some((item) => {
      const component = componentsById.get(item.productId)
      return !componentIds.includes(item.productId) || !item.visitDate || (requiresTime(component) && !item.visitTime)
    })
  ) {
    throw new Error("Missing required combo schedule fields.")
  }

  if (schedule.some((item) => item.ticketBreakdown.reduce((sum, ticketType) => sum + ticketType.quantity, 0) <= 0)) {
    throw new Error("Missing required ticket type quantities.")
  }

  if (!options.skipAvailabilityCheck) {
    await assertScheduleIsAvailable(schedule)
  }

  const pricedSchedule = schedule.map((item) => {
    const component = componentsById.get(item.productId)

    return {
      ...item,
      ticketBreakdown: component ? priceTicketBreakdown(component, item.ticketBreakdown) : [],
    }
  })
  const totalPrice = Number(
    (product.category === "Combo Ticket"
      ? Number(product.price)
      : pricedSchedule.reduce(
          (sum, item) => sum + getPricedTicketBreakdownTotal(item.ticketBreakdown),
          0,
        )
    ).toFixed(2),
  )

  if (totalPrice <= 0) {
    throw new Error("Invalid ticket type pricing.")
  }

  return {
    product,
    componentIds,
    componentsById,
    schedule: pricedSchedule,
    totalPrice,
    orderInput: {
      productId,
      visitDate,
      visitTime,
      customerName,
      customerEmail,
      customerPhone: customerPhone ?? undefined,
      locale,
      ticketBreakdown: normalizeTicketBreakdown(input.ticketBreakdown),
      items: schedule,
      stripeCheckoutSessionId: input.stripeCheckoutSessionId,
    },
  }
}

export async function prepareCheckoutOrder(input: CreateOrderInput): Promise<PreparedCheckoutOrder> {
  const prepared = await prepareOrder(input)

  return {
    productTitle: prepared.product.title,
    totalPrice: prepared.totalPrice,
    customerEmail: prepared.orderInput.customerEmail,
    orderInput: prepared.orderInput,
  }
}

export async function createOrder(input: CreateOrderInput) {
  const createdOrderIds: string[] = []

  try {
    const prepared = await prepareOrder(input, { skipAvailabilityCheck: true })
    const { product, componentIds, componentsById, schedule, orderInput, totalPrice } = prepared

    const orderVisitTime = orderInput.visitTime || "10:00"
    const orderedComponents = componentIds
      .map((componentId) => componentsById.get(componentId))
      .filter((component): component is ProductRow => Boolean(component))
    const orderItemSnapshots: OrderItemSnapshot[] = orderedComponents.map((component) => {
      const scheduleItem = schedule.find((item) => item.productId === component.id)
      const orderInputItem = orderInput.items?.find((item) => item.productId === component.id)

      return {
        productId: component.id,
        productTitle: component.title,
        parentProductId: product.id,
        visitDate: scheduleItem?.visitDate ?? orderInput.visitDate,
        visitTime: scheduleItem?.visitTime || null,
        ticketBreakdown: orderInputItem?.ticketBreakdown ?? [],
      }
    })
    const orderRows: OrderRowInsert[] = orderItemSnapshots.map((item) => ({
      selected_product_id: item.productId,
      selected_product_title: item.productTitle,
      parent_product_id: product.id,
      parent_product_title: product.title,
      visit_date: item.visitDate,
      visit_time: item.visitTime ?? orderVisitTime,
      customer_name: orderInput.customerName,
      customer_email: orderInput.customerEmail,
      customer_phone: orderInput.customerPhone ?? null,
      total_price: totalPrice,
      order_total_price: totalPrice,
      locale: orderInput.locale ?? "en",
      ticket_breakdown: item.ticketBreakdown,
      product_summary: formatProductSummary(item),
      sent_out: false,
      written_out: false,
      ...(orderInput.stripeCheckoutSessionId ? { stripe_checkout_session_id: orderInput.stripeCheckoutSessionId } : {}),
      ...addTicketCounts(emptyOrderTicketCounts(), item.ticketBreakdown),
    }))
    const insertedOrders = await supabaseRequest<Array<{ id: string; order_number: number }>>(
      "orders?select=id,order_number",
      {
        method: "POST",
        body: orderRows,
        prefer: "return=representation",
      },
    ).catch(async (error) => {
      if (!isMissingOrderLineColumnError(error)) {
        throw error
      }

      return supabaseRequest<Array<{ id: string; order_number: number }>>("orders?select=id,order_number", {
        method: "POST",
        body: {
          selected_product_id: product.id,
          selected_product_title: product.title,
          visit_date: orderInput.visitDate,
          visit_time: orderVisitTime,
          customer_name: orderInput.customerName,
          customer_email: orderInput.customerEmail,
          customer_phone: orderInput.customerPhone ?? null,
          total_price: totalPrice,
          locale: orderInput.locale ?? "en",
        },
        prefer: "return=representation",
      })
    })
    createdOrderIds.push(...insertedOrders.map((order) => order.id))
    const firstOrder = insertedOrders[0]

    if (!firstOrder) {
      throw new Error("Could not create order.")
    }

    return {
      orderId: firstOrder.id,
      orderNumber: formatOrderNumber(firstOrder.order_number),
      productTitle: product.title,
      totalPrice,
      currency: "EUR",
      customerEmail: orderInput.customerEmail,
    }
  } catch (error) {
    for (const orderId of createdOrderIds) {
      await supabaseRequest(`orders?id=${eqFilter(orderId)}`, {
        method: "DELETE",
        prefer: "return=minimal",
      }).catch(() => undefined)
    }

    throw error
  }
}

export async function getAdminOrders(searchQuery = "") {
  const trimmedSearch = searchQuery.trim()
  const phoneSearch = trimmedSearch.replace(/\D/g, "")
  const phoneVariants = new Set([phoneSearch])

  if (phoneSearch.startsWith("06")) {
    phoneVariants.add(`36${phoneSearch.slice(2)}`)
  }

  if (phoneSearch.startsWith("36")) {
    phoneVariants.add(`06${phoneSearch.slice(2)}`)
  }

  const orderFilters: string[] = []

  if (trimmedSearch) {
    const escapedSearch = trimmedSearch.replace(/[,*()]/g, " ")
    const searchParts = [
      `customer_name.ilike.*${encodeURIComponent(escapedSearch)}*`,
      `customer_email.ilike.*${encodeURIComponent(escapedSearch)}*`,
      `customer_phone.ilike.*${encodeURIComponent(escapedSearch)}*`,
    ]
    const orderNumber = Number(phoneSearch)

    if (Number.isInteger(orderNumber) && orderNumber > 0) {
      searchParts.push(`order_number.eq.${orderNumber}`)
    }

    for (const variant of phoneVariants) {
      if (variant) {
        searchParts.push(`customer_phone.ilike.*${encodeURIComponent(variant)}*`)
      }
    }

    orderFilters.push(`or=(${searchParts.join(",")})`)
  }

  const orders = await supabaseRequest<RestOrderRow[]>(
    [
      "orders?select=id,order_number,selected_product_id,selected_product_title,parent_product_id,parent_product_title,ticket_breakdown,visit_date,visit_time,customer_name,customer_email,customer_phone,total_price,order_total_price,currency,status,created_at,sent_out,written_out",
      ...orderFilters,
      "order=created_at.desc",
      "limit=80",
    ].join("&"),
  ).catch((error) => {
    if (!isMissingOrderLineColumnError(error)) {
      throw error
    }

    return supabaseRequest<RestOrderRow[]>(
      [
        "orders?select=id,order_number,selected_product_id,selected_product_title,visit_date,visit_time,customer_name,customer_email,customer_phone,total_price,currency,status,created_at",
        ...orderFilters,
        "order=created_at.desc",
        "limit=80",
      ].join("&"),
    )
  })

  return orders
    .filter((order) => {
      if (!trimmedSearch) return true

      const textSearch = trimmedSearch.toLowerCase()
      const normalizedPhone = order.customer_phone?.replace(/\D/g, "") ?? ""

      return (
        formatOrderNumber(order.order_number).includes(textSearch) ||
        order.customer_name.toLowerCase().includes(textSearch) ||
        order.customer_email.toLowerCase().includes(textSearch) ||
        (order.customer_phone ?? "").toLowerCase().includes(textSearch) ||
        order.selected_product_title.toLowerCase().includes(textSearch) ||
        (phoneSearch && Array.from(phoneVariants).some((variant) => normalizedPhone.includes(variant)))
      )
    })
    .sort((left, right) => {
      const createdAtDiff = Date.parse(right.created_at) - Date.parse(left.created_at)
      return createdAtDiff || left.order_number - right.order_number
    })
    .slice(0, 100)
    .map<AdminOrderLine>((order) => {
      const parsedProductTitle = parseProductTitleWithTicketBreakdown(order.selected_product_title)
      const ticketBreakdown = order.ticket_breakdown
        ? formatTicketBreakdownLines(order.ticket_breakdown)
        : parsedProductTitle.ticketBreakdown

      return {
        orderId: order.id,
        orderNumber: formatOrderNumber(order.order_number),
        orderItemId: order.id,
        productId: order.selected_product_id,
        productTitle: parsedProductTitle.title,
        selectedProductTitle: order.parent_product_title ?? order.selected_product_title,
        isCombo: Boolean(order.parent_product_id && order.parent_product_id !== order.selected_product_id),
        visitDate: order.visit_date.slice(0, 10),
        visitTime: order.visit_time,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        totalPrice: Number(order.order_total_price ?? order.total_price),
        itemPrice: Number(order.total_price),
        currency: order.currency,
        status: order.status,
        createdAt: order.created_at,
        sentOut: order.sent_out ?? false,
        writtenOut: order.written_out ?? false,
        ticketBreakdown,
      }
    })
}

export async function updateOrderItemFlag(
  orderItemId: string,
  field: "sent_out" | "written_out",
  value: boolean,
) {
  await supabaseRequest(`orders?id=${eqFilter(orderItemId)}`, {
    method: "PATCH",
    body: { [field]: value },
    prefer: "return=minimal",
  }).catch((error) => {
    if (!isMissingOrderLineColumnError(error)) {
      throw error
    }
  })
}
