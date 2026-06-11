import Head from 'next/head'

export default function Seo({ title, description, image, url }) {
  const siteName = 'Your Machinery Company'
  const fullTitle = title ? `${title} — ${siteName}` : siteName

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description || 'High-quality industrial machinery and equipment.'} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || 'High-quality industrial machinery and equipment.'} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": siteName,
        "url": url || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      }) }} />
    </Head>
  )
}
