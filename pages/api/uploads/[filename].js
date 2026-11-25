import fs from 'fs'
import path from 'path'
import { getUploadDirectory } from '../../../lib/uploadStorage'

const contentTypes = {
  avif: 'image/avif',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp'
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', ['GET', 'HEAD'])
    return res.status(405).end('Method Not Allowed')
  }

  const filename = req.query.filename
  if (
    typeof filename !== 'string' ||
    path.basename(filename) !== filename ||
    !/^[a-f0-9-]+\.(avif|gif|jpg|png|webp)$/i.test(filename)
  ) {
    return res.status(400).end('Invalid image path')
  }

  try {
    const image = await fs.promises.readFile(path.join(getUploadDirectory(), filename))
    res.setHeader('Content-Type', contentTypes[path.extname(filename).slice(1).toLowerCase()])
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.setHeader('Content-Length', image.length)
    if (req.method === 'HEAD') return res.status(200).end()
    return res.status(200).send(image)
  } catch (error) {
    if (error.code === 'ENOENT') return res.status(404).end('Image not found')
    console.error('Failed to read uploaded image:', error)
    return res.status(500).end('Failed to read image')
  }
}
