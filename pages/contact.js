import Seo from '../components/Seo'
import Link from 'next/link'

export default function Contact() {
  return (
    <>
      <Seo title="Contact" description="Contact our sales team to request quotes or ask about our machinery." url={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/contact`} />
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="mb-4">
          <Link href="/" className="inline-flex items-center px-3 py-1 rounded bg-black text-white hover:opacity-90">← Back to home</Link>
        </div>
      </div>
      <div className="min-h-screen flex items-center justify-center px-6 py-10">
        <form
          action="https://formspree.io/f/xaqzoyjq"
          method="POST"
          className="w-full max-w-lg bg-white p-6 rounded shadow"
        >
          <h2 className="text-2xl mb-4">Request a Quote / Inquiry</h2>

          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input name="name" required className="w-full border rounded px-3 py-2" />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input type="email" name="email" required className="w-full border rounded px-3 py-2" />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Phone</label>
            <input name="phone" className="w-full border rounded px-3 py-2" />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Product / Model of interest</label>
            <input name="product" className="w-full border rounded px-3 py-2" />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Message</label>
            <textarea name="message" rows={5} className="w-full border rounded px-3 py-2" />
          </div>

          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Send Inquiry</button>
        </form>

        <aside className="ml-6 max-w-sm">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Contact Details</h3>
            <div>Phone: +1 (555) 123-4567</div>
            <div>Email: sales@example.com</div>
            <div className="mt-3 text-sm text-gray-600">For urgent inquiries call us or use the form. We'll respond within one business day.</div>
          </div>
        </aside>
      </div>
    </>
  )
}
