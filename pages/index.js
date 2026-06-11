import { useEffect, useState } from 'react'
import Link from 'next/link'
import Seo from '../components/Seo'
import { formatNaira } from '../lib/formatCurrency'

export default function Home() {
  const [products, setProducts] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAdmin(window.localStorage.getItem('adminAuth') === 'true')
    }
  }, [])

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : [])
      })
      .catch((error) => {
        console.error('Failed to load products:', error)
        setProducts([])
      })
  }, [])

  const featured = Array.isArray(products) ? products.slice(0, 6) : []

  return (
    <>
      <Seo title="Home" description="Supplier of heavy-duty industrial machinery. Browse machines, request quotes, and contact our sales team." url={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}`} />
      <main
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/images/background.jpg')` }}
      >
        <div className="absolute top-3 left-3 z-20">
          <img src="/images/logo.png" alt="ChrisFamous Logo" className="h-16 w-auto" />
        </div>
        <div className="absolute top-3 right-3 z-20 flex items-center gap-3">
          {isAdmin ? (
            <>
              <span className="hidden sm:inline rounded-full bg-yellow-500/15 px-3 py-2 text-xs font-semibold text-yellow-200">Admin signed in</span>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.localStorage.removeItem('adminAuth')
                    setIsAdmin(false)
                    window.location.href = '/'
                  }
                }}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20 transition">
              Login
            </Link>
          )}
        </div>
        <div className="min-h-screen bg-black/60 flex items-center justify-center px-4 sm:px-6">
          <div className="w-full max-w-4xl p-6 sm:p-10 text-center text-white">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-5 text-yellow-300 tracking-tight leading-tight">
              <span className="block">CHRISFAMOUS</span>
              <span className="block text-2xl sm:text-3xl md:text-5xl font-semibold">Machine World</span>
            </h1>
            <p className="mb-8 text-sm sm:text-base md:text-lg lg:text-xl text-slate-200">We provide robust, high-performance machinery for factories, workshops, and heavy industry. Trusted by professionals worldwide.</p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              <Link href="/products" className="min-w-[120px] px-4 py-2 bg-blue-600 hover:bg-blue-700 transition rounded text-white font-semibold text-sm sm:text-base">
                View Products
              </Link>
              <Link href="/contact" className="min-w-[120px] px-4 py-2 bg-slate-200 hover:bg-slate-300 transition rounded text-slate-900 font-semibold text-sm sm:text-base">
                Request a Quote
              </Link>
              <Link href="/about" className="w-full md:w-auto px-4 py-2 sm:px-8 sm:py-3 bg-yellow-500 hover:bg-yellow-600 transition rounded text-slate-900 font-semibold text-sm sm:text-base text-center">
                Learn About Us
              </Link>
            </div>
            {isAdmin && (
              <div className="mb-8 rounded-3xl border border-yellow-400/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100 shadow-sm shadow-yellow-500/10">
                You are currently logged in as admin. You can visit <Link href="/admin" className="font-semibold underline">the admin dashboard</Link> or log out from the top right.
              </div>
            )}

            <section className="w-full bg-white/10 border border-white/20 rounded-3xl p-6 sm:p-8 text-left shadow-xl shadow-black/20 mt-8">
              <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center text-white">Featured Products</h2>
              {featured.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-slate-950/20 p-6 text-slate-200 text-center">
                  Loading featured products...
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {featured.map((p) => (
                    <article key={p.id} className="bg-white/10 border border-white/10 backdrop-blur-sm p-4 rounded shadow-lg shadow-black/10">
                      <img src={p.image} alt={p.title} className="h-40 w-full object-cover mb-3 rounded" />
                      <h3 className="text-sm sm:text-lg md:text-xl font-semibold text-white">{p.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-300">SKU: {p.sku}</p>
                      <p className="mt-2 text-xs sm:text-sm font-bold text-white">{formatNaira(p.price)}</p>
                      <div className="flex items-center justify-between mt-3 gap-2">
                        <Link href={`/products/${p.id}`} className="text-xs sm:text-sm text-blue-400 hover:underline">View details</Link>
                        <button
                          data-test="add-to-cart"
                          onClick={() => {
                            const raw = localStorage.getItem('cart')
                            const cart = raw ? JSON.parse(raw) : {}
                            cart[p.id] = (cart[p.id] || 0) + 1
                            localStorage.setItem('cart', JSON.stringify(cart))
                          }}
                          className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-green-600 text-white rounded hover:bg-green-700 transition"
                        >
                          Add to cart
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  )
}
