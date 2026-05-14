import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CookieBanner } from '@/components/cookie-banner'
import { GoogleTags } from '@/components/google-tags'
import { LanguageProvider } from '@/components/language-provider'
import { TiktokPixel } from '@/components/tiktok-pixel'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'Paris Tickets | Louvre, Eiffel Tower & Seine Cruise Combos',
  description: 'Book Louvre Museum, Eiffel Tower, Seine River Cruise, and Paris combo tickets online with instant confirmation.',
  generator: 'v0.app',
  keywords: ['Paris tickets', 'Louvre tickets', 'Eiffel Tower tickets', 'Seine River Cruise', 'combo tickets'],
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#1e3a5f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        <GoogleTags />
        <TiktokPixel />
        <LanguageProvider>
          {children}
          <CookieBanner />
        </LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
