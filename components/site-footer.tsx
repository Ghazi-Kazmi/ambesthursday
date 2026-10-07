import Image from 'next/image'
import { ArrowUpRight, Mail, MapPin } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const socials = ['Instagram', 'Facebook', 'TikTok']

export function SiteFooter() {
  return (
    <footer className="bg-primary px-4 pb-10 pt-24 text-primary-foreground md:px-6 md:pt-32">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-balance text-center font-serif text-4xl italic leading-tight md:text-6xl">
            Every day is an Ambes Thursday.
          </p>
        </Reveal>

        <div className="mt-20 grid gap-12 border-t border-primary-foreground/15 pt-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <Image
                src="/logo/ambes-logo.png"
                alt=""
                width={96}
                height={96}
                className="size-20 shrink-0 rounded-full object-cover sm:size-24"
              />
              <p className="font-serif text-2xl font-medium leading-none sm:text-3xl">Ambes Thursday</p>
            </div>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
              Premium desserts &amp; savory delights in Doha and Islamabad.
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-foreground/60">Contact</h2>
            <ul className="mt-5 flex flex-col gap-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <span>Mac3 Heights, Sector G, Bahria Enclave, Islamabad</span>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <span>Al-Meshaf, Al-Warkah, Doha</span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                <a href="mailto:hello@ambesthursday.com" className="hover:text-accent">
                  hello@ambesthursday.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] text-primary-foreground/60">Follow</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {socials.map((s) => (
                <li key={s}>
                  <a href="#" className="group inline-flex items-center gap-1.5 text-sm transition-colors hover:text-accent">
                    {s}
                    <ArrowUpRight
                      className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-3 text-xs text-primary-foreground/50 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Ambes Thursday. All rights reserved.</p>
          <p>Doha · Islamabad</p>
        </div>
      </div>
    </footer>
  )
}
