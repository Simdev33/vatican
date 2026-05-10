import Link from "next/link"

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Legal</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Terms and Conditions</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          These Terms and Conditions (&ldquo;T&amp;C&rdquo;) govern the use of services and the purchase of products
          offered by <strong>TicketCompass OÜ</strong>. By using our services or purchasing
          from us, you (&ldquo;Customer&rdquo;) agree to be bound by these terms.
        </p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-slate-700">
          <section>
            <h2 className="text-lg font-semibold text-slate-900">1. Introduction</h2>
            <p className="mt-2">
              These Terms and Conditions (&ldquo;T&amp;C&rdquo;) govern the use of services and the purchase of
              products offered by <strong>TicketCompass OÜ</strong>. By using our services or purchasing from us, you
              (&ldquo;Customer&rdquo;) agree to be bound by these terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">2. Bookings, Cancellations &amp; Rescheduling</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>All bookings must be made in advance and are subject to availability.</li>
              <li>Cancellations are accepted only if requested at least 24 hours before the scheduled arrival or service time.</li>
              <li>For cancellations made less than 24 hours in advance, the full fee may be charged.</li>
              <li>
                Rescheduling may be possible depending on availability and the specific situation, if the request is
                made at least 24 hours before the original booking.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">3. External Events &amp; Attractions Disclaimer</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                We are not responsible for issues beyond our control, including but not limited to: road closures,
                attraction shutdowns, weather conditions, third-party restrictions or changes.
              </li>
              <li>Such events do not qualify for automatic refunds.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">4. Refund Policy</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                Tickets for leisure services provided on a specific date/time are not subject to the 14-day right of
                withdrawal under Directive 2011/83/EU, Article 16(l). Notwithstanding the above, we offer free
                cancellation up to 24 hours before the scheduled time (unless otherwise stated on the product page).
              </li>
              <li>After this period, tickets are non-refundable.</li>
              <li>
                Refunds are only considered in justified and exceptional cases, such as defective items or mistakes
                caused by us.
              </li>
              <li>For services, refunds may be issued only in cases where we cancel or fail to deliver.</li>
              <li>
                Refund requests must be made within 7 days of purchase at <strong>info@paristourpass.com</strong>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">5. Payments</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>All prices are listed in EUR and include applicable taxes unless otherwise stated.</li>
              <li>
                Payments must be completed prior to receiving the product or service, unless otherwise agreed in
                writing.
              </li>
              <li>
                We reserve the right to refuse service or delivery if payment has not been received or is disputed.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">6. Liability</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                We are not liable for indirect, incidental, or consequential damages that may result from the use of
                our services or products.
              </li>
              <li>
                Our maximum liability is limited to the total amount paid by the customer for the specific service or
                product in question.
              </li>
              <li>
                Our liability does not extend to any loss or inconvenience resulting from the closure or unavailability
                of third-party venues or attractions.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">7. Changes to These Terms</h2>
            <p className="mt-2">
              We reserve the right to modify or update these Terms and Conditions at any time. Changes will take effect
              immediately upon posting on our website.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">8. Delivery of Tickets</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Tickets are delivered digitally as PDF files via email to the address provided at checkout.</li>
              <li>Delivery is deemed completed when our system confirms successful email dispatch.</li>
              <li>
                If you do not receive your tickets within the indicated timeframe (usually within minutes, but please
                allow up to 2 hours), check your spam folder and then contact us at{" "}
                <strong>info@paristourpass.com</strong>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">9. Customer Service &amp; Complaints</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                You can contact us at <strong>info@paristourpass.com</strong>.
              </li>
              <li>We aim to respond within 2 business days.</li>
              <li>
                If you intend to dispute a card charge (chargeback), please contact us first so we can investigate and
                provide a resolution. Unwarranted chargebacks may lead to suspension of services.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">10. Governing Law &amp; Dispute Resolution</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                These T&amp;C are governed by the laws of Hungary. Courts of Hungary shall have jurisdiction, without
                prejudice to mandatory consumer rights in your country of residence.
              </li>
              <li>
                Consumers may use the EU Online Dispute Resolution (ODR) platform: https://ec.europa.eu/consumers/odr
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">11. Contact</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                If you have any questions about these terms, please contact us at:{" "}
                <strong>info@paristourpass.com</strong>
              </li>
              <li>
                <strong>Company:</strong> TicketCompass OÜ
              </li>
              <li>
                <strong>Address:</strong> Karamelli tn 2, 11317 Kesklinna linnaosa, Tallinn
              </li>
              <li>
                <strong>Country:</strong> Estonia
              </li>
              <li>
                <strong>Tax Number:</strong> EE102778049
              </li>
              <li>
                <strong>Company Register:</strong> 17069651
              </li>
              <li>In case of discrepancies between language versions of these T&amp;C, the English version prevails.</li>
            </ul>
          </section>
        </div>
        <Link href="/" className="mt-8 inline-flex text-sm font-medium text-[#1a365d] hover:underline">
          Back to homepage
        </Link>
      </div>
    </main>
  )
}
