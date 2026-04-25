"use client"

import Image from "next/image"
import { ArrowRight } from "lucide-react"

const ticketBadges = [
  {
    id: 1,
    title: "Vatican Museums",
    subtitle: "& Sistine Chapel",
    price: "75,79",
    targetTicketId: "standard",
  },
  {
    id: 2,
    title: "Guided Tour",
    subtitle: "Vatican & Sistine Chapel",
    price: "124,90",
    targetTicketId: "guided",
  },
  {
    id: 3,
    title: "Papal Audience",
    subtitle: "St. Peter's & Dome",
    price: "95,00",
    targetTicketId: "dome",
  },
  {
    id: 4,
    title: "St. Peter's",
    subtitle: "Basilica & Dome",
    price: "86,30",
    targetTicketId: "dome",
  },
  {
    id: 5,
    title: "Combo Tour",
    subtitle: "Vatican & St Peter's",
    price: "162,09",
    targetTicketId: "combo-dome",
  },
  {
    id: 6,
    title: "Combo Tour",
    subtitle: "Vatican & Colosseum",
    price: "132,69",
    targetTicketId: "combo-colosseum",
  },
]

export function Hero() {
  const handleViewAllTicketsClick = () => {
    if (typeof window === "undefined") return

    const ticketsSection = document.getElementById("tickets")
    if (!ticketsSection) return

    const topPosition = ticketsSection.getBoundingClientRect().top + window.scrollY
    window.scrollTo({
      top: Math.max(topPosition, 0),
      behavior: "smooth",
    })
  }

  const handleBadgeClick = (targetTicketId: string) => {
    if (typeof window === "undefined") return

    const targetElement =
      document.getElementById(`ticket-${targetTicketId}`) ?? document.getElementById("tickets")

    if (!targetElement) return

    const topPosition = targetElement.getBoundingClientRect().top + window.scrollY - 90
    window.scrollTo({
      top: Math.max(topPosition, 0),
      behavior: "smooth",
    })
  }

  return (
    <>
      <section className="relative min-h-[760px] w-full overflow-hidden sm:min-h-[820px] md:min-h-[580px] lg:min-h-[620px]">
        {/* Background Image */}
        <Image
          src="/images/hero-basilica.jpg"
          alt="St. Peter's Basilica interior"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col">
          {/* Title Section - Centered */}
          <div className="flex flex-1 items-center justify-center px-4 pb-12 pt-8 md:pb-40">
            <div className="text-center">
              <span className="mb-4 inline-block rounded-full border border-[#d4a853]/50 bg-[#d4a853]/20 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#d4a853] backdrop-blur-sm">
                Skip the Line Access
              </span>
              <h1 className="mx-auto max-w-3xl font-serif text-4xl font-normal leading-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl">
                Vatican Museums &
                <br />
                <span className="text-[#d4a853]">Sistine Chapel</span> Tickets
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base text-white/80 md:text-lg">
                Book your tickets online and skip the long queues. Instant confirmation.
              </p>
              <a
                href="#tickets"
                onClick={(event) => {
                  event.preventDefault()
                  handleViewAllTicketsClick()
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#d4a853] px-8 py-3 text-sm font-semibold text-[#1a365d] transition-all hover:bg-[#e5b964] hover:shadow-lg"
              >
                View All Tickets
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Circular ticket badges at bottom */}
          <div className="pb-6 md:absolute md:bottom-10 md:left-0 md:right-0 md:pb-0">
            <div className="mx-auto grid max-w-md grid-cols-3 gap-2 px-4 sm:max-w-lg sm:gap-3 md:flex md:max-w-6xl md:justify-center md:gap-4 lg:gap-5">
              {ticketBadges.map((ticket) => (
                <a
                  key={ticket.id}
                  href={`#ticket-${ticket.targetTicketId}`}
                  onClick={(event) => {
                    event.preventDefault()
                    handleBadgeClick(ticket.targetTicketId)
                  }}
                  className="group flex justify-center"
                >
                  <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full border-2 border-[#d4a853] bg-[#1a365d]/85 p-2 text-center backdrop-blur-sm transition-all hover:scale-105 hover:border-[#f0c56c] hover:bg-[#1a365d]/95 md:h-28 md:w-28 lg:h-32 lg:w-32">
                    <span className="line-clamp-1 text-[10px] font-semibold leading-tight text-white md:text-xs">
                      {ticket.title}
                    </span>
                    <span className="line-clamp-1 text-[8px] leading-tight text-white/70 md:text-[10px]">
                      {ticket.subtitle}
                    </span>
                    <span className="mt-1 text-[8px] text-white/60 md:text-[9px]">
                      from
                    </span>
                    <span className="text-sm font-bold text-[#d4a853] md:text-base">
                      {ticket.price}&euro;
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gold banner below hero */}
      <div className="bg-gradient-to-r from-[#c9993d] via-[#d4a853] to-[#c9993d] py-4 shadow-md">
        <p className="text-balance text-center text-sm font-medium text-[#1a365d] md:text-base lg:text-lg">
          Vatican Museums, Sistine Chapel and St. Peter&apos;s Basilica: Book your Ticket Today
        </p>
      </div>
    </>
  )
}
