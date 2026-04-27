const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE"
  body?: unknown
  prefer?: string
}

function getConfig() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Supabase REST configuration is missing")
  }

  return { url: SUPABASE_URL, key: SUPABASE_KEY }
}

export async function supabaseRequest<T>(path: string, options: RequestOptions = {}) {
  const { url, key } = getConfig()
  const response = await fetch(`${url}/rest/v1/${path}`, {
    method: options.method ?? "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(options.prefer ? { Prefer: options.prefer } : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    cache: "no-store",
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(`Supabase REST request failed (${response.status}): ${message}`)
  }

  const text = await response.text()

  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}

export function eqFilter(value: string) {
  return `eq.${encodeURIComponent(value)}`
}
