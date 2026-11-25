import { addProduct, getProducts, replaceProducts } from '../../../lib/productStore'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      res.status(200).json(await getProducts())
    } catch (error) {
      console.error('Failed to read products:', error)
      res.status(500).json({ error: 'Failed to read products' })
    }
    return
  }

  if (req.method === 'POST') {
    const body = req.body || {}
    if (body.action === 'add') {
      if (!body.product || typeof body.product !== 'object' || Array.isArray(body.product)) {
        res.status(400).json({ ok: false, error: 'A product object is required' })
        return
      }
      try {
        const newProduct = await addProduct(body.product)
        res.status(200).json({ ok: true, newProduct })
      } catch (error) {
        console.error('Failed to add product:', error)
        res.status(500).json({ ok: false, error: 'Failed to add product' })
      }
      return
    }

    if (body.action === 'replace') {
      if (!Array.isArray(body.products)) {
        res.status(400).json({ ok: false, error: 'Products must be an array' })
        return
      }
      try {
        await replaceProducts(body.products)
        res.status(200).json({ ok: true })
      } catch (error) {
        console.error('Failed to replace products:', error)
        res.status(500).json({ ok: false, error: 'Failed to replace products' })
      }
      return
    }

    res.status(400).json({ error: 'Invalid action' })
    return
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
