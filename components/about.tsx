'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Cake, Drumstick, Heart } from 'lucide-react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { Reveal } from '@/components/reveal'

const pillars = [
  { icon: Cake, title: 'Baked in-house', text: 'Cheesecakes, tres leches and rolls made from scratch, every morning.' },
  { icon: Drumstick, title: 'Bold savory', text: 'Five signature flavors, from Korean Chatka to our AMBES Hot.' },
  { icon: Heart, title: 'Made to share', text: 'Whole cakes and family buckets for every kind of celebration.' },
]

export function About() {
  return (
    <section id="about" className="px-4 py-24 md:px-6 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-strawberry">About</p>
          <h2 className="mt-4 text-balance font-serif text-4xl font-normal leading-[1.05] md:text-5xl">
            A little cafe with a <span className="font-serif font-normal italic">big sweet tooth</span>
          </h2>
          <AboutPhoto />
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Ambes Thursday started with one idea: the feeling of a Thursday evening, when the week is almost done and
            you deserve something good. Today we bring that feeling from Doha to Islamabad with slow-baked desserts and
            unapologetically saucy savory bites.
          </p>
          <ul className="mt-10 flex flex-col gap-6">
            {pillars.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-5 border-t border-border pt-6">
                <Icon className="mt-0.5 size-5 shrink-0 text-strawberry" strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}

function AboutPhoto() {
  const frame = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const spring = { stiffness: 160, damping: 18 }
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), spring)
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-10, 10]), spring)
  const shiftX = useSpring(useTransform(px, [-0.5, 0.5], [-16, 16]), spring)
  const shiftY = useSpring(useTransform(py, [-0.5, 0.5], [-16, 16]), spring)

  function move(event: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return
    const box = frame.current?.getBoundingClientRect()
    if (!box) return
    px.set((event.clientX - box.left) / box.width - 0.5)
    py.set((event.clientY - box.top) / box.height - 0.5)
  }

  return (
    <div className="mt-8 [perspective:1000px] lg:mt-10">
      <motion.div
        ref={frame}
        onMouseMove={move}
        onMouseLeave={() => {
          px.set(0)
          py.set(0)
        }}
        style={reduce ? undefined : { rotateX, rotateY }}
        className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-muted shadow-[0_28px_70px_-36px_rgba(74,44,42,0.55)]"
      >
        <motion.div className="absolute -inset-6" style={reduce ? undefined : { x: shiftX, y: shiftY }}>
          <Image
            src="/images/cinnamon-roll.png"
            alt="Cinnamon roll with cream cheese glaze from the Ambes Thursday kitchen"
            fill
            sizes="(min-width: 1024px) 520px, 100vw"
            className="object-cover"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
