"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { CalendarDays, ChevronLeft, ChevronRight, Clock } from "lucide-react"
import {
  setProductDayAvailability,
  setProductSlotAvailability,
} from "@/app/admin/actions"
import type { ProductAvailability } from "@/lib/availability"
import type { ProductCategory } from "@/lib/products"
import { getTimeSlotsForProduct } from "@/lib/time-slots"
import { cn } from "@/lib/utils"

type AvailabilityProduct = {
  id: string
  title: string
  category: ProductCategory
}

interface AdminAvailabilityManagerProps {
  products: AvailabilityProduct[]
  selectedProductId: string
  selectedDate: string
  availability: Record<string, ProductAvailability | undefined>
  onSelectionChange?: (productId: string, date: string) => void
  onDataChanged?: () => Promise<void> | void
}

function formatDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function getCalendarCells(month: Date) {
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const firstDay = new Date(year, monthIndex, 1).getDay()
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const previousMonthDays = new Date(year, monthIndex, 0).getDate()
  const cells: Array<{ date: Date; currentMonth: boolean }> = []

  for (let index = adjustedFirstDay - 1; index >= 0; index--) {
    cells.push({
      date: new Date(year, monthIndex - 1, previousMonthDays - index),
      currentMonth: false,
    })
  }

  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: new Date(year, monthIndex, day), currentMonth: true })
  }

  while (cells.length < 42) {
    const nextDay = cells.length - adjustedFirstDay - daysInMonth + 1
    cells.push({ date: new Date(year, monthIndex + 1, nextDay), currentMonth: false })
  }

  return cells
}

