import { eqFilter, supabaseRequest } from "@/lib/supabase-rest"

export type ProductCategory = "Entry Ticket" | "River Cruise" | "Combo Ticket"
export type ProductBadge = "bestseller" | "popular" | "best-value" | null

export interface Product {
  id: string
  title: string
  subtitle: string
  image: string
  images?: string[]
  duration: string
  highlights: string[]
  price: number
  originalPrice?: number
  badge: ProductBadge
  category: ProductCategory
}

interface ProductRow {
  id: string
  title: string
  subtitle: string
  image: string
  images: string[] | null
  duration: string
  highlights: string[] | null
  price: string
  original_price: string | null
  badge: ProductBadge
  category: ProductCategory
}

interface AvailabilityProductRow {
  id: string
  title: string
  category: ProductCategory
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    image: row.image,
    images: row.images && row.images.length > 0 ? row.images : undefined,
    duration: row.duration,
    highlights: row.highlights ?? [],
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    badge: row.badge,
    category: row.category,
  }
}

export async function getProducts() {
  const rows = await supabaseRequest<ProductRow[]>(
    "products?select=id,title,subtitle,image,images,duration,highlights,price,original_price,badge,category&is_active=eq.true&order=sort_order.asc,id.asc",
  )

  return rows.map(mapProduct)
}

export async function getAvailabilityProducts() {
  return supabaseRequest<AvailabilityProductRow[]>(
    "products?select=id,title,category&is_active=eq.true&category=neq.Combo%20Ticket&order=sort_order.asc,id.asc",
  )
}

export async function updateProductPricing(id: string, price: number) {
  await supabaseRequest(`products?id=${eqFilter(id)}`, {
    method: "PATCH",
    body: {
      price,
      updated_at: new Date().toISOString(),
    },
    prefer: "return=minimal",
  })
}
