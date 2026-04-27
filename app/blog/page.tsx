import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { blogPosts } from "@/lib/blog-posts"

export const metadata = {
  title: "Paris Travel Articles | Paris Tickets",
  description: "Read practical guides for visiting the Louvre, Eiffel Tower, and Seine River in Paris.",
}

export default function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <section className="bg-[#1a365d] px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#d4a853]">
              Paris Guide
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              Discover Paris Before You Go
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-white/70">
              Practical articles to help you plan your Louvre, Eiffel Tower, and Seine River visit.
            </p>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
            {blogPosts.map((post) => (
              <article key={post.slug} className="overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-lg">
                <div className="relative aspect-[16/10]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 350px"
                  />
                </div>
                <div className="p-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#d4a853]">
                    {post.readTime}
                  </p>
                  <h2 className="mb-2 text-xl font-bold text-[#1a365d]">{post.title}</h2>
                  <p className="mb-5 text-sm leading-relaxed text-gray-600">{post.description}</p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-sm font-medium text-[#d4a853] hover:underline"
                  >
                    Read More
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
