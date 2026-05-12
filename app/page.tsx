import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { TicketGrid } from "@/components/ticket-grid"
import { ContentSections, BookingSteps, DiscoverSection, FAQSection } from "@/components/content-sections"
import { Footer } from "@/components/footer"
import { getAvailabilityByProduct } from "@/lib/availability"
import { getProducts } from "@/lib/products"

export const runtime = "nodejs"
export const revalidate = 300

export default async function Home() {
  const products = await getProducts().catch(() => undefined)
  const availability = products
    ? await getAvailabilityByProduct(products.map((product) => product.id)).catch(() => ({}))
    : {}

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero initialTickets={products} />
        <TicketGrid initialTickets={products} availability={availability} />
        <BookingSteps />
        <ContentSections />
        <FAQSection />
        <DiscoverSection />
      </main>
      <Footer />
    </div>
  )
}
