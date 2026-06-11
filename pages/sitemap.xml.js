import fs from 'fs'
import path from 'path'

export async function getServerSideProps({ res }) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const pages = ['/', '/products', '/about', '/contact']

  const dataFile = path.join(process.cwd(), 'data', 'products.json')
  let products = []
  try {
    const raw = fs.readFileSync(dataFile, 'utf8')
    products = JSON.parse(raw)
  } catch (e) {
    // ignore
  }

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

  pages.forEach((p) => {
    xml += '  <url>\n'
    xml += `    <loc>${baseUrl}${p}</loc>\n`
    xml += '  </url>\n'
  })

  products.forEach((prod) => {
    xml += '  <url>\n'
    xml += `    <loc>${baseUrl}/products/${prod.id}</loc>\n`
    xml += '  </url>\n'
  })

  xml += '</urlset>'

  res.setHeader('Content-Type', 'text/xml')
  res.write(xml)
  res.end()

  return { props: {} }
}

export default function Sitemap() {
  // getServerSideProps will handle the response
  return null
}
