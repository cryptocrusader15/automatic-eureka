import path from 'path'

export function getUploadDirectory() {
  return path.resolve(process.env.UPLOADS_DIR || path.join(process.cwd(), 'public', 'images'))
}
