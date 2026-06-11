import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { formatNaira } from '../lib/formatCurrency'

export default function Admin() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ title: '', price: '', sku: '', category: '', image: '', images: '', description: '' })
  const [uploading, setUploading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.localStorage.getItem('adminAuth') === 'true') {
      setAuthorized(true)
      fetch('/api/products')
        .then((r) => r.json())
        .then(setProducts)
    } else {
      router.replace('/login')
    }
  }, [router])

  if (!authorized) {
    return <div className="min-h-screen p-8 text-white">Redirecting to login...</div>
  }

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('adminAuth')
      router.replace('/')
    }
  }

  function refresh() {
    fetch('/api/products').then((r) => r.json()).then(setProducts)
  }

  async function addProduct(e) {
    e.preventDefault()
    const images = form.images
      .split(/[,\n]+/)
      .map((item) => item.trim())
      .filter(Boolean)

    const product = {
      ...form,
      price: Number(form.price),
      images: images.length ? images : undefined,
      image: form.image || images[0] || ''
    }

    const res = await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'add', product }) })
    const body = await res.json()
    if (body.ok !== false) {
      setForm({ title: '', price: '', sku: '', category: '', image: '', images: '', description: '' })
      setStatusMessage(`Product added: ${product.title}`)
      refresh()
      setTimeout(() => setStatusMessage(''), 4000)
    } else {
      setStatusMessage('Failed to add product. Please try again.')
      setTimeout(() => setStatusMessage(''), 4000)
    }
  }

  function downloadJSON() {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'products.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function replaceProducts(jsonText) {
    try {
      const parsed = JSON.parse(jsonText)
      await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'replace', products: parsed }) })
      refresh()
    } catch (e) {
      alert('Invalid JSON')
    }
  }

  return (
    <main className="min-h-screen p-8">
      <div className="flex items-center justify-between max-w-5xl mx-auto mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-slate-600">Manage products and export your product catalog.</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-slate-300 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-200 transition"
        >
          Logout
        </button>
      </div>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-3">Add Product</h2>
          <p className="text-sm text-gray-600 mb-4">Use this form to add products without editing `data/products.json` directly.</p>
          {statusMessage && <div className="mb-3 p-3 rounded bg-green-100 text-green-800">{statusMessage}</div>}
          <form onSubmit={addProduct}>
            <input className="w-full mb-2 border px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <input type="number" step="0.01" className="w-full mb-2 border px-3 py-2" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <input className="w-full mb-2 border px-3 py-2" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            <input className="w-full mb-2 border px-3 py-2" placeholder="Category" value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })} />

            <div className="mb-2">
              <label className="block mb-1">Image</label>
              <input type="text" className="w-full mb-2 border px-3 py-2" placeholder="Image path (e.g. /images/part.jpg)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files && e.target.files[0]
                if (!file) return
                setUploading(true)
                const reader = new FileReader()
                reader.onload = async () => {
                  const base64 = reader.result
                  const res = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename: file.name, data: base64 }) })
                  const body = await res.json()
                  if (body.ok) {
                    setForm({ ...form, image: body.path })
                  } else {
                    alert('Upload failed')
                  }
                  setUploading(false)
                }
                reader.readAsDataURL(file)
              }} />
              {uploading && <div className="text-sm text-gray-600">Uploading...</div>}
              {form.image && <div className="text-sm text-gray-600">Image: {form.image}</div>}
            </div>
            <div className="mb-2">
              <label className="block mb-1">Additional images</label>
              <textarea
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                className="w-full mb-2 border px-3 py-2"
                placeholder="Enter extra image paths, one per line or comma-separated"
                rows={4}
              />
              <p className="text-sm text-gray-500">Optional: add extra detail images for the product detail page.</p>
            </div>

            <textarea className="w-full mb-2 border px-3 py-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">Add</button>
          </form>
          <div className="mt-4">
            <button onClick={downloadJSON} className="px-3 py-2 bg-gray-200 rounded">Download JSON</button>
          </div>
        </section>

        <section className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-3">Current Products</h2>
          <ul className="space-y-3">
            {products.map((p) => (
              <li key={p.id} className="border rounded p-2">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-sm text-gray-600">{formatNaira(p.price)} — {p.sku}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <h3 className="font-semibold">Replace entire product list (paste JSON)</h3>
            <textarea id="replace-json" className="w-full h-24 border mb-2 px-3 py-2" />
            <div className="flex gap-2 mb-4">
              <button onClick={() => replaceProducts(document.getElementById('replace-json').value)} className="px-3 py-2 bg-red-500 text-white rounded">Replace</button>
              <button onClick={refresh} className="px-3 py-2 bg-gray-200 rounded">Refresh</button>
            </div>

            <h3 className="font-semibold">Or upload CSV</h3>
            <input type="file" accept="text/csv" onChange={(e) => {
              const file = e.target.files && e.target.files[0]
              if (!file) return
              const reader = new FileReader()
              reader.onload = async () => {
                const text = reader.result
                const lines = text.split(/\r?\n/).filter(Boolean)
                if (lines.length < 2) { alert('CSV has no data'); return }
                const headers = lines[0].split(',').map(h => h.trim())
                const rows = lines.slice(1).map(line => {
                  const cols = line.split(',')
                  const obj = {}
                  headers.forEach((h, i) => { obj[h] = cols[i] ? cols[i].trim() : '' })
                  if (obj.price) obj.price = Number(obj.price)
                  return obj
                })
                await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'replace', products: rows }) })
                refresh()
              }
              reader.readAsText(file)
            }} />
          </div>
        </section>
      </div>
    </main>
  )
}
