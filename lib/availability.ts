import { eqFilter, supabaseRequest } from "@/lib/supabase-rest"

export interface ProductAvailability {
  closedDays: string[]
  closedSlots: Record<string, string[]>
}

export type AvailabilityByProduct = Record<string, ProductAvailability>

interface ClosedDayRow {
  product_id: string
  date: string
}

interface ClosedSlotRow {
  product_id: string
  date: string
  time: string
}

function createEmptyAvailability(): ProductAvailability {
  return {
    closedDays: [],
    closedSlots: {},
  }
}

function normalizeDate(value: string | Date) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }

  return value.slice(0, 10)
}

export async function getAvailabilityByProduct(productIds: string[]) {
  const availability = productIds.reduce<AvailabilityByProduct>((acc, productId) => {
    acc[productId] = createEmptyAvailability()
    return acc
  }, {})

  if (productIds.length === 0) {
    return availability
  }

  const productIdFilter = productIds.map(encodeURIComponent).join(",")
  const [closedDays, closedSlots] = await Promise.all([
    supabaseRequest<ClosedDayRow[]>(
      `product_closed_days?select=product_id,date&product_id=in.(${productIdFilter})&order=date.asc`,
    ),
    supabaseRequest<ClosedSlotRow[]>(
      `product_closed_slots?select=product_id,date,time&product_id=in.(${productIdFilter})&order=date.asc,time.asc`,
    ),
  ])

  for (const row of closedDays) {
    availability[row.product_id] ??= createEmptyAvailability()
    availability[row.product_id].closedDays.push(normalizeDate(row.date))
  }

  for (const row of closedSlots) {
    availability[row.product_id] ??= createEmptyAvailability()
    const date = normalizeDate(row.date)
    availability[row.product_id].closedSlots[date] ??= []
    availability[row.product_id].closedSlots[date].push(row.time)
  }

  return availability
}

export async function closeProductDay(productId: string, date: string) {
  await supabaseRequest("product_closed_days?on_conflict=product_id,date", {
    method: "POST",
    body: { product_id: productId, date },
    prefer: "resolution=ignore-duplicates,return=minimal",
  })
}

export async function openProductDay(productId: string, date: string) {
  await supabaseRequest(`product_closed_days?product_id=${eqFilter(productId)}&date=${eqFilter(date)}`, {
    method: "DELETE",
    prefer: "return=minimal",
  })
}

export async function closeProductSlot(productId: string, date: string, time: string) {
  await supabaseRequest("product_closed_slots?on_conflict=product_id,date,time", {
    method: "POST",
    body: { product_id: productId, date, time },
    prefer: "resolution=ignore-duplicates,return=minimal",
  })
}

export async function openProductSlot(productId: string, date: string, time: string) {
  await supabaseRequest(
    `product_closed_slots?product_id=${eqFilter(productId)}&date=${eqFilter(date)}&time=${eqFilter(time)}`,
    {
      method: "DELETE",
      prefer: "return=minimal",
    },
  )
}
