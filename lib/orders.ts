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

interface ProductRow {
  id: string
  title: string
  price: string
  category: string
}

interface OrderLineRow {
  order_id: string
  order_number: number
  order_item_id: string
  product_id: string
  product_title: string
  ticket_breakdown: TicketBreakdownRow[] | null
  parent_product_id: string
  selected_product_id: string
  selected_product_title: string
  item_visit_date: string | null
  item_visit_time: string | null
  visit_date: string
  visit_time: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  total_price: string
  item_price: string
  currency: string
  status: string
  created_at: string
  sent_out: boolean
  written_out: boolean
}

interface RestOrderLineRow {
  id: string
  product_id: string
  product_title: string
  parent_product_id: string
  visit_date: string | null
  visit_time: string | null
  item_price: string
  sent_out: boolean
  written_out: boolean
  sort_order: number
  orders: {
    id: string
    order_number: number
    selected_product_id: string
    selected_product_title: string
    visit_date: string
    visit_time: string
    customer_name: string
    customer_email: string
    customer_phone: string | null
    total_price: string
    currency: string
    status: string
    created_at: string
  }
}

interface RestOrderRow {
  id: string
  order_number: number
  selected_product_id: string
  selected_product_title: string
  visit_date: string
  visit_time: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  total_price: string
  currency: string
  status: string
  created_at: string
}

interface RestOrderItemRow {
  id: string
  order_id: string
  product_id: string
  product_title: string
  parent_product_id: string
  visit_date: string | null
  visit_time: string | null
  item_price: string
  sent_out: boolean
  written_out: boolean
  sort_order: number
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

function formatTicketBreakdownLines(breakdown: ReturnType<typeof normalizeTicketBreakdown>) {
  return breakdown.map((item) => `${item.label}: ${item.quantity}`)
}

function parseProductTitleWithTicketBreakdown(title: string) {
  const [cleanTitle, details] = title.split(TICKET_BREAKDOWN_TITLE_SEPARATOR)

  return {
    title: cleanTitle,
    ticketBreakdown: details ? details.split("\n").filter(Boolean) : [],
  }
}

function allocateItemPrices(totalPrice: number, components: ProductRow[]) {
  if (components.length === 0) return []
  if (components.length === 1) return [Number(totalPrice.toFixed(2))]

  const componentTotal = components.reduce((sum, component) => sum + Number(component.price), 0)

  if (componentTotal <= 0) {
    const evenPrice = Math.floor((totalPrice / components.length) * 100) / 100
    const prices = components.map(() => evenPrice)
    prices[prices.length - 1] = Number((totalPrice - prices.slice(0, -1).reduce((sum, price) => sum + price, 0)).toFixed(2))
    return prices
  }

  const prices = components.map((component) =>
    Math.floor(((Number(component.price) / componentTotal) * totalPrice) * 100) / 100,
  )
  prices[prices.length - 1] = Number((totalPrice - prices.slice(0, -1).reduce((sum, price) => sum + price, 0)).toFixed(2))

  return prices
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
    `products?select=id,title,price,category&id=${eqFilter(productId)}&is_active=eq.true&limit=1`,
  )
  const product = productRows[0]

  if (!product) {
    throw new Error("Selected product does not exist.")
  }

  const componentRows = await supabaseRequest<ProductRow[]>(
    `products?select=id,title,price,category&id=in.(${componentIds.join(",")})&is_active=eq.true`,
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

  if (!options.skipAvailabilityCheck) {
    await assertScheduleIsAvailable(schedule)
  }

  return {
    product,
    componentIds,
    componentsById,
    schedule,
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
    },
  }
}

export async function prepareCheckoutOrder(input: CreateOrderInput): Promise<PreparedCheckoutOrder> {
  const prepared = await prepareOrder(input)

  return {
    productTitle: prepared.product.title,
    totalPrice: Number(prepared.product.price),
    customerEmail: prepared.orderInput.customerEmail,
    orderInput: prepared.orderInput,
  }
}

