import { useRouter } from 'next/router'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { formatNaira } from '../../lib/formatCurrency'

export default function ProductPage() {
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState(null)
  const [currentImage, setCurrentImage] = useState(0)
  const touchStartX = useRef(null)

  useEffect(() => {
    if (!id) return
    fetch('/api/products')
      .then((r) => r.json())
      .then((list) => setProduct(list.find((p) => String(p.id) === String(id))))
      .catch((err) => console.error(err))
  }, [id])

  useEffect(() => {
    setCurrentImage(0)
  }, [product])

  if (!product) return <div className="p-8">Loading...</div>

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : product.image
      ? [product.image]
      : ['/images/logo.png']

  const prevImage = () => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length)

  const onTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX
  }

  const onTouchEnd = (event) => {
    if (touchStartX.current === null) return
    const endX = event.changedTouches[0].clientX
    const delta = touchStartX.current - endX
    if (delta > 50) nextImage()
    if (delta < -50) prevImage()
    touchStartX.current = null
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white/10 border border-white/10 backdrop-blur-sm p-6 rounded shadow-lg shadow-black/10 text-white">
        <div className="flex items-center justify-between mb-4 gap-3">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <button
            type="button"
            onClick={() => router.push('/products')}
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
          >
            Close
          </button>
        </div>

        <div className="relative rounded-3xl bg-slate-900/80 mb-5 flex items-center justify-center">
          <img
            src={images[currentImage]}
            alt={`${product.title} image ${currentImage + 1}`}
            className="w-full h-auto max-h-[520px] object-contain mx-auto"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          />
          <button
            type="button"
            onClick={prevImage}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white hover:bg-black/60"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={nextImage}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 px-3 py-2 text-white hover:bg-black/60"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((_, index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full transition ${currentImage === index ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>

        <p className="text-slate-200 mb-4">{product.description}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-bold text-sm sm:text-base mb-1">Price: {formatNaira(product.price)}</p>
            <p className="text-xs sm:text-sm text-gray-400">SKU: {product.sku}</p>
          </div>
          <div className="flex gap-2">
            <button data-test="add-to-cart" onClick={() => {
              const raw = localStorage.getItem('cart')
              const cart = raw ? JSON.parse(raw) : {}
              cart[product.id] = (cart[product.id] || 0) + 1
              localStorage.setItem('cart', JSON.stringify(cart))
              alert('Added to cart')
            }} className="flex-shrink-0 px-3 py-2 text-xs sm:text-sm bg-green-600 text-white rounded">Add to cart</button>
            <Link href="/cart" className="flex-shrink-0 px-3 py-2 text-xs sm:text-sm bg-slate-200 text-slate-900 rounded hover:bg-slate-300 transition">Go to cart</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
