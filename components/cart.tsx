'use client'

import { createContext, useContext, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
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
  clear: () => void
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
      clear: () => setLines([]),
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

const ZONES = [
  {
    id: 'phase1',
    label: 'Bahria Phase 1',
    sectors: 'Sector A, B, B1, B2, C, C1, C2, C3, E',
    fee: 200,
  },
  {
    id: 'phase2',
    label: 'Bahria Phase 2',
    sectors: 'Sector F, F1 Extension, C1 ExtensionG, H, I, J, K, L, M, N, O, P',
    fee: 150,
  },
] as const

type ZoneId = (typeof ZONES)[number]['id']
type PayMethod = 'cod' | 'online'

const EASYPAISA = { title: 'Harun Amjad Khan', number: '03495430119' }
const RECEIPT_KEY = 'ambes-receipt'
const AWAIT_KEY = 'ambes-await'
const LEFT_KEY = 'ambes-left'
const THANKS_KEY = 'ambes-thanks'

type Receipt = {
  lines: CartLine[]
  itemsTotal: number
  deliveryFee: number
  total: number
  name: string
  phone: string
  method: 'pickup' | 'delivery'
  zoneLabel: string | null
  address: string
  payment: PayMethod
}

function orderMessage(receipt: Receipt) {
  const items = receipt.lines.map((line) => `• ${line.name} x${line.qty} — ${formatPrice(line.price * line.qty)}`).join('\n')
  const where =
    receipt.method === 'pickup'
      ? `Pickup: ${CAFE_ADDRESS}`
      : `Delivery: ${receipt.zoneLabel}\nAddress: ${receipt.address.trim()}\nDelivery fee: ${formatPrice(receipt.deliveryFee)}`
  const payment =
    receipt.payment === 'cod'
      ? 'Payment: COD (Cash on Delivery)'
      : `Payment: Online Payment\nEasyPaisa\nAccount Title: ${EASYPAISA.title}\nAccount Number: ${EASYPAISA.number}`
  return [
    'New order — Ambes Thursday',
    CAFE_ADDRESS,
    '',
    items,
    '',
    `Subtotal: ${formatPrice(receipt.itemsTotal)}`,
    ...(receipt.deliveryFee ? [`Delivery: ${formatPrice(receipt.deliveryFee)}`] : []),
    `Total: ${formatPrice(receipt.total)}`,
    '',
    `Name: ${receipt.name.trim()}`,
    `Phone: ${receipt.phone.trim()}`,
    where,
    payment,
  ].join('\n')
}

function CartDrawer() {
  const cart = useCart()
  const { open, closeCart, lines, setQty, total } = cart
  const cartRef = useRef(cart)
  cartRef.current = cart
  const [mounted, setMounted] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [method, setMethod] = useState<'pickup' | 'delivery'>('pickup')
  const [zone, setZone] = useState<ZoneId | ''>('')
  const [address, setAddress] = useState('')
  const [payment, setPayment] = useState<PayMethod | ''>('')
  const [receipt, setReceipt] = useState<Receipt | null>(null)

  const zoneInfo = ZONES.find((item) => item.id === zone)
  const deliveryFee = method === 'delivery' && zoneInfo ? zoneInfo.fee : 0
  const grand = total + deliveryFee

  function showThanks() {
    const raw = sessionStorage.getItem(RECEIPT_KEY)
    if (!raw) return
    try {
      setReceipt(JSON.parse(raw) as Receipt)
    } catch {
      return
    }
    cartRef.current.clear()
    cartRef.current.openCart()
    sessionStorage.removeItem(AWAIT_KEY)
    sessionStorage.removeItem(LEFT_KEY)
    sessionStorage.setItem(THANKS_KEY, '1')
  }

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return
    if (sessionStorage.getItem(THANKS_KEY) === '1' || sessionStorage.getItem(AWAIT_KEY) === '1') showThanks()
    const onHide = () => {
      if (document.visibilityState === 'hidden' && sessionStorage.getItem(AWAIT_KEY) === '1') {
        sessionStorage.setItem(LEFT_KEY, '1')
      }
    }
    const onShow = () => {
      if (document.visibilityState !== 'visible') return
      if (sessionStorage.getItem(AWAIT_KEY) === '1' && sessionStorage.getItem(LEFT_KEY) === '1') showThanks()
    }
    const onPageShow = () => {
      if (sessionStorage.getItem(AWAIT_KEY) === '1') showThanks()
    }
    document.addEventListener('visibilitychange', onHide)
    document.addEventListener('visibilitychange', onShow)
    window.addEventListener('pageshow', onPageShow)
    return () => {
      document.removeEventListener('visibilitychange', onHide)
      document.removeEventListener('visibilitychange', onShow)
      window.removeEventListener('pageshow', onPageShow)
    }
    // showThanks reads the latest cart through a ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, closeCart])

  useEffect(() => {
    if (!mounted) return
    let leftAt = 0
    const markLeft = () => {
      if (sessionStorage.getItem(AWAIT_KEY) !== '1') return
      sessionStorage.setItem(LEFT_KEY, '1')
      leftAt = Date.now()
    }
    const onFocus = () => {
      if (Date.now() - leftAt < 600) return
      if (sessionStorage.getItem(AWAIT_KEY) === '1' && sessionStorage.getItem(LEFT_KEY) === '1') showThanks()
    }
    window.addEventListener('blur', markLeft)
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('blur', markLeft)
      window.removeEventListener('focus', onFocus)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  function dismissThanks() {
    setReceipt(null)
    sessionStorage.removeItem(RECEIPT_KEY)
    sessionStorage.removeItem(THANKS_KEY)
    sessionStorage.removeItem(AWAIT_KEY)
    sessionStorage.removeItem(LEFT_KEY)
    closeCart()
  }

  function checkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!lines.length || !payment) return
    if (method === 'delivery' && !zoneInfo) return
    const next: Receipt = {
      lines,
      itemsTotal: total,
      deliveryFee,
      total: grand,
      name,
      phone,
      method,
      zoneLabel: method === 'delivery' && zoneInfo ? `${zoneInfo.label} (${zoneInfo.sectors})` : null,
      address,
      payment,
    }
    sessionStorage.setItem(RECEIPT_KEY, JSON.stringify(next))
    sessionStorage.setItem(AWAIT_KEY, '1')
    sessionStorage.removeItem(LEFT_KEY)
    sessionStorage.removeItem(THANKS_KEY)
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(orderMessage(next))}`, '_blank', 'noopener,noreferrer')
  }

  if (!mounted) return null

  return createPortal(
    <>
      <AnimatePresence>
        {receipt && !open && (
          <motion.button
            type="button"
            onClick={() => cart.openCart()}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="fixed bottom-5 right-5 z-[60] rounded-full bg-primary px-5 py-3 font-serif text-base text-primary-foreground shadow-[0_16px_40px_-12px_rgba(74,44,42,0.55)]"
          >
            Your order
          </motion.button>
        )}
      </AnimatePresence>
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
                {receipt ? 'Thank you' : 'Your order'}
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
              {receipt ? (
                <ThankYou receipt={receipt} />
              ) : lines.length === 0 ? (
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

              {!receipt && (
                <p className="mt-8 rounded-2xl bg-muted px-4 py-3 text-sm leading-relaxed">
                  <span className="font-semibold">Cafe · </span>
                  {CAFE_ADDRESS}
                </p>
              )}

              {!receipt && lines.length > 0 && (
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
                  <fieldset>
                    <legend className="mb-2 text-sm">Pickup or delivery</legend>
                    <div className="flex gap-2 text-sm">
                    {(['pickup', 'delivery'] as const).map((option) => (
                      <label
                        key={option}
                        className={`flex flex-1 cursor-pointer items-center justify-center rounded-full border px-3 py-2.5 font-serif capitalize ${method === option ? 'border-foreground bg-primary text-primary-foreground' : 'border-border'}`}
                      >
                        <input
                          type="radio"
                          name="method"
                          value={option}
                          checked={method === option}
                          onChange={() => setMethod(option)}
                          className="sr-only"
                        />
                        {option}
                      </label>
                    ))}
                    </div>
                  </fieldset>
                  {method === 'delivery' && (
                    <>
                      <fieldset className="flex flex-col gap-2">
                        <legend className="mb-1 text-sm">Delivery area</legend>
                        {ZONES.map((item) => (
                          <label
                            key={item.id}
                            className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm ${zone === item.id ? 'border-foreground bg-muted' : 'border-border'}`}
                          >
                            <input
                              type="radio"
                              name="zone"
                              value={item.id}
                              required
                              checked={zone === item.id}
                              onChange={() => setZone(item.id)}
                              className="sr-only"
                            />
                            <span className="flex items-start justify-between gap-3">
                              <span>
                                <span className="block font-semibold">{item.label}</span>
                                <span className="mt-1 block text-muted-foreground">{item.sectors}</span>
                              </span>
                              <span className="shrink-0 font-semibold">{formatPrice(item.fee)}</span>
                            </span>
                          </label>
                        ))}
                      </fieldset>
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
                    </>
                  )}
                  <fieldset className="flex flex-col gap-2">
                    <legend className="mb-1 text-sm">Payment method</legend>
                    {(
                      [
                        ['cod', 'COD (Cash on Delivery)'],
                        ['online', 'Online Payment'],
                      ] as const
                    ).map(([value, label]) => (
                      <label
                        key={value}
                        className={`cursor-pointer rounded-full border px-4 py-2.5 text-sm ${payment === value ? 'border-foreground bg-primary text-primary-foreground' : 'border-border'}`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={value}
                          required
                          checked={payment === value}
                          onChange={() => setPayment(value)}
                          className="sr-only"
                        />
                        {label}
                      </label>
                    ))}
                  </fieldset>
                  {payment === 'online' && (
                    <div className="rounded-2xl bg-muted px-4 py-3 text-sm leading-relaxed">
                      <p className="font-semibold">EasyPaisa</p>
                      <p>Account Title: {EASYPAISA.title}</p>
                      <p>Account Number: {EASYPAISA.number}</p>
                    </div>
                  )}
                </form>
              )}
            </div>

            {receipt ? (
              <div className="border-t border-border px-5 py-5">
                <button
                  type="button"
                  onClick={dismissThanks}
                  className="w-full rounded-full bg-primary py-4 font-serif text-base font-medium text-primary-foreground transition-colors hover:bg-strawberry"
                >
                  Done
                </button>
              </div>
            ) : (
              lines.length > 0 && (
                <div className="border-t border-border px-5 py-5">
                  {deliveryFee > 0 && (
                    <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                      <span>Delivery</span>
                      <span>{formatPrice(deliveryFee)}</span>
                    </div>
                  )}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="font-serif text-2xl">{formatPrice(grand)}</span>
                  </div>
                  <button
                    type="submit"
                    form="checkout"
                    className="w-full rounded-full bg-primary py-4 font-serif text-base font-medium text-primary-foreground transition-colors hover:bg-strawberry"
                  >
                    Checkout
                  </button>
                </div>
              )
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
    </>,
    document.body,
  )
}

