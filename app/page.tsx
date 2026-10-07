import { SiteHeader } from '@/components/site-header'
import { Hero } from '@/components/hero'
import { MenuShowcase } from '@/components/menu-showcase'
import { Marquee } from '@/components/marquee'
import { Locations } from '@/components/locations'
import { About } from '@/components/about'
import { SiteFooter } from '@/components/site-footer'
import { CartProvider } from '@/components/cart'

export default function Page() {
  return (
    <CartProvider>
      <SiteHeader />
      <main>
        <Hero />
        <MenuShowcase />
        <Marquee />
        <Locations />
        <About />
      </main>
      <SiteFooter />
    </CartProvider>
  )
}
