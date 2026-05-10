import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Legal</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          <strong>Last updated:</strong> 28 April 2026
          <br />
          <strong>Website:</strong> paristourpass.com (the &ldquo;Website&rdquo;)
          <br />
          <strong>Owner / Data Controller:</strong> TicketCompass OÜ
          <br />
          <strong>Address:</strong> Karamelli tn 2, 11317 Kesklinna linnaosa, Tallinn, Estonia
          <br />
          <strong>Tax Number:</strong> EE102778049
          <br />
          <strong>Company Register:</strong> 17069651
          <br />
          <strong>Contact:</strong> info@paristourpass.com
        </p>

        <div className="mt-8 space-y-8 text-sm leading-7 text-slate-700">
          <section>
            <h2 className="text-lg font-semibold text-slate-900">1) About this Policy</h2>
            <p className="mt-2">
              This Privacy Policy explains how we collect, use, disclose, and protect personal data when you visit
              or buy tickets on the Website, contact us (e.g., email or live chat), or otherwise use our services
              (collectively, the &ldquo;Services&rdquo;). We process personal data as a controller under the EU
              General Data Protection Regulation (GDPR) and applicable Estonian/EU laws. If you have questions about
              this Policy or your rights, contact us at the email above.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">2) What data we collect</h2>
            <p className="mt-2">We only collect data that is necessary for providing the Services and complying with legal obligations.</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Identification &amp; contact data</strong> - name, email address, phone number, billing
                country/address (if provided), company/VAT ID (if provided).
              </li>
              <li>
                <strong>Order &amp; ticket data</strong> - product(s) purchased (e.g., attraction tickets), booking
                date/time, quantity, price, currency, order ID, delivery method (e.g., PDF by email),
                refund/cancellation history.
              </li>
              <li>
                <strong>Payment data</strong> - payment method, partial card data (last 4 digits, expiry
                month/year), transaction ID, fraud checks (we never store full card numbers). These are processed
                primarily by our payment processor.
              </li>
              <li>
                <strong>Communications</strong> - messages you send us via email or live chat, call notes (if any),
                and related metadata.
              </li>
              <li>
                <strong>Technical &amp; device data</strong> - IP address, device and browser type, operating system,
                referral source, cookie identifiers, time zone, and basic diagnostics/logs.
              </li>
              <li>
                <strong>Marketing preferences</strong> - newsletter/marketing opt-in status, unsubscribe status, and
                related consent records.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">3) How we collect data</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Directly from you</strong> when you browse the Website, make a booking, create/update your
                order, or contact us.
              </li>
              <li>
                <strong>Automatically</strong> via cookies, pixels, and similar technologies (see Cookies below).
              </li>
              <li>
                <strong>From service providers</strong> (e.g., payment processor for fraud/risk signals and
                transaction confirmations).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">4) Why we use your data (purposes &amp; legal bases)</h2>
            <p className="mt-2">
              We process personal data only where allowed under the GDPR. Below we explain each purpose in plain
              language and indicate the corresponding legal basis.
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <strong>Provide the Services:</strong> process and confirm orders; issue and deliver tickets (e.g.,
                PDF by email); handle bookings, changes and cancellations.
                <br />
                <em>Legal basis:</em> Contract necessity (GDPR Art. 6(1)(b)).
              </li>
              <li>
                <strong>Payments &amp; fraud prevention:</strong> process payments, refunds and chargebacks; verify
                transactions; monitor and prevent fraud/abuse.
                <br />
                <em>Legal basis:</em> Contract necessity (Art. 6(1)(b)) and Legitimate interests (Art. 6(1)(f)). Our
                payment processor may also act as an independent controller for certain antifraud/compliance checks.
              </li>
              <li>
                <strong>Customer support:</strong> respond to emails/live chat; resolve complaints and service issues;
                quality assurance.
                <br />
                <em>Legal basis:</em> Contract necessity (Art. 6(1)(b)) and Legitimate interests (Art. 6(1)(f)).
              </li>
              <li>
                <strong>Legal &amp; tax compliance:</strong> maintain invoices and accounting records; comply with
                consumer protection and EU/HU tax rules; respond to lawful requests from authorities.
                <br />
                <em>Legal basis:</em> Legal obligation (Art. 6(1)(c)).
              </li>
              <li>
                <strong>Security &amp; diagnostics:</strong> operate hosting, logging and security (e.g.,
                DDoS/anti-abuse); detect, investigate and remediate incidents.
                <br />
                <em>Legal basis:</em> Legitimate interests (Art. 6(1)(f)).
              </li>
              <li>
                <strong>Analytics &amp; site improvement:</strong> measure traffic and conversions; improve user
                experience and performance; run product experiments.
                <br />
                <em>Legal basis:</em> Consent (Art. 6(1)(a)) for non-essential cookies/analytics. You can withdraw
                consent any time via the cookie banner without affecting past processing.
              </li>
              <li>
                <strong>Marketing communications:</strong> send newsletters or special offers; measure email
                performance.
                <br />
                <em>Legal basis:</em> Consent (Art. 6(1)(a)); or soft opt-in where permitted for existing customers
                under e-privacy rules. You can opt out at any time via the unsubscribe link.
              </li>
              <li>
                <strong>Optional feedback:</strong> request post-purchase feedback to improve our services.
                <br />
                <em>Legal basis:</em> Legitimate interests (Art. 6(1)(f)); or Consent where required.
              </li>
            </ul>
            <p className="mt-4">
              <strong>Cookies &amp; Consent Mode - legal basis (summary)</strong>
              <br />
              For non-essential cookies and tags (including Google Analytics and Google Ads tags), we rely on consent:
              <code className="mx-1 rounded bg-slate-100 px-1 py-0.5 text-xs">analytics_storage</code>/
              <code className="mx-1 rounded bg-slate-100 px-1 py-0.5 text-xs">ad_storage</code> =
              &ldquo;consent&rdquo; under GDPR Art. 6(1)(a). Strictly necessary cookies rely on legitimate interests
              (Art. 6(1)(f)) and/or contractual necessity (Art. 6(1)(b)) where they are required to provide the
              Services (e.g., cart, checkout, security).
            </p>
            <p className="mt-3">
              <strong>Note on consent &amp; objections:</strong>
              <br />
              Where we rely on consent, you can withdraw it at any time. Where we rely on legitimate interests, you
              have the right to object; we will stop unless we demonstrate compelling legitimate grounds or the
              processing is needed for legal claims.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">5) Cookies &amp; similar technologies</h2>
            <p className="mt-2">We use:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Strictly necessary cookies</strong> - required for core site functions (e.g., cart, checkout,
                security). These run without consent.
              </li>
              <li>
                <strong>Analytics/performance cookies</strong> - help us understand how visitors use the site. These
                run only with your consent.
              </li>
              <li>
                <strong>Marketing/advertising cookies</strong> - for ad measurement and personalization. These run
                only with your consent.
              </li>
            </ul>
            <p className="mt-3">
              You can manage preferences at any time via the cookie banner or your browser settings. For details, see
              our Cookie Policy. We use Google Analytics and may use Google Ads tags. These tools use cookies and
              similar technologies to measure performance and (where consented) personalize ads. We only activate
              non-essential cookies after your consent. Learn more about how Google processes data: Google Privacy
              Policy. You can change or withdraw your consent at any time via Cookie settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">6) Who we share data with</h2>
            <p className="mt-2">
              We share personal data only with trusted recipients, under contracts that protect your data and limit
              use to our instructions.
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Payment processor</strong> (e.g., Stripe, Inc. and/or Stripe Payments Europe): card
                processing, fraud/risk management, and refunds. Stripe may act as an independent controller for parts
                of the processing (see Stripe&apos;s own privacy notice).
              </li>
              <li>
                <strong>Hosting &amp; infrastructure:</strong> web hosting, CDN, and security services (e.g., DDoS
                protection).
              </li>
              <li>
                <strong>Email ticket delivery:</strong> email service provider(s) to send order confirmations and PDF
                tickets.
              </li>
              <li>
                <strong>Customer support tools:</strong> live chat/helpdesk tools to handle your requests.
              </li>
              <li>
                <strong>Analytics &amp; tag management:</strong> tools that collect aggregated usage data (only with
                your consent).
              </li>
              <li>
                <strong>Google Ireland Limited</strong> (Gordon House, Barrow Street, Dublin 4, Ireland) - analytics
                and advertising tags (Google Analytics/Google Ads). Privacy: Google Privacy Policy.
              </li>
              <li>
                <strong>Professional advisors &amp; authorities:</strong> accountants, auditors, or regulators/courts
                when required by law.
              </li>
            </ul>
            <p className="mt-3 font-semibold">We do not sell your personal data.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">7) International data transfers</h2>
            <p className="mt-2">
              Some providers may process data outside the EEA/UK (e.g., in the US). Where this happens, we rely on an
              adequacy decision (if available) or on Standard Contractual Clauses (SCCs) and implement supplementary
              safeguards as needed to protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">8) Data retention</h2>
            <p className="mt-2">
              We keep data only as long as necessary for the purposes described above, and to meet legal/defense
              requirements:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Orders, invoices, and payment records:</strong> retained for up to 8 years to comply with
                Estonian/EU accounting and tax laws.
              </li>
              <li>
                <strong>Customer support communications:</strong> typically 3 years after resolution (unless needed
                longer for legal claims).
              </li>
              <li>
                <strong>Marketing data:</strong> until you unsubscribe or after 24 months of inactivity.
              </li>
              <li>
                <strong>Analytics data:</strong> per tool settings (commonly 14-26 months) or until
                anonymized/aggregated.
              </li>
              <li>
                <strong>Server logs &amp; security records:</strong> typically 12 months, unless needed longer to
                investigate incidents.
              </li>
            </ul>
            <p className="mt-3">When retention periods expire, we delete or irreversibly anonymize the data.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">9) Your privacy rights (EEA/UK)</h2>
            <p className="mt-2">Subject to legal limits, you can:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Access</strong> your personal data and get a copy.
              </li>
              <li>
                <strong>Rectify</strong> inaccurate or incomplete data.
              </li>
              <li>
                <strong>Erase</strong> data (right to be forgotten) where GDPR allows.
              </li>
              <li>
                <strong>Restrict processing</strong> in certain cases.
              </li>
              <li>
                <strong>Object to processing</strong> based on legitimate interests or to direct marketing.
              </li>
              <li>
                <strong>Portability</strong> - receive data you provided to us in a structured, commonly used,
                machine-readable format and transmit it to another controller where technically feasible.
              </li>
              <li>
                <strong>Withdraw consent</strong> at any time (for consent-based processing).
              </li>
            </ul>
            <p className="mt-3">
              To exercise your rights, contact us at the email above. We may need to verify your identity.
              <br />
              If you believe your rights have been violated, you can lodge a complaint with your local supervisory
              authority. In Estonia, this is the Estonian Data Protection Inspectorate. You may also seek a remedy
              before the competent courts.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">10) Security</h2>
            <p className="mt-2">
              We implement technical and organizational measures to protect personal data, including encryption in
              transit (TLS), access controls, least-privilege policies, and regular monitoring. However, no online
              service can guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">11) Children</h2>
            <p className="mt-2">
              Our Services are intended for adults and general audiences. We do not knowingly collect personal data
              from children under 16. If you believe a child has provided us data, contact us to delete it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">12) Automated decision-making</h2>
            <p className="mt-2">
              We do not use automated decision-making that produces legal or similarly significant effects about you
              without human involvement. Our payment processor may perform automated fraud/risk checks; if such checks
              affect your transaction, you can contact us to request a human review.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">13) Third-party links</h2>
            <p className="mt-2">
              The Website may contain links to third-party sites. We are not responsible for their privacy practices.
              Please review their policies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">14) Changes to this Policy</h2>
            <p className="mt-2">
              We may update this Policy to reflect legal, technical, or business changes. The updated version will be
              posted here with a new &ldquo;Last updated&rdquo; date. If changes are material, we will take
              appropriate steps to notify you (e.g., banner or email, where required).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">15) Contact us</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Data Controller:</strong> TicketCompass OÜ
              </li>
              <li>
                <strong>Email:</strong> info@paristourpass.com
              </li>
              <li>
                <strong>Postal address:</strong> Karamelli tn 2, 11317 Kesklinna linnaosa, Tallinn, Estonia
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
