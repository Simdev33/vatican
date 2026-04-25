import Image from "next/image"
import { Check, X, ChevronRight, ChevronLeft, Star } from "lucide-react"

const ticketDetails = [
  {
    id: "vatican-audio",
    title: "Vatican Museum and Sistine Chapel: Tickets with Audio Guide",
    subtitle: "Tickets for the Vatican and Sistine Chapel with Audio Guide",
    image: "/images/ticket-standard.jpg",
    description: `These spaces are among the most visited throughout the year, and for good reason. The beauty of the buildings is complemented by the artistic, historical, and cultural richness within their walls. Get your tickets for the Vatican Museums and the Sistine Chapel, with an audio guide and don't miss out on a unique experience during your visit to Rome.

You'll be able to enjoy these architectural wonders without missing a single detail. With our tickets to the Vatican Museums, accompanied by a complete and engaging audio guide, you'll uncover all the secrets and important facts about these monuments throughout your visit.`,
    duration: "3 hours",
    includes: [
      "Vatican Museums Tickets",
      "Sistine Chapel Tickets",
      "Audio guide in the selected language",
    ],
    excludes: [
      "Access to St. Peter's Dome",
      "Nothing not specified in the section indicating what is included",
    ],
  },
  {
    id: "guided-tour",
    title: "Guided Tour of the Vatican Museum and Sistine Chapel",
    subtitle: "Expert Guide with Small Group Experience",
    image: "/images/guided-tour.jpg",
    description: `Enjoy a guided walking tour of the most famous places in the Vatican with an expert guide. Experience the exclusive itinerary designed to help you uncover all the secrets of the Vatican Museums, culminating your visit in the Sistine Chapel.

The Vatican Museums are among the largest in the world, covering 43,000 m², so visiting them with an expert guide will help you make the most of your time there. With our tickets including a guided tour of the Vatican Museum and the Sistine Chapel, you'll see the works you truly can't miss.`,
    duration: "2 hours",
    includes: [
      "Tickets to the Vatican Museums",
      "Sistine Chapel Tickets",
      "Expert English-speaking guide",
      "Headsets provided",
    ],
    excludes: [
      "Guided tour of St. Peter's Basilica",
      "Nothing not specified in the section indicating what is included",
    ],
  },
  {
    id: "st-peters-dome",
    title: "St. Peter's Basilica with access to the Dome",
    subtitle: "Visit St. Peter's Basilica - Visit the Dome - includes Audio guide",
    image: "/images/st-peters-dome.jpg",
    description: `Discover Rome from a different perspective by purchasing your tickets to St. Peter's Basilica with access to the Dome. St. Peter's Basilica will leave you speechless, keeping your head up to observe every detail of its high ceilings and vaults, while access to St. Peter's Dome will allow you to enjoy the Vatican and Rome from above.

Conquer the sky of Rome with these tickets with audio guide to the Dome of St. Peter's Basilica with elevator and discover all the secrets, interior and exterior, that these spaces offer you.`,
    duration: "2 hours",
    includes: [
      "Tickets to St. Peter's Basilica",
      "Tickets for St. Peter's Dome with elevator",
      "Complimentary snack",
      "Tour assistance",
      "Audio guide in the selected language",
    ],
    excludes: [
      "Access to the Vatican Museums and Sistine Chapel",
      "Phone",
      "Headphones",
    ],
  },
]

export function ContentSections() {
  return (
    <section id="gallery" className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-2xl font-bold text-[#1a365d] sm:text-3xl lg:text-4xl">
            Explore Our Experiences
          </h2>
          <p className="mx-auto max-w-2xl text-gray-500">
            Discover the best ways to experience the Vatican Museums, Sistine Chapel, and St. Peter&apos;s Basilica
          </p>
        </div>

        {ticketDetails.map((ticket, index) => (
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
                  The estimated visiting time is around <span className="font-semibold text-[#1a365d]">{ticket.duration}</span>.
                </p>

                {/* Includes / Excludes */}
                <div className="grid gap-6 rounded-xl bg-gray-50 p-5 sm:grid-cols-2">
                  <div>
                    <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-green-600">Includes</h4>
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
                    <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-red-500">Not included</h4>
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
  const steps = [
    {
      number: "01",
      title: "Select Your Date",
      description: "Choose the day and time for your Vatican visit",
    },
    {
      number: "02",
      title: "Pick Your Experience",
      description: "Select from our range of tickets and tours",
    },
    {
      number: "03",
      title: "Book Securely",
      description: "Pay online and receive instant confirmation",
    },
  ]

  return (
    <section className="bg-[#1a365d] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h3 className="mb-8 text-center text-lg font-bold text-white">How to Book</h3>
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
  const articles = [
    {
      title: "7 Key Points You Can't Miss in the Vatican Museums",
      description: "The Vatican Museums are one of the largest art collections in the world. This space, a testament to the Catholic Church's artistic patronage throughout the centuries.",
      image: "/images/ticket-standard.jpg",
    },
    {
      title: "A Complete Guide to St. Peter's Basilica",
      description: "At the heart of the Vatican lies St. Peter's Square, an open space built by Bernini in the 17th century that precedes the nerve center of the papal city.",
      image: "/images/st-peters-dome.jpg",
    },
    {
      title: "What Do the Sistine Chapel Frescoes Mean?",
      description: "German writer Goethe wrote: \"Without having seen the Sistine Chapel, one cannot form a reasonable idea of what one is capable of achieving.\"",
      image: "/images/hero-vatican.jpg",
    },
  ]

  return (
    <section id="discover" className="bg-gray-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-[#1a365d] sm:text-3xl">
              Discover the Vatican
            </h2>
            <p className="text-gray-500">
              Learn more about these magnificent places before your visit
            </p>
          </div>
          <a href="#" className="hidden items-center gap-1 text-sm font-medium text-[#d4a853] hover:underline sm:flex">
            View all articles
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((article, index) => (
            <article
              key={index}
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
                <a
                  href="#"
                  className="inline-flex items-center text-sm font-medium text-[#d4a853] hover:underline"
                >
                  Read More
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Testimonials() {
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
      text: "Booking was easy and the confirmation was instant. Highly recommend for anyone visiting Rome!",
    },
  ]

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-2xl font-bold text-[#1a365d] sm:text-3xl">
            What Our Visitors Say
          </h2>
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-[#d4a853] text-[#d4a853]" />
            ))}
            <span className="ml-2 text-sm text-gray-500">4.9/5 based on 12,000+ reviews</span>
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
