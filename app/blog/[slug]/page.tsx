import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { blogPosts, getBlogPost } from "@/lib/blog-posts"

type BlogPostPageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    return {
      title: "Article Not Found | Paris Tickets",
    }
  }

  return {
    title: `${post.title} | Paris Tickets`,
    description: post.description,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-white">
        <article>
          <section className="bg-[#1a365d] px-4 py-12 text-white sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <Link href="/blog" className="mb-8 inline-flex items-center text-sm font-medium text-[#d4a853] hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to articles
              </Link>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#d4a853]">
                {post.readTime}
              </p>
              <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                {post.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
                {post.description}
              </p>
            </div>
          </section>

          <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl">
              <Image
                src={post.image}
                alt={post.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 900px"
              />
            </div>

            <div className="mx-auto max-w-3xl space-y-9">
              {post.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="mb-4 text-2xl font-bold text-[#1a365d]">{section.heading}</h2>
                  <div className="space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="text-base leading-8 text-gray-600">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
