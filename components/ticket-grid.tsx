"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Clock, Check, ArrowRight } from "lucide-react"
import { DateSelector } from "@/components/date-selector"
import { useLanguage } from "@/components/language-provider"
import type { AvailabilityByProduct } from "@/lib/availability"
import { getProductComponentIds } from "@/lib/product-components"

const EIFFEL_IMAGE =
  "https://res.cloudinary.com/dldgqjxkn/image/upload/v1777135801/champ-de-mars-eiffel_gjkjuk.jpg"
const LOUVRE_IMAGE =
  "https://res.cloudinary.com/dldgqjxkn/image/upload/v1777135805/m77_wpwvio.jpg"
const BOAT_IMAGE =
  "https://res.cloudinary.com/dldgqjxkn/image/upload/v1777135809/057fb71b-33d6-4f81-9a3f-3ff11356b443-13088-paris-1hr-seine-river-cruise-guided-tour-04_1_sd0fg1.jpg"

export interface Ticket {
  id: string
  title: string
  subtitle: string
  image: string
  images?: string[]
  duration: string
  highlights: string[]
  price: number
  originalPrice?: number
  badge: "bestseller" | "popular" | "best-value" | null
  category: "Entry Ticket" | "River Cruise" | "Combo Ticket"
}

const tickets: Ticket[] = [
  {
    id: "louvre",
    title: "Louvre Museum",
    subtitle: "Timed Entry Ticket",
    image: LOUVRE_IMAGE,
    duration: "2-3 hours",
    highlights: [
      "Louvre Museum entry",
      "Access to permanent collections",
      "See the Mona Lisa",
      "Flexible visit experience",
    ],
    price: 35.00,
    badge: "bestseller",
    category: "Entry Ticket",
  },
  {
    id: "eiffel",
    title: "Eiffel Tower",
    subtitle: "Tower Access Ticket",
    image: EIFFEL_IMAGE,
    duration: "2 hours",
    highlights: [
      "Eiffel Tower access",
      "Panoramic Paris views",
      "Timed entry slot",
      "Perfect for first-time visitors",
    ],
    price: 49.00,
    badge: "popular",
    category: "Entry Ticket",
  },
  {
    id: "boat",
    title: "Seine River Cruise",
    subtitle: "Sightseeing Boat Ticket",
    image: BOAT_IMAGE,
    duration: "1 hour",
    highlights: [
      "Seine sightseeing cruise",
      "Views of Paris landmarks",
      "Flexible boarding",
      "Audio commentary available",
    ],
    price: 18.00,
    badge: null,
    category: "River Cruise",
  },
  {
    id: "louvre-boat-eiffel",
    title: "Louvre + Seine Cruise + Eiffel Tower",
    subtitle: "Best Value Combo Ticket",
    image: "/images/louvre-eiffel-cruise.webp",
    images: [LOUVRE_IMAGE, BOAT_IMAGE, EIFFEL_IMAGE],
    duration: "Full day",
    highlights: [
      "Louvre Museum entry",
      "Seine River Cruise",
      "Eiffel Tower access",
      "Save with one combo ticket",
    ],
    price: 89.00,
    originalPrice: 102.00,
    badge: "best-value",
    category: "Combo Ticket",
  },
  {
    id: "louvre-eiffel",
    title: "Louvre + Eiffel Tower",
    subtitle: "Combo Ticket",
    image: "/images/louvre-cruise.webp",
    images: [LOUVRE_IMAGE, EIFFEL_IMAGE],
    duration: "Half day",
    highlights: [
      "Louvre Museum entry",
      "Eiffel Tower access",
      "Timed entry slots",
      "Two Paris icons in one ticket",
    ],
    price: 74.00,
    badge: null,
    category: "Combo Ticket",
  },
  {
    id: "eiffel-boat",
    title: "Eiffel Tower + Seine Cruise",
    subtitle: "Combo Ticket",
    image: "/images/eiffel-cruise.webp",
    images: [EIFFEL_IMAGE, BOAT_IMAGE],
    duration: "3 hours",
    highlights: [
      "Eiffel Tower access",
      "Seine River Cruise",
      "Landmark views from water",
      "Great evening option",
    ],
    price: 59.00,
    originalPrice: 67.00,
    badge: null,
    category: "Combo Ticket",
  },
]

