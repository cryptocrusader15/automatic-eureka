import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { getUploadDirectory } from '../../lib/uploadStorage'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb'
    }
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end('Method Not Allowed')
  }

  try {
    const data = req.body && req.body.data
    if (typeof data !== 'string') {
      return res.status(400).json({ ok: false, error: 'An image is required' })
    }

    const matches = data.match(/^data:(image\/(png|jpeg|gif|webp|avif));base64,([A-Za-z0-9+/]+={0,2})$/)
    if (!matches) {
      return res.status(400).json({ ok: false, error: 'Unsupported or invalid image format' })
    }

    const extensions = { png: 'png', jpeg: 'jpg', gif: 'gif', webp: 'webp', avif: 'avif' }
    const buffer = Buffer.from(matches[3], 'base64')
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(413).json({ ok: false, error: 'Image must be 10 MB or smaller' })
    }

    const filename = `${randomUUID()}.${extensions[matches[2]]}`
    const imagesDir = getUploadDirectory()
    await fs.promises.mkdir(imagesDir, { recursive: true })
    await fs.promises.writeFile(path.join(imagesDir, filename), buffer, { flag: 'wx' })

    const webPath = `/api/uploads/${filename}`
    res.status(200).json({ ok: true, path: webPath })
  } catch (error) {
    console.error('Upload failed:', error)
    res.status(500).json({ ok: false, error: 'Upload failed' })
  }
}
