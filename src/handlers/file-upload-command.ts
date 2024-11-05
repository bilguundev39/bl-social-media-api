import { Request, Response } from 'express'
import { handleError } from '../utils/handle-error'
import { handleResponse } from '../utils/handle-response'
import { allowedContentTypes, MAX_CONTENT_LENGTH, UPLOAD_FOLDER } from '../utils/file'
import path from 'path'
import fs from 'fs'
import { ServiceException } from '../exceptions/service-exception'
import { FileUploadCommandPayload } from './types'
import { fileUploadSchema } from '../validation/validation-schemas'
import redis from '../redis/redis'

export const fileUploadCommandHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const payload: FileUploadCommandPayload = fileUploadSchema.parse(req.params)

    const url = await redis.client.get(payload.fileId)
    if ((url === null || url === undefined) && req.headers.referer !== 'social-media-service') {
      throw new ServiceException('Invalid url, may be url expired', 400)
    }

    const contentType = req.headers['content-type']
    if (contentType === null || contentType === undefined) {
      console.log('Content-type not found, make sure correct file is being sent')
      throw new ServiceException('Content type is not allowed', 400)
    }

    if (allowedContentTypes[contentType] === null || allowedContentTypes[contentType] === undefined) {
      throw new ServiceException('Invalid content type', 400)
    }

    const contentLength = req.headers['content-length']
    if (contentLength !== null && Number(contentLength) > Math.floor(MAX_CONTENT_LENGTH)) {
      throw new ServiceException('File size exceeded', 400)
    }

    if (process.env.FILE_BASE_URL === null || process.env.FILE_BASE_URL === undefined) {
      console.log('FILE_BASE_URL must be set!!!')
      throw new ServiceException('Unexpected exception', 404)
    }

    const filename = payload.fileId
    const filePath = path.join(__dirname, '..', 'file-storage', UPLOAD_FOLDER, `${filename.toString()}.${allowedContentTypes[contentType]}`)
    const fileStream = fs.createWriteStream(filePath)
    const imageUrl = `${process.env.FILE_BASE_URL}api/file/${filename.toString()}.${allowedContentTypes[contentType]}`

    let errorOccurred = false

    req.on('data', (chunk) => {
      fileStream.write(chunk)
    })

    req.on('end', () => {
      // closes file stream when its finished
      // eslint-disable-next-line
      fileStream.end(async () => {
        if (!errorOccurred) {
          // once upload image succesfully, expire current presigned url
          await redis.client.del(payload.fileId)
        }
      })
    })

    req.on('error', (err) => {
      errorOccurred = true

      fileStream.close()
      fs.unlink(filePath, () => {
        console.error('File upload failed and file was deleted:', err)
        res.status(500).json({ error: 'File upload failed' })
      })
    })

    fileStream.on('error', (err) => {
      errorOccurred = true

      fs.unlink(filePath, () => {
        console.error('Error writing file and file was deleted:', err)
        res.status(500).json({ error: 'Error saving file' })
      })
    })

    handleResponse(res, 200, { message: 'Resource uploaded succesfully', imageUrl })
  } catch (error) {
    handleError(res, error)
  }
}
