"use client"

import Link from "next/link"
import { Mail, Phone, TriangleAlert } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function Footer() {
  const { t } = useLanguage()
  const legalHrefs = ["/privacy-policy", "/terms-of-service", "/cookie-policy"] as const
  const footerLinks = {
    tickets: t.footer.links.tickets.map((label) => ({ label, href: "#tickets" })),
    legal: t.footer.links.legal.filter((_, index) => index !== 2).map((label, index) => ({
      label,
      href: legalHrefs[index] ?? "/",
    })),
  }

  return (
    <footer id="contact" className="bg-[#1a365d]">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-4">
          {/* Brand & Contact */}
          <div className="lg:col-span-1">
            <Link href="/" className="mb-6 inline-flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d4a853]">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
                  <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.5l5.5 3.44v6.12L12 17.5l-5.5-3.44V7.94L12 4.5z"/>
                  <path d="M12 8a2 2 0 100 4 2 2 0 000-4z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight text-white">PARIS TOURS</span>
                <span className="text-[8px] tracking-[0.15em] text-white/50">By ParisTourPass.com</span>
              </div>
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-white/60">
              {t.footer.description}
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#d4a853]">
                {t.footer.tickets}
              </h3>
              <ul className="space-y-3">
                {footerLinks.tickets.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#d4a853]">
                {t.footer.information}
              </h3>
              <div className="space-y-3 text-sm text-white/60">
                <a
                  href="mailto:info@paristickets.com"
                  className="flex items-center gap-2.5 transition-colors hover:text-white"
                >
                  <Mail className="h-4 w-4" />
                  info@paristickets.com
                </a>
                <a
                  href="tel:+33123456789"
                  className="flex items-center gap-2.5 transition-colors hover:text-white"
                >
                  <Phone className="h-4 w-4" />
                  +33 1 23 45 67 89
                </a>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#d4a853]">
                {t.footer.legal}
              </h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#d4a853]/35 bg-gradient-to-r from-[#102746] via-[#143055] to-[#102746]">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="rounded-2xl border-2 border-[#d4a853]/60 bg-[#0f2643]/85 p-5 shadow-[0_0_0_1px_rgba(212,168,83,0.2),0_12px_28px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-2">
              <TriangleAlert className="h-5 w-5 text-[#f2cb73]" />
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#f2cb73]">Disclaimer</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-white/90">
            This website (paristourpass.com) operates as an independent provider of tourist services and is not
            affiliated with, sponsored by, authorized by, or operated by the Louvre Museum or any of its official
            managing entities. Our purpose is to enhance the visitor experience by offering independent services,
            including valid and official admission tickets and supplementary digital content such as audio guides.
            Ticket Validity: All tickets offered on this website are genuine and officially valid, procured through
            authorized distribution channels. Pricing: Our listed prices may incorporate additional costs covering
            management fees, early availability access, dedicated customer service, and the provision of digital
            materials. Trademarks: Trademarks, logos, and official names of the monuments mentioned are the exclusive
            property of their respective owners. They are used strictly for descriptive purposes only, with no intent
            to cause confusion or claim ownership. Operated by Puskár Gábor EV, Budapest Baross Tér 11/c, Pf 72,
            Hungary, Tax number: 57632778-1-36.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          {/* Payment Methods */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40">{t.footer.accept}</span>
            <div className="flex items-center gap-2">
              <div className="flex h-7 items-center rounded bg-white px-2">
                <span className="text-[10px] font-bold text-[#1a365d]">VISA</span>
              </div>
              <div className="flex h-7 items-center rounded bg-white px-2">
                <span className="text-[10px] font-bold text-[#1a365d]">MC</span>
              </div>
              <div className="flex h-7 items-center rounded bg-white px-2">
                <span className="text-[10px] font-bold text-[#1a365d]">AMEX</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Paris Tickets by ParisTourPass.com. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
