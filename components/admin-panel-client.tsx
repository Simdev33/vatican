"use client"

import { Check, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import * as React from "react"
import { logoutAdmin, setOrderItemFlag, updateProductPrice } from "@/app/admin/actions"
import { AdminAvailabilityManager } from "@/components/admin-availability-manager"
import { AdminThemeToggle } from "@/components/admin-theme-toggle"
import type { ProductAvailability } from "@/lib/availability"
import type { Product, ProductCategory } from "@/lib/products"
import type { AdminOrderLine } from "@/lib/orders"
import { getTicketTypeOptions, hasTicketTypeOptions } from "@/lib/ticket-types"

type AdminTab = "products" | "availability" | "orders" | "users"

type AvailabilityProduct = {
  id: string
  title: string
  category: ProductCategory
}

type TabData = {
  products?: Product[]
  orders?: AdminOrderLine[]
  availabilityProducts?: AvailabilityProduct[]
  selectedProductId?: string
  selectedDate?: string
  availability?: Record<string, ProductAvailability | undefined>
}

interface AdminPanelClientProps {
  initialTab: AdminTab
  initialProductId?: string
  initialDate?: string
  initialQuery?: string
}

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value)
}

function getBadgeLabel(badge: string | null) {
  if (badge === "bestseller") return "Most booked"
  if (badge === "popular") return "Popular choice"
  if (badge === "best-value") return "Best value"
  return null
}

function getTabTitle(tab: AdminTab) {
  if (tab === "availability") return "Availability"
  if (tab === "orders") return "Orders"
  if (tab === "users") return "Users"
  return "Products"
}

function getUrl(tab: AdminTab, options: { productId?: string; date?: string; q?: string } = {}) {
  const params = new URLSearchParams({ tab })

  if (tab === "availability") {
    if (options.productId) params.set("productId", options.productId)
    if (options.date) params.set("date", options.date)
  }

  if (tab === "orders" && options.q) {
    params.set("q", options.q)
  }

  return `/admin?${params.toString()}`
}

function getApiUrl(tab: AdminTab, options: { productId?: string; date?: string; q?: string } = {}) {
  return `/api/admin${getUrl(tab, options).replace("/admin", "")}`
}

