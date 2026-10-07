import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Karla, Playfair_Display } from 'next/font/google'
import { SmoothScroll } from '@/components/smooth-scroll'
import './globals.css'

const karla = Karla({
  subsets: ['latin'],
  variable: '--font-karla',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Ambes Thursday — Premium Desserts & Savory Delights',
  description:
    'From Doha to Islamabad. Ambes Thursday serves San Sebastian cheesecake, Tres Leches, Matilda fudge, Wilder Wings, fried chicken and more.',
  generator: 'v0.app',
  icons: {
    icon: '/logo/ambes-logo.png',
    apple: '/logo/ambes-logo.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FDF8F0',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${karla.variable} ${playfair.variable} bg-background`}>
      <body className="antialiased">
        <SmoothScroll>{children}</SmoothScroll>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
