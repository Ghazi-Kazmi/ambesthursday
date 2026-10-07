'use client'

import { createContext, useContext, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { formatPrice } from '@/lib/menu-data'

export const CAFE_ADDRESS = 'Mac 3 Heights, Sector G, Bahria Enclave, Islamabad'
const WHATSAPP = '923476735263'

type CartLine = { id: string; name: string; price: number; qty: number }

type CartContextValue = {
  lines: CartLine[]
  count: number
  total: number
  open: boolean
  add: (item: { name: string; price: number }) => void
  setQty: (id: string, qty: number) => void
  openCart: () => void
  closeCart: () => void
  qtyOf: (name: string, price: number) => number
}

const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error('useCart must be used within CartProvider')
  return value
}

const lineId = (name: string, price: number) => `${name}::${price}`

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [open, setOpen] = useState(false)

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.qty, 0)
    const total = lines.reduce((sum, line) => sum + line.price * line.qty, 0)
    return {
      lines,
      count,
      total,
      open,
      add: (item) => {
        const id = lineId(item.name, item.price)
        setLines((prev) => {
          const found = prev.find((line) => line.id === id)
          if (!found) return [...prev, { id, name: item.name, price: item.price, qty: 1 }]
          return prev.map((line) => (line.id === id ? { ...line, qty: line.qty + 1 } : line))
        })
      },
      setQty: (id, qty) => {
        setLines((prev) =>
          qty < 1 ? prev.filter((line) => line.id !== id) : prev.map((line) => (line.id === id ? { ...line, qty } : line)),
        )
      },
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      qtyOf: (name, price) => lines.find((line) => line.id === lineId(name, price))?.qty ?? 0,
    }
  }, [lines, open])

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartFab />
      <CartDrawer />
    </CartContext.Provider>
  )
}

function CartFab() {
  const { count, open, openCart } = useCart()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {count > 0 && !open && (
        <motion.button
          type="button"
          onClick={openCart}
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          aria-label={`Open cart, ${count} items`}
          className="fixed bottom-5 right-5 z-[60] flex items-center gap-3 rounded-full bg-primary py-3 pl-4 pr-3 text-primary-foreground shadow-[0_16px_40px_-12px_rgba(74,44,42,0.55)]"
        >
          <ShoppingBag className="size-5" aria-hidden="true" />
          <span className="font-serif text-base">Cart</span>
          <motion.span
            key={count}
            initial={{ scale: 0.4 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 18 }}
            className="flex min-w-7 items-center justify-center rounded-full bg-strawberry px-2 py-1 text-sm font-semibold tabular-nums"
          >
            {count}
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function orderMessage(lines: CartLine[], total: number, name: string, phone: string, method: 'pickup' | 'delivery', address: string) {
  const items = lines.map((line) => `• ${line.name} x${line.qty} — ${formatPrice(line.price * line.qty)}`).join('\n')
  const where =
    method === 'pickup' ? `Pickup: ${CAFE_ADDRESS}` : `Delivery address: ${address.trim()}`
  return [
    'New order — Ambes Thursday',
    CAFE_ADDRESS,
    '',
    items,
    '',
    `Total: ${formatPrice(total)}`,
    '',
    `Name: ${name.trim()}`,
    `Phone: ${phone.trim()}`,
    where,
  ].join('\n')
}

function CartDrawer() {
  const { open, closeCart, lines, setQty, total } = useCart()
  const [mounted, setMounted] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [method, setMethod] = useState<'pickup' | 'delivery'>('pickup')
  const [address, setAddress] = useState('')

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closeCart])

  function checkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!lines.length) return
    const text = orderMessage(lines, total, name, phone, method, address)
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer')
  }

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[70] bg-black/50"
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col bg-background text-foreground shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-5">
              <h2 id="cart-title" className="flex items-center gap-3 font-serif text-3xl">
                <ShoppingBag className="size-7" strokeWidth={1.5} aria-hidden="true" />
                Your order
              </h2>
              <button
                type="button"
                onClick={closeCart}
                aria-label="Close"
                className="flex size-10 items-center justify-center rounded-full bg-muted"
              >
                <X className="size-5" />
              </button>
            </div>

            <div data-lenis-prevent className="flex-1 overflow-y-auto px-5 py-6">
              {lines.length === 0 ? (
                <p className="text-muted-foreground">Your cart is empty. Add something from the menu.</p>
              ) : (
                <ul className="flex flex-col gap-5">
                  {lines.map((line) => (
                    <li key={line.id} className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-serif text-xl leading-tight">{line.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{formatPrice(line.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label={`Decrease ${line.name}`}
                          onClick={() => setQty(line.id, line.qty - 1)}
                          className="flex size-8 items-center justify-center rounded-full bg-muted"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold tabular-nums">{line.qty}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${line.name}`}
                          onClick={() => setQty(line.id, line.qty + 1)}
                          className="flex size-8 items-center justify-center rounded-full bg-muted"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-8 rounded-2xl bg-muted px-4 py-3 text-sm leading-relaxed">
                <span className="font-semibold">Cafe · </span>
                {CAFE_ADDRESS}
              </p>

              {lines.length > 0 && (
                <form id="checkout" onSubmit={checkout} className="mt-6 flex flex-col gap-4">
                  <label className="flex flex-col gap-1.5 text-sm">
                    Name
                    <input
                      required
                      name="name"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="rounded-2xl border border-border bg-card px-4 py-3 outline-none focus:border-foreground"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm">
                    Phone number
                    <input
                      required
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      className="rounded-2xl border border-border bg-card px-4 py-3 outline-none focus:border-foreground"
                    />
                  </label>
                  <fieldset className="flex flex-col gap-2 text-sm">
                    <legend>Pickup or delivery</legend>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="method"
                        value="pickup"
                        checked={method === 'pickup'}
                        onChange={() => setMethod('pickup')}
                      />
                      Pickup
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="method"
                        value="delivery"
                        checked={method === 'delivery'}
                        onChange={() => setMethod('delivery')}
                      />
                      Delivery
                    </label>
                  </fieldset>
                  {method === 'delivery' && (
                    <label className="flex flex-col gap-1.5 text-sm">
                      Delivery address
                      <textarea
                        required
                        name="address"
                        rows={3}
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        className="resize-none rounded-2xl border border-border bg-card px-4 py-3 outline-none focus:border-foreground"
                      />
                    </label>
                  )}
                </form>
              )}
            </div>

            {lines.length > 0 && (
              <div className="border-t border-border px-5 py-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <span className="font-serif text-2xl">{formatPrice(total)}</span>
                </div>
                <button
                  type="submit"
                  form="checkout"
                  className="w-full rounded-full bg-primary py-4 font-serif text-base font-medium text-primary-foreground transition-colors hover:bg-strawberry"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
