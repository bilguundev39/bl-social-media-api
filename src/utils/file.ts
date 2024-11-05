import fs from 'fs'
import path from 'path'

export const UPLOAD_FOLDER = 'upload'

export const allowedContentTypes: { [key: string]: string } = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/bmp': 'bmp'
}

export const MAX_CONTENT_LENGTH = 100 * 1024 * 1024

const initDirectories = (): boolean => {
  const uploadDir = path.join(__dirname, '..', 'file-storage', UPLOAD_FOLDER)
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
  }

  return false
}

export default {
  initDirectories
}
