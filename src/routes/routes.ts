import express from 'express'
import bodyParser from 'body-parser'
import { addPostCommandHandler } from '../handlers/add-post-command'
import { getPaginatedPostQueryHandler } from '../handlers/paginated-post-query'
import { addCommentCommandHandler } from '../handlers/add-comment-command'
import { deleteCommentCommandHandler } from '../handlers/delete-comment-command'
import { fileUploadCommandHandler } from '../handlers/file-upload-command'
import { presignedUrlCommandHandler } from '../handlers/presigned-url-query'
import { viewFileCommandHandler } from '../handlers/view-file-command'

const router = express.Router()

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

// handle posts
router.post('/posts/', addPostCommandHandler)
router.get('/posts', getPaginatedPostQueryHandler)
// handle comments
router.post('/posts/:postId/comment', addCommentCommandHandler)
router.delete('/posts/:postId/comment/:commentId', deleteCommentCommandHandler)

// handle file uploads
router.post('/upload/:fileId', fileUploadCommandHandler)
router.get('/upload/presigned', presignedUrlCommandHandler)
router.get('/file/:filename', viewFileCommandHandler)

export default router
