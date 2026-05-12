"use client"

import Image from "next/image"
import Link from "next/link"
import { Check, X, ChevronRight, ChevronLeft, Star } from "lucide-react"
import { blogPosts } from "@/lib/blog-posts"
import { useLanguage } from "@/components/language-provider"

const ticketDetails = [
  {
    id: "louvre",
    title: "Louvre Museum Ticket",
    subtitle: "Visit the Louvre and discover the world's most famous art collection",
    image: "/images/louvre.jpg",
    description: `Explore the Louvre Museum at your own pace and discover masterpieces from every era, from ancient sculptures to Renaissance icons. This ticket is ideal for visitors who want a flexible Paris museum experience.

See the Mona Lisa, the Venus de Milo, the Winged Victory of Samothrace, and thousands of works inside one of the most celebrated museums in the world.`,
    duration: "2-3 hours",
    officialPriceNote:
      "Official ticket price: €22 (EEA) / €32 (non-EEA); The remaining amount corresponds to additional services, audioguides and booking services.",
    includes: [
      "Louvre Museum entry ticket",
      "Access to the permanent collections",
      "Timed entry slot",
    ],
    excludes: [
      "Temporary exhibitions unless specified",
      "Nothing not specified in the section indicating what is included",
    ],
  },
  {
    id: "eiffel",
    title: "Eiffel Tower Ticket",
    subtitle: "Enjoy panoramic views from Paris's most iconic landmark",
    image: "/images/eiffel.jpg",
    description: `Make the Eiffel Tower the highlight of your Paris visit with a timed access ticket. Enjoy sweeping views across the city and spot landmarks such as the Seine, the Louvre, Notre-Dame, and Montmartre.

Choose the time that fits your itinerary and experience the symbol of Paris from above.`,
    duration: "2 hours",
    officialPriceNote:
      "Official ticket price: €14.80 (second floor by stairs only); The remaining amount corresponds to additional services, audioguides and booking services.",
    includes: [
      "Eiffel Tower access ticket",
      "Timed entry slot",
      "Panoramic city views",
    ],
    excludes: [
      "Hotel pickup and drop-off",
      "Nothing not specified in the section indicating what is included",
    ],
  },
  {
    id: "seine-cruise",
    title: "Seine River Cruise",
    subtitle: "See Paris from the water with a sightseeing boat ticket",
    image: "/images/seine-cruise.jpg",
    description: `Relax on a Seine River cruise and enjoy a different view of Paris. Sail past famous landmarks and bridges while taking in the atmosphere of the city from the water.

This ticket is a great standalone experience and also pairs perfectly with Louvre and Eiffel Tower combo packages.`,
    duration: "1 hour",
    includes: [
      "Seine River sightseeing cruise",
      "Views of Paris landmarks",
      "Audio commentary available",
    ],
    excludes: [
      "Food and drinks",
      "Hotel pickup and drop-off",
    ],
  },
]

