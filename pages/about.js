import Seo from '../components/Seo'
import Link from 'next/link'

export default function About() {
  return (
    <>
      <Seo title="About Us" description="About our machinery company — experience, service, and quality." url={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/about`} />
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto bg-white/10 border border-white/20 rounded-3xl p-8 shadow-xl shadow-black/20 text-slate-100">
          <div className="mb-4">
            <Link href="/" className="text-sm text-slate-300 hover:underline">← Back to home</Link>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">About Our Company</h1>
          <p className="mb-4 text-slate-200">With decades of expertise in manufacturing and distribution, we supply industrial machinery to businesses of all sizes. Our team supports installation, maintenance, and training to ensure your operations run smoothly.</p>
          <h2 className="font-semibold mt-4 text-white">Our Services</h2>
          <ul className="list-disc pl-5 mt-2 space-y-2 text-slate-200">
            <li>Equipment supply and customization</li>
            <li>On-site installation and commissioning</li>
            <li>Maintenance contracts and spare parts</li>
          </ul>

          <section className="mt-8 bg-white/10 border border-white/20 rounded-3xl p-8 shadow-xl shadow-black/20">
            <h2 className="text-3xl font-semibold mb-4">Why choose us</h2>
            <ul className="list-disc pl-5 text-slate-100 space-y-3">
              <li>Durable, tested machinery with warranty options.</li>
              <li>Custom installation and after-sales service.</li>
              <li>Competitive pricing and flexible financing.</li>
            </ul>
          </section>
        </div>
      </main>
    </>
  )
}
