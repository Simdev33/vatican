import crypto from "node:crypto"
import { cookies } from "next/headers"

const ADMIN_AUTH_COOKIE = "admin_auth"

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? ""
}

function getPasswordHash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex")
}

function safeCompare(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)

  if (left.length !== right.length) return false

  return crypto.timingSafeEqual(left, right)
}

export async function isAdminAuthenticated() {
  const password = getAdminPassword()

  if (!password) return false

  const cookieStore = await cookies()
  const token = cookieStore.get(ADMIN_AUTH_COOKIE)?.value

  if (!token) return false

  return safeCompare(token, getPasswordHash(password))
}

export function verifyAdminPassword(input: string) {
  const password = getAdminPassword()

  if (!password) return false

  return safeCompare(input, password)
}

export async function setAdminSession() {
  const password = getAdminPassword()

  if (!password) return

  const cookieStore = await cookies()
  cookieStore.set(ADMIN_AUTH_COOKIE, getPasswordHash(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(ADMIN_AUTH_COOKIE)
}
