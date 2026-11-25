import '../styles/globals.css'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const isHome = router.pathname === '/'
  const wrapperStyle = !isHome ? { backgroundImage: "url('/images/otherground.jpg')" } : undefined

  return (
    <div className={!isHome ? 'min-h-screen bg-cover bg-center bg-no-repeat' : ''} style={wrapperStyle}>
      <Head>
        <link rel="icon" type="image/png" href="/images/logo.png" />
      </Head>
      <div className={!isHome ? 'min-h-screen bg-black/50' : ''}>
        <Component {...pageProps} />
      </div>
    </div>
  )
}
