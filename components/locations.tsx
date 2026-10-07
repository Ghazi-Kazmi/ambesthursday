import { ArrowUpRight, MapPin } from 'lucide-react'
import { Reveal } from '@/components/reveal'

const locations = [
  {
    city: 'Islamabad',
    name: 'Mac3 Heights',
    address: 'Mac3 Heights, Sector G, Bahria Enclave, Islamabad, Pakistan',
  },
  {
    city: 'Doha',
    name: 'Al-Meshaf',
    address: 'Al-Meshaf, Al-Warkah, Doha, Qatar',
  },
]

export function Locations() {
  return (
    <section id="locations" className="px-4 py-24 md:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-strawberry">Locations</p>
          <h2 className="mt-4 text-balance font-serif text-4xl font-normal leading-[1.05] md:text-5xl">
            Find your nearest <span className="font-serif font-normal italic">Thursday</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            Two cities, one obsession. Drop by for a slice, stay for the wings.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-6 md:grid-cols-2">
          {locations.map((loc, i) => (
            <li key={loc.name}>
              <Reveal delay={i * 0.1} className="h-full">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col rounded-[2rem] border border-border bg-card p-8 transition-all duration-500 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-[0_24px_60px_-24px_rgba(74,44,42,0.3)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-full bg-accent text-strawberry">
                      <MapPin className="size-5" strokeWidth={1.5} aria-hidden="true" />
                    </span>
                    <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      {loc.city}
                    </span>
                  </div>
                  <h3 className="mt-10 font-serif text-3xl italic">{loc.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{loc.address}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-8 font-serif text-base font-medium">
                    Get directions
                    <ArrowUpRight
                      className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
