"use client"

import { useRouter } from "next/navigation"

interface AdminAvailabilityFiltersProps {
  products: Array<{ id: string; title: string }>
  selectedProductId: string
  selectedDate: string
}

export function AdminAvailabilityFilters({
  products,
  selectedProductId,
  selectedDate,
}: AdminAvailabilityFiltersProps) {
  const router = useRouter()

  const updateFilters = (productId: string, date: string) => {
    router.push(`/admin?tab=availability&productId=${encodeURIComponent(productId)}&date=${encodeURIComponent(date)}`)
  }

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_220px] md:items-end">
      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Product
        </span>
        <select
          value={selectedProductId}
          onChange={(event) => updateFilters(event.target.value, selectedDate)}
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        >
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.title}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Date
        </span>
        <input
          type="date"
          value={selectedDate}
          onChange={(event) => updateFilters(selectedProductId, event.target.value)}
          className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-950 outline-none focus:border-slate-400 dark:[color-scheme:dark] dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
        />
      </label>
    </div>
  )
}