export function ContentSections() {
  const { t } = useLanguage()
  const localizedTicketDetails = ticketDetails.map((ticket) => ({
    ...ticket,
    ...(t.products[ticket.id === "seine-cruise" ? "boat" : ticket.id] ?? {}),
  }))

  return (
    <section id="gallery" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold text-[#1a365d] sm:text-3xl lg:text-4xl">
            {t.sections.exploreTitle}
          </h2>
          <p className="mx-auto max-w-2xl text-gray-500">
            {t.sections.exploreSubtitle}
          </p>
        </div>

        {localizedTicketDetails.map((ticket, index) => (
          <div
            key={ticket.id}
            className={`mb-16 pb-16 ${index < ticketDetails.length - 1 ? "border-b border-gray-100" : ""}`}
          >
            <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
              {/* Image */}
              <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${index % 2 === 1 ? "lg:order-2" : ""}`}>
                <Image
                  src={ticket.image}
                  alt={ticket.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 420px"
                />
              </div>

              {/* Content */}
              <div className={`flex flex-col justify-center ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                <h3 className="mb-2 text-2xl font-bold text-[#1a365d] lg:text-3xl">
                  {ticket.title}
                </h3>
                <p className="mb-4 text-[#d4a853]">{ticket.subtitle}</p>

                <div className="prose prose-gray max-w-none">
                  {ticket.description.split("\n\n").map((paragraph, idx) => (
                    <p key={idx} className="mb-4 leading-relaxed text-gray-600">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <p className="mb-6 text-sm text-gray-500">
                  {t.sections.estimatedTime} <span className="font-semibold text-[#1a365d]">{ticket.duration}</span>.
                </p>
                {ticket.officialPriceNote ? (
                  <p className="mb-6 text-sm italic leading-6 text-gray-500">{ticket.officialPriceNote}</p>
                ) : null}

                {/* Includes / Excludes */}
                <div className="grid gap-6 rounded-xl bg-gray-50 p-5 sm:grid-cols-2">
                  <div>
                    <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-green-600">{t.sections.includes}</h4>
                    <ul className="space-y-2">
                      {ticket.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-red-500">{t.sections.notIncluded}</h4>
                    <ul className="space-y-2">
                      {ticket.excludes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                          <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function BookingSteps() {
  const { t } = useLanguage()
  const steps = t.sections.steps

  return (
    <section className="bg-[#1a365d] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h3 className="mb-8 text-center text-lg font-bold text-white">{t.sections.howToBook}</h3>
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              <span className="mb-2 inline-block text-4xl font-bold text-[#d4a853]">{step.number}</span>
              <h4 className="mb-2 text-lg font-bold text-white">{step.title}</h4>
              <p className="text-sm text-white/70">{step.description}</p>
              {index < steps.length - 1 && (
                <ChevronRight className="absolute right-0 top-1/2 hidden h-6 w-6 -translate-y-1/2 translate-x-1/2 text-[#d4a853] md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function DiscoverSection() {
  const { t } = useLanguage()

  return (
    <section id="discover" className="bg-gray-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-[#1a365d] sm:text-3xl">
              {t.sections.discoverTitle}
            </h2>
            <p className="text-gray-500">
              {t.sections.discoverSubtitle}
            </p>
          </div>
          <Link href="/blog" className="hidden items-center gap-1 text-sm font-medium text-[#d4a853] hover:underline sm:flex">
            {t.sections.viewAllArticles}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {blogPosts.map((article) => (
            <article
              key={article.slug}
              className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-lg"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 350px"
                />
              </div>
              <div className="p-5">
                <h3 className="mb-2 line-clamp-2 text-lg font-bold text-[#1a365d] group-hover:text-[#2d4a7c]">
                  {article.title}
                </h3>
                <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                  {article.description}
                </p>
                <Link
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center text-sm font-medium text-[#d4a853] hover:underline"
                >
                  {t.sections.readMore}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Testimonials() {
  const { t } = useLanguage()
  const testimonials = [
    {
      name: "Sarah M.",
      location: "United States",
      rating: 5,
      text: "Amazing experience! Skip the line was totally worth it. Our guide was incredibly knowledgeable.",
    },
    {
      name: "Marco R.",
      location: "Germany",
      rating: 5,
      text: "The audio guide was excellent. We could explore at our own pace and didn't miss any important details.",
    },
    {
      name: "Emma L.",
      location: "United Kingdom",
      rating: 5,
      text: "Booking was easy and the confirmation was instant. Highly recommend for anyone visiting Paris!",
    },
  ]

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-2xl font-bold text-[#1a365d] sm:text-3xl">
            {t.sections.testimonialsTitle}
          </h2>
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-[#d4a853] text-[#d4a853]" />
            ))}
            <span className="ml-2 text-sm text-gray-500">{t.sections.testimonialsRating}</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-100 bg-gray-50 p-6"
            >
              <div className="mb-3 flex items-center gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#d4a853] text-[#d4a853]" />
                ))}
              </div>
              <p className="mb-4 text-gray-600">&quot;{testimonial.text}&quot;</p>
              <div>
                <p className="font-semibold text-[#1a365d]">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FAQSection() {
  const { t } = useLanguage()
  const faqs = [
    {
      question: "When will I receive my ticket confirmation?",
      answer:
        "After submitting your booking request, we process the details and send confirmation to the email address you provided.",
    },
    {
      question: "Can I book a combo ticket for different dates?",
      answer:
        "Yes. Combo tickets let you choose separate dates and time slots for each attraction included in the package.",
    },
    {
      question: "What happens if a date or time is unavailable?",
      answer:
        "Unavailable dates and time slots are disabled during booking, so you can only select options that are currently open.",
    },
    {
      question: "Can I change my booking after submitting it?",
      answer:
        "Contact support with your order ID as soon as possible. Changes depend on ticket availability and attraction rules.",
    },
    {
      question: "Do I need to print my confirmation?",
      answer:
        "In most cases a mobile confirmation is enough, but we recommend keeping the confirmation email accessible on the day of your visit.",
    },
  ]

  return (
    <section id="faq" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-2xl font-bold text-[#1a365d] sm:text-3xl">
            {t.sections.faqTitle}
          </h2>
          <p className="text-gray-500">
            {t.sections.faqSubtitle}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl border border-gray-100 bg-gray-50 p-5 transition open:bg-white open:shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-[#1a365d]">
                {faq.question}
                <span className="text-xl font-light text-[#d4a853] transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-gray-600">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