function mergeAvailability(items: Array<AvailabilityByProduct[string] | undefined>) {
  const closedDays = new Set<string>()
  const closedSlots: Record<string, string[]> = {}

  for (const item of items) {
    if (!item) continue

    for (const date of item.closedDays) {
      closedDays.add(date)
    }

    for (const [date, slots] of Object.entries(item.closedSlots)) {
      closedSlots[date] ??= []
      closedSlots[date].push(...slots)
    }
  }

  return {
    closedDays: Array.from(closedDays),
    closedSlots: Object.fromEntries(
      Object.entries(closedSlots).map(([date, slots]) => [date, Array.from(new Set(slots))]),
    ),
  }
}

function getImageStyle(image: string) {
  return image === BOAT_IMAGE ? { objectPosition: "35% center" } : undefined
}

function TicketCard({
  ticket,
  displayTicket,
  selectedDate,
  isSelected,
  onSelect,
}: {
  ticket: Ticket
  displayTicket: Ticket
  selectedDate: Date | undefined
  isSelected: boolean
  onSelect: () => void
}) {
  const { locale, t } = useLanguage()
  const formattedPrice = ticket.price.toFixed(2).replace(".", ",")
  const formattedOriginalPrice = ticket.originalPrice?.toFixed(2).replace(".", ",")
  const isComboTicket = ticket.category === "Combo Ticket"
  const badgeLabel = ticket.badge ? t.tickets.badges[ticket.badge] : null

  return (
    <div
      id={`ticket-${ticket.id}`}
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onSelect()
        }
      }}
      className={`group overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:shadow-lg ${
        isSelected ? "border-[#1a365d] ring-2 ring-[#d4a853]/40" : "border-gray-100"
      }`}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-auto sm:h-auto sm:w-48 md:w-56">
          {isComboTicket && ticket.images ? (
            <div
              className={`absolute inset-0 grid scale-[1.08] gap-0.5 transition-transform duration-150 ease-out group-hover:scale-[1.12] ${
                ticket.images.length === 3 ? "grid-cols-2 grid-rows-2" : "grid-rows-2"
              }`}
            >
              {ticket.images.map((image, index) => (
                <div
                  key={image}
                  className={`relative overflow-hidden ${ticket.images?.length === 3 && index === 0 ? "row-span-2" : ""}`}
                >
                  <Image
                    src={image}
                    alt={`${displayTicket.title} image ${index + 1}`}
                    fill
                    className="object-cover"
                    style={getImageStyle(image)}
                    sizes="(max-width: 640px) 100vw, 224px"
                  />
                </div>
              ))}
            </div>
          ) : (
            <Image
              src={ticket.image}
              alt={displayTicket.title}
              fill
              className="object-cover transition-transform duration-150 ease-out group-hover:scale-[1.06]"
              style={getImageStyle(ticket.image)}
              sizes="(max-width: 640px) 100vw, 224px"
            />
          )}
          {badgeLabel && (
            <span className={`absolute left-3 top-3 rounded-full border border-white/30 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm backdrop-blur-sm ${
              ticket.badge === "bestseller"
                ? "bg-emerald-900/80"
                : ticket.badge === "best-value"
                  ? "bg-[#1a365d]/85"
                  : "bg-[#8a641c]/85"
            }`}>
              {badgeLabel}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4 md:p-5">
          <div className="flex-1">
              <div className="mb-1 flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold text-[#1a365d] group-hover:text-[#2d4a7c]">
                  {displayTicket.title}
                </h3>
                {isSelected && (
                  <span className="rounded-full bg-[#1a365d] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    {t.tickets.selected}
                  </span>
                )}
              </div>
            <p className="mb-3 text-sm text-gray-500">{displayTicket.subtitle}</p>

            {/* Meta Info */}
            <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {displayTicket.duration}
              </span>
              <span>{displayTicket.category}</span>
            </div>

            {/* Highlights */}
            <ul className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
              {displayTicket.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-1.5 text-xs text-gray-600">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            {selectedDate && (
              <p className="mt-3 text-xs text-[#d4a853]">
                {t.tickets.availableOn} {selectedDate.toLocaleDateString(locale, { month: "short", day: "numeric" })}
              </p>
            )}
          </div>

          {/* Price & CTA */}
          <div className="mt-4 flex flex-col gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs text-gray-500">{t.tickets.from}</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#1a365d]">{formattedPrice}&euro;</span>
                {formattedOriginalPrice && (
                  <span className="text-sm text-gray-400 line-through">{formattedOriginalPrice}&euro;</span>
                )}
              </div>
              <span className="text-xs text-gray-400">{t.tickets.perPerson}</span>
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onSelect()
              }}
              className={`flex w-full items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all sm:w-auto ${
                isSelected
                  ? "bg-[#1a365d] text-white hover:bg-[#264d81]"
                  : "bg-[#d4a853] text-[#1a365d] hover:bg-[#e5b964] hover:shadow-md"
              }`}
            >
              {isSelected ? t.tickets.selected : t.tickets.selectTicket}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TicketGrid({
  initialTickets = tickets,
  availability = {},
}: {
  initialTickets?: Ticket[]
  availability?: AvailabilityByProduct
}) {
  const { t } = useLanguage()
  const availableTickets = initialTickets.length > 0 ? initialTickets : tickets
  const translatedTickets = availableTickets.map((ticket) => ({
    ...ticket,
    ...(t.products[ticket.id] ?? {}),
  }))
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTicketId, setSelectedTicketId] = useState<string>(availableTickets[0]?.id ?? "")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const selectedTicket = availableTickets.find((ticket) => ticket.id === selectedTicketId) ?? null
  const selectedComponentIds = selectedTicket ? getProductComponentIds(selectedTicket.id) : []
  const selectedComponents = selectedComponentIds
    .map((productId) => translatedTickets.find((ticket) => ticket.id === productId))
    .filter((ticket): ticket is Ticket => Boolean(ticket))
    .map((ticket) => ({ id: ticket.id, title: ticket.title, category: ticket.category }))
  const selectedAvailability = selectedTicket
    ? mergeAvailability(selectedComponentIds.map((productId) => availability[productId]))
    : undefined
  const dateSelectorRef = useRef<HTMLDivElement | null>(null)
  const highlightTimeoutRef = useRef<number | null>(null)
  const [highlightDateSelector, setHighlightDateSelector] = useState(false)

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicketId(ticketId)
    setSelectedTime("")

    if (typeof window !== "undefined" && dateSelectorRef.current) {
      const yPosition = dateSelectorRef.current.getBoundingClientRect().top + window.scrollY - 96
      window.scrollTo({ top: Math.max(yPosition, 0), behavior: "smooth" })
      setHighlightDateSelector(true)

      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current)
      }

      highlightTimeoutRef.current = window.setTimeout(() => {
        setHighlightDateSelector(false)
      }, 1200)
    }
  }

  return (
    <section id="tickets" className="scroll-mt-20 bg-gray-50 py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8 text-center lg:mb-10">
          <h2 className="mb-2 text-2xl font-bold text-[#1a365d] sm:text-3xl lg:text-4xl">
            {t.tickets.heading}
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-gray-500 md:text-base">
            {t.tickets.subheading}
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid gap-6 lg:grid-cols-[340px_1fr] lg:gap-8">
          {/* Left Column: Date Selector */}
          <div
            ref={dateSelectorRef}
            className={`order-2 rounded-xl transition-all duration-300 lg:order-1 ${
              highlightDateSelector ? "ring-4 ring-[#d4a853] ring-offset-4 ring-offset-gray-50" : "ring-0"
            }`}
          >
            <div>
              <DateSelector
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                selectedTicket={
                  selectedTicket
                    ? {
                        id: selectedTicket.id,
                        title: t.products[selectedTicket.id]?.title ?? selectedTicket.title,
                        price: selectedTicket.price,
                        category: selectedTicket.category,
                      }
                    : null
                }
                selectedComponents={selectedComponents}
                selectedTime={selectedTime}
                onTimeSelect={setSelectedTime}
                availability={selectedAvailability}
                availabilityByProduct={availability}
              />

              {/* Trust badges */}
              <div className="mt-6 rounded-xl border border-gray-100 bg-white p-4">
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                  {t.tickets.trustTitle}
                </h4>
                <ul className="space-y-2.5">
                  {t.tickets.trustItems.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Tickets */}
          <div className="order-1 lg:order-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {availableTickets.length} {t.tickets.available}
              </h3>
            </div>

            {/* Ticket Cards */}
            <div className="flex flex-col gap-4">
              {availableTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  displayTicket={translatedTickets.find((item) => item.id === ticket.id) ?? ticket}
                  selectedDate={selectedDate}
                  isSelected={ticket.id === selectedTicketId}
                  onSelect={() => handleTicketSelect(ticket.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
