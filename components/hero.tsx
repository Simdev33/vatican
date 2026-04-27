import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface HeroProduct {
  id: string
  price: number
}

const ticketBadges = [
  {
    id: 1,
    title: "Louvre",
    subtitle: "Museum Entry",
    fallbackPrice: 35,
    targetTicketId: "louvre",
  },
  {
    id: 2,
    title: "Eiffel",
    subtitle: "Tower Access",
    fallbackPrice: 49,
    targetTicketId: "eiffel",
  },
  {
    id: 3,
    title: "Seine Cruise",
    subtitle: "Boat Ticket",
    fallbackPrice: 18,
    targetTicketId: "boat",
  },
  {
    id: 4,
    title: "Louvre + Boat",
    subtitle: "+ Eiffel",
    fallbackPrice: 89,
    targetTicketId: "louvre-boat-eiffel",
  },
  {
    id: 5,
    title: "Louvre",
    subtitle: "+ Eiffel",
    fallbackPrice: 74,
    targetTicketId: "louvre-eiffel",
  },
  {
    id: 6,
    title: "Eiffel",
    subtitle: "+ Boat",
    fallbackPrice: 59,
    targetTicketId: "eiffel-boat",
  },
]

function formatBadgePrice(price: number) {
  return price.toFixed(2).replace(".", ",")
}

export function Hero({ initialTickets = [] }: { initialTickets?: HeroProduct[] }) {
  const productPrices = new Map(initialTickets.map((product) => [product.id, product.price]))

  return (
    <>
      <section className="relative min-h-[640px] w-full overflow-hidden sm:min-h-[700px] md:min-h-[760px] lg:min-h-[780px]">
        {/* Background Image */}
        <Image
          src="/images/hero-attractions.jpg"
          alt="Paris tickets and attractions"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />

        {/* Content Container */}
        <div className="absolute inset-0 z-10 flex flex-col">
          {/* Title Section - Centered */}
          <div className="flex flex-1 items-center justify-center px-4 pb-6 pt-8 md:pb-10">
            <div className="text-center">
              <h1 className="mx-auto max-w-3xl font-serif text-3xl font-normal leading-tight text-white drop-shadow-lg sm:text-4xl md:text-5xl lg:text-6xl">
                Louvre, Eiffel Tower &
                <br />
                <span className="text-[#d4a853]">Seine Cruise</span> Tickets
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base text-white/80 md:text-lg">
                Book single attraction tickets or save with Paris combo experiences. Instant confirmation.
              </p>
              <a
                href="#tickets"
                className="relative z-20 mt-6 inline-flex items-center gap-2 rounded-full bg-[#d4a853] px-6 py-3 text-sm font-semibold text-[#1a365d] transition-all hover:bg-[#e5b964] hover:shadow-lg sm:px-8"
              >
                View All Tickets
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Circular ticket badges at bottom */}
          <div className="pb-5 sm:pb-8">
            <div className="mx-auto grid max-w-sm grid-cols-3 gap-2 px-4 sm:max-w-lg sm:gap-3 md:flex md:max-w-6xl md:flex-wrap md:justify-center md:gap-4 lg:gap-5">
              {ticketBadges.map((ticket) => (
                <a
                  key={ticket.id}
                  href={`#ticket-${ticket.targetTicketId}`}
                  className="group flex justify-center"
                >
                  <div className="flex h-20 w-20 flex-col items-center justify-center rounded-full border border-[#d4a853] bg-[#1a365d]/85 p-2 text-center backdrop-blur-sm transition-all hover:scale-105 hover:border-[#f0c56c] hover:bg-[#1a365d]/95 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32">
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
                      {formatBadgePrice(productPrices.get(ticket.targetTicketId) ?? ticket.fallbackPrice)}&euro;
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
          Louvre Museum, Eiffel Tower and Seine River Cruise: Book your Ticket Today
        </p>
      </div>
    </>
  )
}
