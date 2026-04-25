import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { TicketGrid } from "@/components/ticket-grid"
import { ContentSections, BookingSteps, DiscoverSection, Testimonials } from "@/components/content-sections"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <TicketGrid />
        <BookingSteps />
        <ContentSections />
        <Testimonials />
        <DiscoverSection />
      </main>
      <Footer />
    </div>
  )
}
