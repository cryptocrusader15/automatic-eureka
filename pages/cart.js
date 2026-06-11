import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatNaira } from '../lib/formatCurrency'

function loadCart() {
  try {
    const raw = localStorage.getItem('cart')
    return raw ? JSON.parse(raw) : {}
  } catch (e) { return {} }
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart))
}

export default function Cart() {
  const [cart, setCart] = useState({})
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setCart(loadCart())
    fetch('/api/products').then(r => r.json()).then(setProducts)
  }, [])

  const items = Object.entries(cart).map(([id, qty]) => {
    const product = products.find((p) => String(p.id) === String(id)) || { title: 'Unknown', price: 0 }
    return { id, qty, product }
  })

  const subtotal = items.reduce((s, it) => s + (it.product.price || 0) * it.qty, 0)

  function updateQty(id, qty) {
    const next = { ...cart }
    if (qty <= 0) delete next[id]
    else next[id] = qty
    setCart(next)
    saveCart(next)
  }

  async function checkout() {
    setLoading(true)
    const lineItems = items.map((it) => ({ id: it.id, title: it.product.title, price: it.product.price, quantity: it.qty }))
    const res = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: lineItems }) })
    const body = await res.json()
    setLoading(false)
    if (body.url) {
      window.location = body.url
    } else {
      alert('Checkout failed')
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        {items.length === 0 && <div className="mb-4">Your cart is empty. <Link href="/products" className="text-blue-600">Browse products</Link></div>}

        <div className="space-y-4">
          {items.map((it) => (
            <div key={it.id} className="flex items-center justify-between border rounded p-3">
              <div>
                <div className="font-semibold">{it.product.title}</div>
                <div className="text-sm text-gray-600">{formatNaira(it.product.price)}</div>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min="0" value={it.qty} onChange={(e) => updateQty(it.id, Number(e.target.value))} className="w-20 border rounded px-2 py-1" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div className="text-lg">Subtotal: <span className="font-bold">{formatNaira(subtotal)}</span></div>
          <div>
            <button onClick={checkout} disabled={items.length === 0 || loading} className="px-4 py-2 bg-green-600 text-white rounded">{loading ? 'Processing...' : 'Checkout'}</button>
          </div>
        </div>
      </div>
    </main>
  )
}
