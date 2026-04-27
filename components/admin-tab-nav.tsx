"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

type AdminTab = "products" | "availability" | "orders" | "users"

interface AdminTabNavProps {
  activeTab: AdminTab
  items: Array<{ id: AdminTab; label: string; href: string }>
}

export function AdminTabNav({ activeTab, items }: AdminTabNavProps) {
  const router = useRouter()
  const [optimisticTab, setOptimisticTab] = React.useState(activeTab)

  React.useEffect(() => {
    setOptimisticTab(activeTab)
  }, [activeTab])

  React.useEffect(() => {
    for (const item of items) {
      router.prefetch(item.href)
    }
  }, [items, router])

  return (
    <nav className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
      {items.map((item) => {
        const isActive = optimisticTab === item.id

        return (
          <Link
            key={item.id}
            href={item.href}
            prefetch
            onMouseEnter={() => router.prefetch(item.href)}
            onClick={() => setOptimisticTab(item.id)}
            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
