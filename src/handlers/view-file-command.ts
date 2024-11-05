import { Request, Response } from 'express'
import { UPLOAD_FOLDER } from '../utils/file'
import path from 'path'
import fs from 'fs'

export const viewFileCommandHandler = async (req: Request, res: Response): Promise<void> => {
  const filename = req.params.filename
  const filePath = path.join(__dirname, '..', 'file-storage', UPLOAD_FOLDER, filename)

  const fileStats = fs.statSync(filePath)
  // const fileExtension = path.extname(filename).replace('.', '').toLowerCase() ?? 'application/octet-stream'

  res.setHeader('Content-Type', 'image/jpeg')
  res.setHeader('Content-Length', fileStats.size.toString())

  res.sendFile(filePath)
}
