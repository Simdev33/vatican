import { NextResponse } from "next/server"
import { getAvailabilityByProduct } from "@/lib/availability"
import { getAdminOrders } from "@/lib/orders"
import { getAvailabilityProducts, getProducts } from "@/lib/products"

export const runtime = "nodejs"
export const preferredRegion = "fra1"

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tab = searchParams.get("tab") ?? "products"

  if (tab === "orders") {
    const orders = await getAdminOrders(searchParams.get("q") ?? "")
    return NextResponse.json({ orders })
  }

  if (tab === "availability") {
    const products = await getAvailabilityProducts()
    const selectedProductId = searchParams.get("productId") ?? products[0]?.id ?? ""
    const selectedDate = searchParams.get("date") ?? getTodayKey()
    const availability = selectedProductId ? await getAvailabilityByProduct([selectedProductId]) : {}

    return NextResponse.json({
      products,
      selectedProductId,
      selectedDate,
      availability,
    })
  }

  if (tab === "users") {
    return NextResponse.json({})
  }

  const products = await getProducts()
  return NextResponse.json({ products })
}
