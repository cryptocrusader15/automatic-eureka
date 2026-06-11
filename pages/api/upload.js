import fs from 'fs'
import path from 'path'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end('Method Not Allowed')
  }

  try {
    const { filename, data } = req.body
    if (!filename || !data) return res.status(400).json({ error: 'Missing filename or data' })

    const matches = data.match(/^data:(image\/(png|jpeg|jpg|gif));base64,(.*)$/)
    let base64Data = data
    let ext = path.extname(filename)
    if (matches) {
      base64Data = matches[3]
      ext = '.' + matches[2]
    } else if (filename.indexOf('.') === -1 && ext === '') {
      // fallback
      ext = path.extname(filename) || '.png'
    }

    const imagesDir = path.join(process.cwd(), 'public', 'images')
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true })

    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
    const outPath = path.join(imagesDir, safeName)
    const buffer = Buffer.from(base64Data, 'base64')
    fs.writeFileSync(outPath, buffer)

    const webPath = `/images/${safeName}`
    res.status(200).json({ ok: true, path: webPath })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Upload failed' })
  }
}
