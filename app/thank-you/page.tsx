import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"
import { PurchaseTracking } from "@/components/purchase-tracking"
import { completePaidCheckoutSession } from "@/lib/stripe-checkout"

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams?: Promise<{ order?: string; session_id?: string }>
}) {
  const params = await searchParams
  const orderNumber = params?.order
  const purchase = params?.session_id
    ? await completePaidCheckoutSession(params.session_id).catch(() => null)
    : null
  const displayedOrderNumber = purchase?.orderNumber ?? orderNumber

  return (
    <main className="min-h-screen bg-[#f8f6f0] px-4 py-8 text-[#10233f] sm:py-14">
      {purchase && (
        <PurchaseTracking
          transactionId={purchase.transactionId}
          value={purchase.value}
          currency={purchase.currency}
          productId={purchase.productId}
          productTitle={purchase.productTitle}
          customerEmail={purchase.customerEmail}
          customerPhone={purchase.customerPhone}
        />
      )}
      <div className="mx-auto max-w-5xl">
        <section className="grid overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-6 sm:p-10 lg:p-12">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Check className="h-3.5 w-3.5" />
              </span>
              Request received
            </div>

            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-[#10233f] sm:text-5xl">
              Your booking is in progress.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
              Thanks for your request. We are checking the selected tickets and will send the confirmation details to your email address as soon as possible.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#10233f] px-6 text-sm font-semibold text-white transition hover:bg-[#18395f]"
              >
                Back to homepage
              </Link>
              <Link
                href="/#tickets"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-slate-200 px-6 text-sm font-semibold text-[#10233f] transition hover:bg-slate-50"
              >
                Browse tickets
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <aside className="border-t border-slate-100 bg-[#10233f] p-6 text-white sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
            {displayedOrderNumber && (
              <div className="mb-8 rounded-2xl border border-white/10 bg-white/10 p-5">
                <p className="text-sm text-white/55">Order ID</p>
                <p className="mt-2 text-4xl font-semibold tracking-tight">{displayedOrderNumber}</p>
                <p className="mt-2 text-sm text-white/55">Keep this number for support.</p>
              </div>
            )}

            <div className="space-y-5">
              <div>
                <p className="text-sm font-semibold text-[#d4a853]">What happens next?</p>
                <div className="mt-4 space-y-4">
                  <div className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#d4a853]" />
                    <p className="text-sm leading-6 text-white/75">
                      We review the booking details and ticket availability.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#d4a853]" />
                    <p className="text-sm leading-6 text-white/75">
                      Confirmation details are sent to the email address from your order.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-[#d4a853]" />
                    <p className="text-sm leading-6 text-white/75">
                      If anything needs adjusting, reference your order ID when contacting support.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/[0.06] p-4">
                <p className="text-sm font-semibold">Need help?</p>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  Reply to your confirmation email or include your Order ID when contacting us.
                </p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}
