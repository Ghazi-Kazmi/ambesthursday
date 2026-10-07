'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Plus } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { featured, formatPrice, fullMenu, type FeaturedItem, type MenuTab } from '@/lib/menu-data'
import { useCart } from '@/components/cart'
import { cn } from '@/lib/utils'

const tabs: { id: MenuTab; label: string }[] = [
  { id: 'desserts', label: 'Desserts' },
  { id: 'savory', label: 'Savory Bites' },
]

export function MenuShowcase() {
  const [active, setActive] = useState<MenuTab>('desserts')
  const [showFull, setShowFull] = useState(false)
  const { add } = useCart()

  return (
    <section id="menu" className="px-4 py-24 md:px-6 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-strawberry">The Menu</p>
            <h2 className="mt-4 max-w-xl text-balance font-serif text-4xl font-normal leading-[1.05] md:text-5xl">
              Experience the taste of <span className="font-serif font-normal italic">Perfection</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div role="tablist" aria-label="Menu categories" className="flex rounded-full border border-border bg-card p-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  type="button"
                  id={`tab-${tab.id}`}
                  aria-selected={active === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => setActive(tab.id)}
                  className={cn(
                    'relative rounded-full px-6 py-2.5 font-serif text-sm font-medium transition-colors',
                    active === tab.id ? 'text-primary-foreground' : 'text-foreground/70 hover:text-foreground',
                  )}
                >
                  {active === tab.id && (
                    <motion.span
                      layoutId="menu-tab-pill"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{tab.label}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div id={`panel-${active}`} role="tabpanel" aria-labelledby={`tab-${active}`} className="mt-14">
          <AnimatePresence mode="wait">
            <motion.ul
              key={active}
              initial="hidden"
              animate="show"
              exit="exit"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.07 } },
                exit: { opacity: 0, y: 12, transition: { duration: 0.2 } },
              }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {featured[active].map((item) => (
                <MenuCard key={item.name} item={item} />
              ))}
            </motion.ul>
          </AnimatePresence>

          <div className="mt-14 flex justify-center">
            <button
              type="button"
              onClick={() => setShowFull((v) => !v)}
              aria-expanded={showFull}
              aria-controls="full-menu"
              className="group inline-flex items-center gap-2 rounded-full border border-foreground/20 px-6 py-3 font-serif text-base font-medium transition-colors hover:border-foreground hover:bg-foreground/5"
            >
              {showFull ? 'Hide' : 'View'} full {active === 'desserts' ? 'dessert' : 'savory'} menu
              <ChevronDown
                className={cn('size-4 transition-transform duration-300', showFull && 'rotate-180')}
                aria-hidden="true"
              />
            </button>
          </div>

          <AnimatePresence initial={false}>
            {showFull && (
              <motion.div
                id="full-menu"
                key={`full-${active}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-10 grid gap-x-12 gap-y-10 rounded-[2rem] border border-border bg-card p-6 sm:grid-cols-2 md:p-10 lg:grid-cols-3">
                  {fullMenu[active].map((cat) => (
                    <div key={cat.category}>
                      <h3 className="font-serif text-xl italic">{cat.category}</h3>
                      {cat.notes && <p className="mt-1 text-xs text-muted-foreground">{cat.notes}</p>}
                      <ul className="mt-4 flex flex-col gap-2.5">
                        {cat.items.map((it) => (
                          <li key={it.name} className="flex items-center gap-3 text-sm">
                            <span>{it.name}</span>
                            <span className="flex-1 border-b border-dotted border-foreground/20" aria-hidden="true" />
                            <span className="whitespace-nowrap font-semibold tabular-nums">{formatPrice(it.price)}</span>
                            <button
                              type="button"
                              onClick={() => add({ name: it.name, price: it.price })}
                              aria-label={`Add ${it.name} to cart`}
                              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-strawberry hover:text-primary-foreground"
                            >
                              <Plus className="size-3.5" aria-hidden="true" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function MenuCard({ item }: { item: FeaturedItem }) {
  const { add, qtyOf } = useCart()
  const qty = qtyOf(item.name, item.price)

  return (
    <motion.li
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      <motion.article
        whileHover="hover"
        initial="rest"
        animate="rest"
        variants={{ rest: { y: 0 }, hover: { y: -8 } }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="group flex h-full flex-col rounded-[2rem] border border-border bg-card p-3 transition-shadow duration-500 hover:shadow-[0_24px_60px_-20px_rgba(74,44,42,0.25)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-muted">
          <motion.div
            variants={{ rest: { scale: 1 }, hover: { scale: 1.08 } }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>
          {item.tag && (
            <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-strawberry backdrop-blur">
              {item.tag}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col px-3 pb-3 pt-5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-serif text-2xl leading-tight">{item.name}</h3>
            <p className="mt-1 whitespace-nowrap text-sm font-semibold tabular-nums">
              {item.fromPrice && <span className="mr-1 font-normal text-muted-foreground">from</span>}
              {formatPrice(item.price)}
            </p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
          <div className="mt-auto flex justify-end pt-5">
            <button
              type="button"
              onClick={() => add(item)}
              aria-label={`Add ${item.name} to cart`}
              className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground transition-colors duration-300 group-hover:bg-strawberry group-hover:text-primary-foreground"
            >
              {qty > 0 ? qty : <Plus className="size-4" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </motion.article>
    </motion.li>
  )
}