export async function createOrder(input: CreateOrderInput) {
  let orderId: string | null = null

  try {
    const prepared = await prepareOrder(input, { skipAvailabilityCheck: true })
    const { product, componentIds, componentsById, schedule, orderInput } = prepared

    const orderVisitTime = orderInput.visitTime || "10:00"
    const [order] = await supabaseRequest<Array<{ id: string; order_number: number }>>("orders?select=id,order_number", {
      method: "POST",
      body: {
        selected_product_id: product.id,
        selected_product_title: product.title,
        visit_date: orderInput.visitDate,
        visit_time: orderVisitTime,
        customer_name: orderInput.customerName,
        customer_email: orderInput.customerEmail,
        customer_phone: orderInput.customerPhone ?? null,
        total_price: product.price,
        locale: orderInput.locale ?? "en",
      },
      prefer: "return=representation",
    })

    orderId = order.id
    const orderNumber = order.order_number

    const orderedComponents = componentIds
      .map((componentId) => componentsById.get(componentId))
      .filter((component): component is ProductRow => Boolean(component))
    const itemPrices = allocateItemPrices(Number(product.price), orderedComponents)

    await supabaseRequest("order_items", {
      method: "POST",
      body: orderedComponents.map((component, index) => ({
        order_id: orderId,
        product_id: component.id,
        product_title: component.title,
        ticket_breakdown: schedule.find((item) => item.productId === component.id)?.ticketBreakdown ?? [],
        parent_product_id: product.id,
        sort_order: index,
        item_price: itemPrices[index],
        visit_date: schedule.find((item) => item.productId === component.id)?.visitDate ?? orderInput.visitDate,
        visit_time: schedule.find((item) => item.productId === component.id)?.visitTime || null,
      })),
      prefer: "return=minimal",
    })

    return {
      orderId,
      orderNumber: formatOrderNumber(orderNumber),
      productTitle: product.title,
      totalPrice: Number(product.price),
      currency: "EUR",
      customerEmail: orderInput.customerEmail,
    }
  } catch (error) {
    if (orderId) {
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
      "orders?select=id,order_number,selected_product_id,selected_product_title,visit_date,visit_time,customer_name,customer_email,customer_phone,total_price,currency,status,created_at",
      ...orderFilters,
      "order=created_at.desc",
      "limit=80",
    ].join("&"),
  )

  if (orders.length === 0) {
    return []
  }

  const ordersById = new Map(orders.map((order) => [order.id, order]))
  const orderIdFilter = orders.map((order) => order.id).join(",")
  const rows = await supabaseRequest<RestOrderItemRow[]>(
    `order_items?select=id,order_id,product_id,product_title,ticket_breakdown,parent_product_id,visit_date,visit_time,item_price,sent_out,written_out,sort_order&order_id=in.(${orderIdFilter})&order=sort_order.asc`,
  )

  return rows
    .map((item) => ({ item, order: ordersById.get(item.order_id) }))
    .filter((entry): entry is { item: RestOrderItemRow; order: RestOrderRow } => Boolean(entry.order))
    .filter((order) => {
      if (!trimmedSearch) return true

      const textSearch = trimmedSearch.toLowerCase()
      const normalizedPhone = order.order.customer_phone?.replace(/\D/g, "") ?? ""

      return (
        formatOrderNumber(order.order.order_number).includes(textSearch) ||
        order.order.customer_name.toLowerCase().includes(textSearch) ||
        order.order.customer_email.toLowerCase().includes(textSearch) ||
        (order.order.customer_phone ?? "").toLowerCase().includes(textSearch) ||
        (phoneSearch && Array.from(phoneVariants).some((variant) => normalizedPhone.includes(variant)))
      )
    })
    .sort((left, right) => {
      const createdAtDiff = Date.parse(right.order.created_at) - Date.parse(left.order.created_at)
      return createdAtDiff || left.item.sort_order - right.item.sort_order
    })
    .slice(0, 100)
    .map<AdminOrderLine>(({ item, order }) => {
      const parsedProductTitle = parseProductTitleWithTicketBreakdown(item.product_title)
      const ticketBreakdown = item.ticket_breakdown
        ? formatTicketBreakdownLines(item.ticket_breakdown)
        : parsedProductTitle.ticketBreakdown

      return {
        orderId: order.id,
        orderNumber: formatOrderNumber(order.order_number),
        orderItemId: item.id,
        productId: item.product_id,
        productTitle: parsedProductTitle.title,
        selectedProductTitle: order.selected_product_title,
        isCombo: item.parent_product_id !== item.product_id || order.selected_product_id !== item.product_id,
        visitDate: (item.visit_date ?? order.visit_date).slice(0, 10),
        visitTime: item.visit_time ?? order.visit_time,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        totalPrice: Number(order.total_price),
        itemPrice: Number(item.item_price),
        currency: order.currency,
        status: order.status,
        createdAt: order.created_at,
        sentOut: item.sent_out,
        writtenOut: item.written_out,
        ticketBreakdown,
      }
    })
}

export async function updateOrderItemFlag(
  orderItemId: string,
  field: "sent_out" | "written_out",
  value: boolean,
) {
  await supabaseRequest(`order_items?id=${eqFilter(orderItemId)}`, {
    method: "PATCH",
    body: { [field]: value },
    prefer: "return=minimal",
  })
}
