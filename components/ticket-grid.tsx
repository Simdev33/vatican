"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { Clock, Check, ArrowRight, Users, Headphones } from "lucide-react"
import { DateSelector } from "@/components/date-selector"

interface Ticket {
  id: string
  title: string
  subtitle: string
  image: string
  duration: string
  groupSize?: string
  highlights: string[]
  price: number
  originalPrice?: number
  badge: "bestseller" | "popular" | null
  type: "audio" | "guided"
}

const tickets: Ticket[] = [
  {
    id: "standard",
    title: "Vatican Museums & Sistine Chapel",
    subtitle: "Skip-the-line Tickets with Audio Guide",
    image: "/images/ticket-standard.jpg",
    duration: "3 hours",
    highlights: [
      "Skip-the-line entry",
      "Access to all galleries",
      "Sistine Chapel included",
      "Multi-language audio guide",
    ],
    price: 75.79,
    badge: "bestseller",
    type: "audio",
  },
  {
    id: "guided",
    title: "Guided Tour Vatican Museums & Sistine Chapel",
    subtitle: "Expert Guide with Small Group",
    image: "/images/guided-tour.jpg",
    duration: "2.5 hours",
    groupSize: "Max 20 people",
    highlights: [
      "Expert English-speaking guide",
      "Small group experience",
      "Headsets provided",
      "Skip-the-line access",
    ],
    price: 124.90,
    badge: "popular",
    type: "guided",
  },
  {
    id: "dome",
    title: "St. Peter's Basilica with Dome Access",
    subtitle: "Tickets with Elevator & Audio Guide",
    image: "/images/st-peters-dome.jpg",
    duration: "2 hours",
    highlights: [
      "Elevator to the Dome",
      "St. Peter's Basilica entry",
      "Panoramic city views",
      "Audio guide included",
    ],
    price: 86.30,
    badge: null,
    type: "audio",
  },
  {
    id: "combo-dome",
    title: "Vatican Museums & St. Peter's Dome",
    subtitle: "Complete Vatican Experience",
    image: "/images/ticket-vip.jpg",
    duration: "5 hours",
    highlights: [
      "Vatican Museums entry",
      "Sistine Chapel",
      "St. Peter's Basilica & Dome",
      "Audio guide",
    ],
    price: 162.09,
    originalPrice: 180.00,
    badge: null,
    type: "audio",
  },
  {
    id: "colosseum",
    title: "Colosseum, Forum & Palatine Hill",
    subtitle: "Skip-the-line Tickets with Audio Guide",
    image: "/images/colosseum.jpg",
    duration: "3 hours",
    highlights: [
      "Skip-the-line entry",
      "Roman Forum access",
      "Palatine Hill included",
      "Audio guide",
    ],
    price: 45.00,
    badge: null,
    type: "audio",
  },
  {
    id: "combo-colosseum",
    title: "Combo: Vatican Museums & Colosseum",
    subtitle: "Best of Rome in One Day",
    image: "/images/combo-vatican-colosseum.jpg",
    duration: "Full day",
    highlights: [
      "Vatican Museums & Sistine Chapel",
      "Colosseum entry",
      "Roman Forum & Palatine",
      "Audio guides included",
    ],
    price: 132.69,
    originalPrice: 150.00,
    badge: null,
    type: "audio",
  },
]

function TicketCard({
  ticket,
  selectedDate,
  isSelected,
  onSelect,
}: {
  ticket: Ticket
  selectedDate: Date | undefined
  isSelected: boolean
  onSelect: () => void
}) {
  const formattedPrice = ticket.price.toFixed(2).replace(".", ",")
  const formattedOriginalPrice = ticket.originalPrice?.toFixed(2).replace(".", ",")

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
        <div className="relative aspect-[16/10] w-full sm:aspect-auto sm:h-auto sm:w-48 md:w-56">
          <Image
            src={ticket.image}
            alt={ticket.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 224px"
          />
          {ticket.badge && (
            <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white ${
              ticket.badge === "bestseller" ? "bg-green-600" : "bg-[#d4a853]"
            }`}>
              {ticket.badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="flex-1">
              <div className="mb-1 flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold text-[#1a365d] group-hover:text-[#2d4a7c]">
                  {ticket.title}
                </h3>
                {isSelected && (
                  <span className="rounded-full bg-[#1a365d] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    Selected
                  </span>
                )}
              </div>
            <p className="mb-3 text-sm text-gray-500">{ticket.subtitle}</p>

            {/* Meta Info */}
            <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {ticket.duration}
              </span>
              {ticket.type === "guided" && (
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {ticket.groupSize}
                </span>
              )}
              {ticket.type === "audio" && (
                <span className="flex items-center gap-1">
                  <Headphones className="h-3.5 w-3.5" />
                  Audio Guide
                </span>
              )}
            </div>

            {/* Highlights */}
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
              {ticket.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-1.5 text-xs text-gray-600">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-green-500" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            {selectedDate && (
              <p className="mt-3 text-xs text-[#d4a853]">
                Available on {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
            )}
          </div>

          {/* Price & CTA */}
          <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-4">
            <div>
              <span className="text-xs text-gray-500">from</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#1a365d]">{formattedPrice}&euro;</span>
                {formattedOriginalPrice && (
                  <span className="text-sm text-gray-400 line-through">{formattedOriginalPrice}&euro;</span>
                )}
              </div>
              <span className="text-xs text-gray-400">per person</span>
            </div>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                onSelect()
              }}
              className={`flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                isSelected
                  ? "bg-[#1a365d] text-white hover:bg-[#264d81]"
                  : "bg-[#d4a853] text-[#1a365d] hover:bg-[#e5b964] hover:shadow-md"
              }`}
            >
              {isSelected ? "Selected" : "Select Ticket"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TicketGrid() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id ?? "")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId) ?? null
  const dateSelectorRef = useRef<HTMLDivElement | null>(null)

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicketId(ticketId)

    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      if (dateSelectorRef.current) {
        const yPosition = dateSelectorRef.current.getBoundingClientRect().top + window.scrollY - 28
        window.scrollTo({ top: Math.max(yPosition, 0), behavior: "smooth" })
      }
    }
  }

  return (
    <section id="tickets" className="bg-gray-50 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-2xl font-bold text-[#1a365d] sm:text-3xl lg:text-4xl">
            Choose Your Experience
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-gray-500 md:text-base">
            Select a date and explore our curated selection of Vatican tours and tickets
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
          {/* Left Column: Date Selector */}
          <div ref={dateSelectorRef} className="order-2 lg:order-1">
            <div className="sticky top-28">
              <DateSelector
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                selectedTicket={selectedTicket ? { title: selectedTicket.title, price: selectedTicket.price } : null}
                selectedTime={selectedTime}
                onTimeSelect={setSelectedTime}
              />

              {/* Trust badges */}
              <div className="mt-6 rounded-xl border border-gray-100 bg-white p-4">
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
                  Why Book With Us
                </h4>
                <ul className="space-y-2.5">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Free cancellation up to 24h</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Instant confirmation</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Skip-the-line access</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Best price guarantee</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column: Tickets */}
          <div className="order-1 lg:order-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {tickets.length} Experiences Available
              </h3>
            </div>

            {/* Ticket Cards */}
            <div className="flex flex-col gap-4">
              {tickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
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