function ThankYou({ receipt }: { receipt: Receipt }) {
  return (
    <div>
      <p className="font-serif text-4xl leading-tight">Thank you for your order</p>
      <p className="mt-3 text-lg text-muted-foreground">Your order is preparing.</p>
      <ul className="mt-8 flex flex-col gap-3 border-t border-border pt-6 text-sm">
        {receipt.lines.map((line) => (
          <li key={line.id} className="flex justify-between gap-4">
            <span>
              {line.name} <span className="text-muted-foreground">x{line.qty}</span>
            </span>
            <span>{formatPrice(line.price * line.qty)}</span>
          </li>
        ))}
      </ul>
      <dl className="mt-6 flex flex-col gap-2 border-t border-border pt-6 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Name</dt>
          <dd>{receipt.name}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Phone</dt>
          <dd>{receipt.phone}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">{receipt.method === 'pickup' ? 'Pickup' : 'Delivery'}</dt>
          <dd className="text-right">{receipt.method === 'pickup' ? CAFE_ADDRESS : receipt.address}</dd>
        </div>
        {receipt.zoneLabel && (
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Area</dt>
            <dd className="text-right">{receipt.zoneLabel}</dd>
          </div>
        )}
        {receipt.deliveryFee > 0 && (
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Delivery fee</dt>
            <dd>{formatPrice(receipt.deliveryFee)}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Payment</dt>
          <dd>{receipt.payment === 'cod' ? 'COD (Cash on Delivery)' : 'Online Payment'}</dd>
        </div>
        {receipt.payment === 'online' && (
          <div className="rounded-2xl bg-muted px-4 py-3 leading-relaxed">
            <p className="font-semibold">EasyPaisa</p>
            <p>Account Title: {EASYPAISA.title}</p>
            <p>Account Number: {EASYPAISA.number}</p>
          </div>
        )}
        <div className="flex justify-between gap-4 pt-2 font-serif text-2xl">
          <dt>Total</dt>
          <dd>{formatPrice(receipt.total)}</dd>
        </div>
      </dl>
    </div>
  )
}