export function AdminAvailabilityManager({
  products,
  selectedProductId,
  selectedDate,
  availability,
  onSelectionChange,
  onDataChanged,
}: AdminAvailabilityManagerProps) {
  const router = useRouter()
  const selectedProduct = products.find((product) => product.id === selectedProductId) ?? products[0]
  const [month, setMonth] = React.useState(() => parseDateKey(selectedDate))
  const [pendingKey, setPendingKey] = React.useState<string | null>(null)
  const dayClickTimeoutRef = React.useRef<number | null>(null)
  const selectedAvailability = availability[selectedProduct?.id ?? ""]
  const selectedProductTimeSlots = selectedProduct ? getTimeSlotsForProduct(selectedProduct.id) : []
  const selectedClosedDays = React.useMemo(
    () => new Set(selectedAvailability?.closedDays ?? []),
    [selectedAvailability?.closedDays],
  )
  const selectedClosedSlots = React.useMemo(
    () => new Set(selectedAvailability?.closedSlots[selectedDate] ?? []),
    [selectedAvailability?.closedSlots, selectedDate],
  )
  const isCruise = selectedProduct?.category === "River Cruise"
  const isSelectedDayClosed = selectedClosedDays.has(selectedDate)
  const monthLabel = month.toLocaleString("en-US", { month: "long", year: "numeric" })
  const selectedDateLabel = parseDateKey(selectedDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  React.useEffect(() => {
    setMonth(parseDateKey(selectedDate))
  }, [selectedDate])

  React.useEffect(() => {
    return () => {
      if (dayClickTimeoutRef.current) {
        window.clearTimeout(dayClickTimeoutRef.current)
      }
    }
  }, [])

  const updateUrl = (productId: string, date: string) => {
    if (onSelectionChange) {
      onSelectionChange(productId, date)
      return
    }

    router.push(`/admin?tab=availability&productId=${encodeURIComponent(productId)}&date=${encodeURIComponent(date)}`)
  }

  const submitDayChange = async (productId: string, date: string, intent: "close" | "open") => {
    const pendingId = `day-${productId}-${date}`
    const formData = new FormData()

    formData.set("productId", productId)
    formData.set("date", date)
    formData.set("intent", intent)
    setPendingKey(pendingId)

    try {
      await setProductDayAvailability(formData)
      if (onDataChanged) {
        await onDataChanged()
      } else {
        router.refresh()
      }
    } finally {
      setPendingKey(null)
    }
  }

  const handleDayClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    productId: string,
    date: string,
    intent: "close" | "open",
  ) => {
    if (dayClickTimeoutRef.current) {
      window.clearTimeout(dayClickTimeoutRef.current)
      dayClickTimeoutRef.current = null
    }

    if (event.detail >= 2) {
      void submitDayChange(productId, date, intent)
      return
    }

    dayClickTimeoutRef.current = window.setTimeout(() => {
      updateUrl(productId, date)
      dayClickTimeoutRef.current = null
    }, 250)
  }

  const submitSlotChange = async (slot: string, intent: "close" | "open") => {
    if (!selectedProduct) return

    const pendingId = `slot-${slot}`
    const formData = new FormData()

    formData.set("productId", selectedProduct.id)
    formData.set("date", selectedDate)
    formData.set("time", slot)
    formData.set("intent", intent)
    setPendingKey(pendingId)

    try {
      await setProductSlotAvailability(formData)
      if (onDataChanged) {
        await onDataChanged()
      } else {
        router.refresh()
      }
    } finally {
      setPendingKey(null)
    }
  }

  if (!selectedProduct) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        No products available.
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {products.map((product) => {
            const selected = product.id === selectedProduct.id

            return (
              <button
                key={product.id}
                type="button"
                onClick={() => updateUrl(product.id, selectedDate)}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition",
                  selected
                    ? "border-slate-950 bg-slate-950 text-white shadow-sm dark:border-white dark:bg-white dark:text-slate-950"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900",
                )}
              >
                <CalendarDays className="h-4 w-4" />
                {product.title}
              </button>
            )
          })}
        </div>

        <div className="rounded-lg bg-[#d4a853]/15 px-4 py-2 text-sm font-semibold text-[#8a641c] dark:text-[#f3d28a]">
          Changes save automatically
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex gap-3">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {isCruise ? "Opening Hours" : "Timed Entry"}
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              {isCruise
                ? "Seine day pass - guests book a date only; boarding is flexible between 10:00-22:00. Use the calendar to close full days only."
                : "Guests choose a date and a 30-minute time slot. Double-click a calendar day to close or reopen the full day."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_1fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h3 className="text-sm font-semibold text-slate-950 dark:text-slate-100">{monthLabel}</h3>
            <button
              type="button"
              onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Next month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mb-3 grid grid-cols-7 gap-2 text-center text-[11px] font-semibold text-slate-500">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {getCalendarCells(month).map(({ date, currentMonth }) => {
              const dateKey = formatDateKey(date)
              const selected = dateKey === selectedDate
              const closed = selectedClosedDays.has(dateKey)
              const pending = pendingKey === `day-${selectedProduct.id}-${dateKey}`

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={(event) => handleDayClick(event, selectedProduct.id, dateKey, closed ? "open" : "close")}
                  disabled={pending}
                  title="Double-click to close/open full day"
                  className={cn(
                    "relative flex h-11 items-center justify-center rounded-xl border text-sm font-semibold transition",
                    currentMonth ? "text-slate-800 dark:text-slate-100" : "text-slate-300 dark:text-slate-700",
                    selected
                      ? "border-slate-950 bg-[#d4a853] text-slate-950 shadow-sm dark:border-white"
                      : "border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-800 dark:hover:bg-slate-950",
                    closed && "border-red-200 bg-red-50 text-red-600 line-through decoration-2 dark:border-red-950 dark:bg-red-950/30 dark:text-red-300",
                    pending && "cursor-wait opacity-60",
                  )}
                >
                  {date.getDate()}
                  {closed && <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-red-500" />}
                </button>
              )
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
              Full day closed
            </span>
            <span className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#d4a853]" />
              Selected
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Double-click a date to close/open the full day.
          </p>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5">
            <h3 className="font-semibold text-slate-950 dark:text-slate-100">
              {isCruise ? `Day Pass - ${selectedDateLabel}` : `Time Slots - ${selectedDateLabel}`}
            </h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {isSelectedDayClosed
                ? "This full day is closed."
                : isCruise
                  ? "No hourly slots are needed for this product."
                  : "Click a slot to close or reopen it."}
            </p>
          </div>

          {isCruise ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-8 text-center dark:border-slate-800">
              <Clock className="h-10 w-10 text-[#d4a853]" />
              <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
                Day pass - 10:00-22:00
              </p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
                Customers only choose a date for Seine Cruise. Double-click the calendar to block or reopen full days.
              </p>
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {selectedProductTimeSlots.map((slot) => {
                const closed = selectedClosedSlots.has(slot)
                const pending = pendingKey === `slot-${slot}`

                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => submitSlotChange(slot, closed ? "open" : "close")}
                    disabled={isSelectedDayClosed || pending}
                    className={cn(
                      "flex h-12 items-center justify-between rounded-lg border px-3 text-left text-sm font-semibold transition",
                      closed
                        ? "border-red-200 bg-red-50 text-red-700 line-through decoration-2 dark:border-red-950 dark:bg-red-950/30 dark:text-red-300"
                        : "border-slate-200 bg-white text-slate-800 hover:border-[#d4a853] hover:bg-[#d4a853]/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100",
                      isSelectedDayClosed && "cursor-not-allowed opacity-40",
                      pending && "cursor-wait opacity-60",
                    )}
                  >
                    <span>{slot}</span>
                    <span className={cn("text-xs", closed ? "text-red-600" : "text-emerald-600")}>
                      {closed ? "Closed" : "Open"}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
