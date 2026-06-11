import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Seo from '../components/Seo'

const ADMIN_USERNAME = 'alabama'
const ADMIN_PASSWORD = 'aladin'

export default function Login() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.localStorage.getItem('adminAuth') === 'true') {
      router.replace('/admin')
    }
  }, [router])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      window.localStorage.setItem('adminAuth', 'true')
      router.replace('/admin')
      return
    }
    setError('Invalid username or password')
  }

  return (
    <>
      <Seo title="Admin Login" description="Login to access the admin dashboard." url={`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login`} />
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white/10 border border-white/10 rounded-3xl p-8 shadow-xl shadow-black/40 backdrop-blur-md">
          <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
          <p className="text-sm text-slate-300 mb-6">Enter the admin credentials to access the product management dashboard.</p>
          {error && <div className="mb-4 rounded bg-red-500/10 border border-red-400/30 p-3 text-sm text-red-100">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-slate-100">
              Username
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-2 w-full rounded border border-white/10 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                placeholder="admin"
                autoComplete="username"
              />
            </label>
            <label className="block text-sm font-medium text-slate-100">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded border border-white/10 bg-slate-900 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </label>
            <button type="submit" className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition">
              Login
            </button>
          </form>
          <p className="mt-4 text-xs text-slate-500">Hardcoded admin credentials are already built into this demo.</p>
        </div>
      </main>
    </>
  )
}
