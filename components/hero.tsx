'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownRight, Sparkles } from 'lucide-react'

const ease = [0.22, 1, 0.36, 1] as const

function keepPlaying(video: HTMLVideoElement) {
  video.muted = true
  video.defaultMuted = true
  video.playsInline = true
  video.setAttribute('muted', '')
  video.setAttribute('playsinline', '')
  video.setAttribute('webkit-playsinline', 'true')
  const pending = video.play()
  if (pending) pending.catch(() => {})
}

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    keepPlaying(video)
    const play = () => keepPlaying(video)
    video.addEventListener('loadeddata', play)
    video.addEventListener('canplay', play)
    video.addEventListener('ended', play)
    const onVisible = () => {
      if (document.visibilityState === 'visible') play()
    }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('touchstart', play, { passive: true })
    window.addEventListener('pageshow', play)
    return () => {
      video.removeEventListener('loadeddata', play)
      video.removeEventListener('canplay', play)
      video.removeEventListener('ended', play)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('touchstart', play)
      window.removeEventListener('pageshow', play)
    }
  }, [])

  return (
    <section id="home" className="relative flex min-h-svh items-center overflow-hidden bg-[#1a0e0c] px-4 pb-20 pt-32 md:px-6 md:pb-28 md:pt-40">
      <video
        ref={videoRef}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        controls={false}
        disablePictureInPicture
        aria-hidden="true"
      >
        <source src="/hero-video/sansebestian.mp4" type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-black/60" aria-hidden="true" />

      <div className="relative mx-auto w-full max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease }}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground"
        >
          <Sparkles className="size-3.5 text-strawberry" aria-hidden="true" />
          Doha · Islamabad
        </motion.p>

        <h1 className="mt-7 max-w-3xl text-balance font-serif text-5xl font-normal leading-[0.95] text-primary-foreground sm:text-6xl lg:text-7xl">
          {['Craving', 'Something'].map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 + i * 0.1, ease }}
              className="mr-[0.25em] inline-block"
            >
              {word}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease }}
            className="inline-block font-serif font-normal italic text-strawberry"
          >
            Extraordinary?
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease }}
          className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-primary-foreground/75"
        >
          From Doha to Islamabad. Premium Desserts &amp; Savory Delights, baked and fried fresh every single day.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <motion.a
            href="#menu"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 font-serif text-base font-medium text-primary-foreground transition-colors hover:bg-strawberry"
          >
            Explore the Menu
            <ArrowDownRight className="size-4" aria-hidden="true" />
          </motion.a>
          <a
            href="#locations"
            className="rounded-full border border-primary-foreground/35 px-7 py-4 font-serif text-base font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
          >
            Find a Cafe
          </a>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-primary-foreground/20 pt-8"
        >
          {[
            { value: '60+', label: 'Menu items' },
            { value: '2', label: 'Cafes' },
            { value: '2', label: 'Countries' },
          ].map((stat) => (
            <div key={stat.label}>
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-serif text-3xl italic text-primary-foreground">{stat.value}</dd>
              <dd className="mt-1 text-xs uppercase tracking-[0.15em] text-primary-foreground/60">{stat.label}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}