export function AdminPanelClient({
  initialTab,
  initialProductId,
  initialDate,
  initialQuery = "",
}: AdminPanelClientProps) {
  const [activeTab, setActiveTab] = React.useState<AdminTab>(initialTab)
  const [dataByTab, setDataByTab] = React.useState<Partial<Record<AdminTab, TabData>>>({})
  const [loadingTab, setLoadingTab] = React.useState<AdminTab | null>(null)
  const [orderSearch, setOrderSearch] = React.useState(initialQuery)
  const searchTimeoutRef = React.useRef<number | null>(null)
  const [availabilitySelection, setAvailabilitySelection] = React.useState({
    productId: initialProductId ?? "",
    date: initialDate ?? getTodayKey(),
  })

  const loadTab = React.useCallback(
    async (
      tab: AdminTab,
      options: { productId?: string; date?: string; q?: string; force?: boolean } = {},
    ) => {
      if (!options.force && dataByTab[tab]) return

      setLoadingTab(tab)

      try {
        const response = await fetch(
          getApiUrl(tab, {
            productId: options.productId ?? availabilitySelection.productId,
            date: options.date ?? availabilitySelection.date,
            q: options.q ?? orderSearch,
          }),
          { cache: "no-store" },
        )

        if (!response.ok) {
          throw new Error("Could not load admin data.")
        }

        const payload = (await response.json()) as {
          products?: Product[]
          orders?: AdminOrderLine[]
          selectedProductId?: string
          selectedDate?: string
          availability?: Record<string, ProductAvailability | undefined>
        }

        setDataByTab((current) => ({
          ...current,
          [tab]:
            tab === "availability"
              ? {
                  availabilityProducts: payload.products as AvailabilityProduct[],
                  selectedProductId: payload.selectedProductId,
                  selectedDate: payload.selectedDate,
                  availability: payload.availability,
                }
              : payload,
        }))

        if (tab === "availability") {
          setAvailabilitySelection({
            productId: payload.selectedProductId ?? "",
            date: payload.selectedDate ?? getTodayKey(),
          })
        }
      } finally {
        setLoadingTab((current) => (current === tab ? null : current))
      }
    },
    [availabilitySelection.date, availabilitySelection.productId, dataByTab, orderSearch],
  )

  React.useEffect(() => {
    loadTab(activeTab)
  }, [activeTab, loadTab])

  React.useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search)
      const nextTab = (params.get("tab") as AdminTab | null) ?? "products"

      setActiveTab(nextTab)
      setOrderSearch(params.get("q") ?? "")
      setAvailabilitySelection({
        productId: params.get("productId") ?? "",
        date: params.get("date") ?? getTodayKey(),
      })
      loadTab(nextTab, {
        productId: params.get("productId") ?? undefined,
        date: params.get("date") ?? undefined,
        q: params.get("q") ?? undefined,
      })
    }

    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [loadTab])

  const switchTab = (tab: AdminTab) => {
    setActiveTab(tab)
    window.history.pushState(null, "", getUrl(tab, {
      productId: availabilitySelection.productId,
      date: availabilitySelection.date,
      q: orderSearch,
    }))
    void loadTab(tab)
  }

  const updateAvailabilitySelection = (productId: string, date: string) => {
    setAvailabilitySelection({ productId, date })
    setDataByTab((current) => ({ ...current, availability: undefined }))
    window.history.pushState(null, "", getUrl("availability", { productId, date }))
    void loadTab("availability", { productId, date, force: true })
  }

  const refreshCurrentTab = async () => {
    await loadTab(activeTab, { force: true })
  }

  const navItems = [
    { id: "products", label: "Products" },
    { id: "availability", label: "Availability" },
    { id: "orders", label: "Orders" },
    { id: "users", label: "Users" },
  ] satisfies Array<{ id: AdminTab; label: string }>
  const activeData = dataByTab[activeTab]
  const isLoading = loadingTab === activeTab && !activeData

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Admin panel</p>
              <h1 className="text-2xl font-semibold tracking-tight">{getTabTitle(activeTab)}</h1>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <nav className="flex rounded-lg border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-900">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => void loadTab(item.id)}
                      onClick={() => switchTab(item.id)}
                      className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-white text-slate-950 shadow-sm dark:bg-slate-800 dark:text-white"
                          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                      }`}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </nav>
              <AdminThemeToggle />
              <form action={logoutAdmin}>
                <button
                  type="submit"
                  className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  Logout
                </button>
              </form>
              <Link
                href="/"
                className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
              >
                Storefront
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        {isLoading && (
          <section className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            Loading {getTabTitle(activeTab).toLowerCase()}...
          </section>
        )}

        {activeTab === "products" && activeData?.products && (
          <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <h2 className="font-semibold">Product prices</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Edit the current selling price for each product.
              </p>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {activeData.products.map((product) => {
                const badgeLabel = getBadgeLabel(product.badge)

                return (
                  <form
                    key={product.id}
                    action={async (formData) => {
                      await updateProductPrice(formData)
                      await loadTab("products", { force: true })
                    }}
                    className="grid gap-4 px-5 py-4 md:grid-cols-[64px_1fr_220px_90px] md:items-start"
                  >
                    <input type="hidden" name="id" value={product.id} />
                    <div className="relative h-14 w-16 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                      <Image
                        src={product.images?.[0] ?? product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{product.category}</span>
                        {badgeLabel && (
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {badgeLabel}
                          </span>
                        )}
                      </div>
                      <h3 className="truncate font-medium">{product.title}</h3>
                      <p className="truncate text-sm text-slate-500 dark:text-slate-400">{product.subtitle}</p>
                    </div>
                    <div className="space-y-3">
                      <label className="block">
                        <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Base price
                        </span>
                        <div className="flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 focus-within:border-slate-400 dark:border-slate-700 dark:bg-slate-950 dark:focus-within:border-slate-500">
                          <input
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            defaultValue={product.price.toFixed(2)}
                            className="w-full bg-transparent font-medium outline-none"
                          />
                          <span className="text-xs text-slate-400">EUR</span>
                        </div>
                      </label>
                      {hasTicketTypeOptions(product.id) && (
                        <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            Ticket type prices
                          </p>
                          {getTicketTypeOptions(product.id).map((option) => (
                            <label key={option.id} className="block">
                              <span className="mb-1 block text-xs text-slate-500 dark:text-slate-400">{option.label}</span>
                              <div className="flex items-center rounded-lg border border-slate-200 bg-white px-3 py-2 focus-within:border-slate-400 dark:border-slate-700 dark:bg-slate-900">
                                <input
                                  name={`ticketTypePrice:${option.id}`}
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  defaultValue={(product.ticketTypePrices?.[option.id] ?? product.price).toFixed(2)}
                                  className="w-full bg-transparent text-sm font-medium outline-none"
                                />
                                <span className="text-xs text-slate-400">EUR</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="h-10 rounded-lg bg-slate-950 px-4 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                    >
                      Save
                    </button>
                  </form>
                )
              })}
            </div>
          </section>
        )}

        {activeTab === "orders" && activeData?.orders && (
          <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <h2 className="font-semibold">Orders</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Combo tickets are shown as separate product rows with the same customer details.
              </p>
            </div>

            <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center">
              <input
                type="search"
                value={orderSearch}
                onChange={(event) => {
                  const nextQuery = event.target.value
                  setOrderSearch(nextQuery)

                  if (searchTimeoutRef.current) {
                    window.clearTimeout(searchTimeoutRef.current)
                  }

                  searchTimeoutRef.current = window.setTimeout(() => {
                    window.history.replaceState(null, "", getUrl("orders", { q: nextQuery.trim() }))
                    void loadTab("orders", { q: nextQuery.trim(), force: true })
                  }, 120)
                }}
                placeholder="Search by name, order ID, email or phone"
                className="h-10 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 dark:border-slate-700 dark:bg-slate-950"
              />
            </div>

            {activeData.orders.length === 0 ? (
              <div className="p-8">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {orderSearch ? "No orders match your search." : "No orders yet."}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="grid min-w-[1280px] grid-cols-[1.5fr_1.35fr_180px_160px_120px_120px] border-b border-slate-200 px-5 py-3 text-xs font-medium uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <span>Product</span>
                  <span>Customer</span>
                  <span>Date / Time</span>
                  <span>Price</span>
                  <span>Sent</span>
                  <span>Wrote out</span>
                </div>
                {activeData.orders.map((order) => (
                  <article
                    key={order.orderItemId}
                    className="grid min-w-[1280px] grid-cols-[1.5fr_1.35fr_180px_160px_120px_120px] items-center gap-4 border-b border-slate-200 px-5 py-4 last:border-b-0 dark:border-slate-800"
                  >
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-medium">{order.productTitle}</h3>
                        {order.isCombo && (
                          <span className="rounded-md bg-slate-950 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white dark:bg-white dark:text-slate-950">
                            COMBO
                          </span>
                        )}
                      </div>
                      {order.isCombo && (
                        <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                          Parent: {order.selectedProductTitle}
                        </p>
                      )}
                      <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                        Order ID: {order.orderNumber}
                      </p>
                      {order.ticketBreakdown.length > 0 && (
                        <div className="mt-2 space-y-0.5 rounded-md bg-slate-50 p-2 text-xs text-slate-600 dark:bg-slate-950 dark:text-slate-300">
                          {order.ticketBreakdown.map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{order.customerEmail}</p>
                      {order.customerPhone && (
                        <p className="text-sm text-slate-500 dark:text-slate-400">{order.customerPhone}</p>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{order.visitDate}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{order.visitTime}</p>
                    </div>
                    <div>
                      <p className="font-medium">{formatCurrency(order.itemPrice)}</p>
                      {order.isCombo && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Combo total: {formatCurrency(order.totalPrice)}
                        </p>
                      )}
                      {!order.isCombo && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">{order.status}</p>
                      )}
                    </div>
                    {(["sent_out", "written_out"] as const).map((field) => {
                      const checked = field === "sent_out" ? order.sentOut : order.writtenOut

                      return (
                        <form
                          key={field}
                          action={async (formData) => {
                            await setOrderItemFlag(formData)
                            await loadTab("orders", { force: true })
                          }}
                        >
                          <input type="hidden" name="orderItemId" value={order.orderItemId} />
                          <input type="hidden" name="field" value={field} />
                          <input type="hidden" name="value" value={checked ? "false" : "true"} />
                          <button
                            type="submit"
                            aria-label={checked ? "Toggle off" : "Toggle on"}
                            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
                              checked
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                                : "border-slate-200 bg-white text-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-500"
                            }`}
                          >
                            {checked ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                          </button>
                        </form>
                      )
                    })}
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "availability" && activeData?.availabilityProducts && (
          <section className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <h2 className="font-semibold">Availability</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Close full days from the calendar or manage 30-minute slots for timed products.
              </p>
            </div>
            <div className="p-5">
              <AdminAvailabilityManager
                products={activeData.availabilityProducts}
                selectedProductId={activeData.selectedProductId ?? activeData.availabilityProducts[0]?.id ?? ""}
                selectedDate={activeData.selectedDate ?? getTodayKey()}
                availability={activeData.availability ?? {}}
                onSelectionChange={updateAvailabilitySelection}
                onDataChanged={refreshCurrentTab}
              />
            </div>
          </section>
        )}

        {activeTab === "users" && !isLoading && (
          <section className="rounded-xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="font-semibold">Users</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              User and staff management will live here.
            </p>
          </section>
        )}
      </div>
    </main>
  )
}
