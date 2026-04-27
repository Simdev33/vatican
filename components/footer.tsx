"use client"

import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function Footer() {
  const { t } = useLanguage()
  const footerLinks = {
    tickets: t.footer.links.tickets.map((label) => ({ label, href: "#tickets" })),
    info: t.footer.links.info.map((label) => ({ label, href: "#" })),
    legal: t.footer.links.legal.map((label) => ({ label, href: "#" })),
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
                <span className="text-lg font-bold leading-tight text-white">PARIS TICKETS</span>
                <span className="text-[8px] tracking-[0.15em] text-white/50">BY fil the szánshájn</span>
              </div>
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-white/60">
              {t.footer.description}
            </p>
            <div className="space-y-3">
              <a
                href="mailto:info@paristickets.com"
                className="flex items-center gap-2.5 text-sm text-white/60 transition-colors hover:text-[#d4a853]"
              >
                <Mail className="h-4 w-4" />
                info@paristickets.com
              </a>
              <a
                href="tel:+33123456789"
                className="flex items-center gap-2.5 text-sm text-white/60 transition-colors hover:text-[#d4a853]"
              >
                <Phone className="h-4 w-4" />
                +33 1 23 45 67 89
              </a>
              <p className="flex items-start gap-2.5 text-sm text-white/60">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                Paris City Center
                <br />
                France
              </p>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#d4a853]">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#d4a853]">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#d4a853]">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
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
              <ul className="space-y-3">
                {footerLinks.info.map((link) => (
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
              <div className="flex h-7 items-center rounded bg-white px-2">
                <span className="text-[10px] font-bold text-[#0070ba]">PayPal</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Paris Tickets by fil the szánshájn. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
