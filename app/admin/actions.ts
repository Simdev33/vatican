"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  closeProductDay,
  closeProductSlot,
  openProductDay,
  openProductSlot,
} from "@/lib/availability"
import { updateOrderItemFlag } from "@/lib/orders"
import { updateProductPricing } from "@/lib/products"
import {
  clearAdminSession,
  isAdminAuthenticated,
  setAdminSession,
  verifyAdminPassword,
} from "@/lib/admin-auth"

async function requireAdmin() {
  const authenticated = await isAdminAuthenticated()

  if (!authenticated) {
    throw new Error("Unauthorized")
  }
}

export async function loginAdmin(formData: FormData) {
  const input = parseRequiredString(formData.get("password"), "Password")

  if (!verifyAdminPassword(input)) {
    redirect("/admin?authError=1")
  }

  await setAdminSession()
  redirect("/admin")
}

export async function logoutAdmin() {
  await clearAdminSession()
  redirect("/admin")
}

function parsePrice(value: FormDataEntryValue | null, fieldName: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${fieldName} is required`)
  }

  const price = Number(value.replace(",", "."))

  if (!Number.isFinite(price) || price < 0) {
    throw new Error(`${fieldName} must be a valid positive number`)
  }

  return price
}

export async function updateProductPrice(formData: FormData) {
  await requireAdmin()
  const id = formData.get("id")

  if (typeof id !== "string" || !id) {
    throw new Error("Missing product id")
  }

  await updateProductPricing(id, parsePrice(formData.get("price"), "Price"))

  revalidatePath("/")
  revalidatePath("/admin")
}

function parseRequiredString(value: FormDataEntryValue | null, fieldName: string) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${fieldName} is required`)
  }

  return value
}

export async function setProductDayAvailability(formData: FormData) {
  await requireAdmin()
  const productId = parseRequiredString(formData.get("productId"), "Product")
  const date = parseRequiredString(formData.get("date"), "Date")
  const intent = parseRequiredString(formData.get("intent"), "Intent")

  if (intent === "close") {
    await closeProductDay(productId, date)
  } else {
    await openProductDay(productId, date)
  }

  revalidatePath("/")
  revalidatePath("/admin")
}

export async function setProductSlotAvailability(formData: FormData) {
  await requireAdmin()
  const productId = parseRequiredString(formData.get("productId"), "Product")
  const date = parseRequiredString(formData.get("date"), "Date")
  const time = parseRequiredString(formData.get("time"), "Time")
  const intent = parseRequiredString(formData.get("intent"), "Intent")

  if (intent === "close") {
    await closeProductSlot(productId, date, time)
  } else {
    await openProductSlot(productId, date, time)
  }

  revalidatePath("/")
  revalidatePath("/admin")
}

export async function setOrderItemFlag(formData: FormData) {
  await requireAdmin()
  const orderItemId = parseRequiredString(formData.get("orderItemId"), "Order item")
  const field = parseRequiredString(formData.get("field"), "Field")
  const value = formData.get("value") === "true"

  if (field !== "sent_out" && field !== "written_out") {
    throw new Error("Invalid order item field")
  }

  await updateOrderItemFlag(orderItemId, field, value)
  revalidatePath("/admin")
}
