import Link from "next/link"

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Legal</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Disclaimer</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          This page explains the independent nature of ParisTourPass.com, the validity of the tickets offered through
          our website, and the additional services included in our pricing.
        </p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-slate-700">
          <section>
            <h2 className="text-lg font-semibold text-slate-900">1. Independent Website</h2>
            <p className="mt-2">
              This website (paristourpass.com) operates as an independent provider of tourist services and is not
              affiliated with, sponsored by, authorized by, or operated by the Louvre Museum or any of its official
              managing entities.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">2. Purpose of Our Service</h2>
            <p className="mt-2">
              Our purpose is to enhance the visitor experience by offering independent services, including valid and
              official admission tickets and supplementary digital content such as audio guides.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">3. Ticket Validity</h2>
            <p className="mt-2">
              All tickets offered on this website are genuine and officially valid, procured through authorized
              distribution channels.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">4. Pricing and Additional Services</h2>
            <p className="mt-2">
              Our listed prices may incorporate additional costs covering management fees, early availability access,
              dedicated customer service, and the provision of digital materials.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">5. Trademarks and Official Names</h2>
            <p className="mt-2">
              Trademarks, logos, and official names of the monuments mentioned are the exclusive property of their
              respective owners. They are used strictly for descriptive purposes only, with no intent to cause confusion
              or claim ownership.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">6. Operator Details</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Operated by:</strong> TicketCompass OÜ
              </li>
              <li>
                <strong>Address:</strong> Karamelli tn 2, 11317 Kesklinna linnaosa, Tallinn, Estonia
              </li>
              <li>
                <strong>Tax Number:</strong> EE102778049
              </li>
              <li>
                <strong>Company Register:</strong> 17069651
              </li>
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
