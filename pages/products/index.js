import Link from 'next/link'
import { useEffect, useState } from 'react'
import { formatNaira } from '../../lib/formatCurrency'

export default function Products() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then(setProducts)
      .catch((err) => console.error(err))
  }, [])

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))]

  const filtered = products.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || (p.description || '').toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'All' || p.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative mb-6">
          <Link href="/" className="absolute left-0 top-0 text-sm text-slate-300 hover:underline">← Back to home</Link>
          <Link href="/cart" className="absolute right-0 top-0 rounded-full bg-black/80 px-3 py-2 text-sm text-white hover:bg-black transition">View cart</Link>
          <h1 className="text-3xl font-bold uppercase text-center">Products</h1>
        </div>

        <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="w-full border rounded px-3 py-2 flex-1" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full sm:w-auto border rounded px-3 py-2">
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <article key={p.id} className="bg-white/10 border border-white/10 backdrop-blur-sm p-4 rounded shadow-lg shadow-black/10">
              <img src={p.image} alt={p.title} className="h-40 w-full object-cover mb-3 rounded" />
              <h2 className="text-sm sm:text-lg md:text-xl font-semibold text-white">{p.title}</h2>
              <p className="text-xs sm:text-sm text-slate-300">SKU: {p.sku}</p>
              <p className="mt-2 text-xs sm:text-sm font-bold text-white">{formatNaira(p.price)}</p>
              <div className="flex items-center justify-between mt-3 gap-2">
                <Link href={`/products/${p.id}`} className="text-xs sm:text-sm text-blue-600">View details</Link>
                <button data-test="add-to-cart" onClick={() => {
                  const raw = localStorage.getItem('cart')
                  const cart = raw ? JSON.parse(raw) : {}
                  cart[p.id] = (cart[p.id] || 0) + 1
                  localStorage.setItem('cart', JSON.stringify(cart))
                }} className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-green-600 text-white rounded">Add to cart</button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
