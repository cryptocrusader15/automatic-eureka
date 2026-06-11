import fs from 'fs'
import path from 'path'

const dataFile = path.join(process.cwd(), 'data', 'products.json')

export default function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const raw = fs.readFileSync(dataFile, 'utf8')
      const data = JSON.parse(raw)
      res.status(200).json(data)
    } catch (e) {
      res.status(500).json({ error: 'Failed to read products' })
    }
    return
  }

  if (req.method === 'POST') {
    const body = req.body
    if (body.action === 'add') {
      try {
        const raw = fs.readFileSync(dataFile, 'utf8')
        const data = JSON.parse(raw)
        const newProduct = { ...body.product, id: String(Date.now()) }
        data.push(newProduct)
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf8')
        res.status(200).json({ ok: true, newProduct })
      } catch (e) {
        res.status(500).json({ error: 'Failed to add product' })
      }
      return
    }

    if (body.action === 'replace') {
      try {
        const products = body.products || []
        fs.writeFileSync(dataFile, JSON.stringify(products, null, 2), 'utf8')
        res.status(200).json({ ok: true })
      } catch (e) {
        res.status(500).json({ error: 'Failed to replace products' })
      }
      return
    }

    res.status(400).json({ error: 'Invalid action' })
    return
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
