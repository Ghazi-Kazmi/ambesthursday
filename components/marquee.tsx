const words = Array.from({ length: 6 }, (_, i) => (i % 2 === 0 ? 'DOHA' : 'ISLAMABAD'))

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {words.map((word, i) => (
        <span key={i} className="flex items-center">
          <span className="text-outline px-6 font-serif text-6xl italic md:px-10 md:text-8xl">{word}</span>
          <span className="text-3xl text-strawberry md:text-5xl" aria-hidden="true">
            {'•'}
          </span>
        </span>
      ))}
    </div>
  )
}

export function Marquee() {
  return (
    <section aria-label="Doha and Islamabad" className="overflow-hidden border-y border-border py-8 md:py-12">
      <div className="flex w-max animate-marquee">
        <Row />
        <Row hidden />
      </div>
    </section>
  )
}
