"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"

export function AdminOrderSearch({ initialQuery }: { initialQuery: string }) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const trimmedQuery = query.trim()
      const nextUrl = trimmedQuery
        ? `/admin?tab=orders&q=${encodeURIComponent(trimmedQuery)}`
        : "/admin?tab=orders"

      startTransition(() => {
        router.replace(nextUrl, { scroll: false })
      })
    }, 180)

    return () => window.clearTimeout(timeout)
  }, [query, router])

  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center">
      <label className="sr-only" htmlFor="order-search">
        Search orders
      </label>
      <input
        id="order-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950"
      />
      {isPending && (
        <span className="text-sm text-slate-500 dark:text-slate-400">Searching...</span>
      )}
      {query && (
        <Link
          href="/admin?tab=orders"
          onClick={() => setQuery("")}
          className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Clear
        </Link>
      )}
    </div>
  )
}
