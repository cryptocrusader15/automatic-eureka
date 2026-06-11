import { useEffect, useState } from 'react'

export default function Success() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const id = params.get('session_id')
    if (id) {
      fetch(`/api/checkout?session_id=${id}`).then(r => r.json()).then(setSession)
    }
  }, [])

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Thank you — your payment was successful</h1>
        <p className="text-gray-700 mb-4">We received your order. We'll contact you shortly with next steps.</p>
        {session && <pre className="text-left text-sm bg-gray-100 p-3 rounded overflow-auto">{JSON.stringify(session, null, 2)}</pre>}
      </div>
    </main>
  )
}
