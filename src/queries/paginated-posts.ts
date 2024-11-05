import { ServiceException } from '../exceptions/service-exception'
import { PaginatedPostQueryPayload } from '../handlers/paginated-post-query'
import { Query } from '../mediator/types'
import { Post, IPost } from '../models/post'
import { PaginatedPosts } from './types'

export const queryPaginatedPost = async (params: Query<PaginatedPostQueryPayload>): Promise<PaginatedPosts> => {
  return await getPaginatedPosts(params.payload.cursor, params.payload.limit, params.payload.direction)
}

const getPaginatedPosts = async (cursor: string | undefined, limit: number, direction: string): Promise<PaginatedPosts> => {
  if (!['next', 'prev'].includes(direction)) {
    throw new ServiceException('Wrong direction!', 400)
  }

  if ((cursor === null || cursor === undefined) && direction === 'prev') {
    throw new Error('Cursor must provided')
  }

  const fetchLimit = limit + 1 // Fetch one extra document to check if there's more data
  let query = {}

  // Build the query based on the cursor and direction
  if (cursor !== null && cursor !== undefined) {
    const lastDocument = await Post.findOne({ _id: cursor })
    if (lastDocument == null) {
      throw new Error('Invalid cursor')
    }

    const { commentCounts, createdAt, _id } = lastDocument

    if (direction === 'next') {
      query = {
        $or: [
          { commentCounts: { $lt: commentCounts } },
          { commentCounts, createdAt: { $lt: createdAt } },
          { commentCounts, createdAt, _id: { $lt: _id } }
        ]
      }
    } else if (direction === 'prev') {
      query = {
        $or: [
          { commentCounts: { $gt: commentCounts } },
          { commentCounts, createdAt: { $gt: createdAt } },
          { commentCounts, createdAt, _id: { $gt: _id } }
        ]
      }
    }
  }

  // Define sorting based on the direction
  const sortOrder = direction === 'next' ? -1 : 1
  const sort: any = { commentCounts: sortOrder, createdAt: sortOrder, _id: sortOrder }

  // Fetch results with the query and sorting
  let results: IPost[] = await Post.find(query).limit(fetchLimit).sort(sort).exec()

  // Reverse results if direction is "prev" to maintain correct order
  if (direction === 'prev') {
    results = results.reverse()
  }

  // Determine if there's more data (hasMore) and set the final data array (datas)
  const hasMore = results.length > limit
  const posts = hasMore ? results.slice(0, limit) : results

  // Set cursors for next and previous pages
  const nextCursor = hasMore ? posts[posts.length - 1]._id.toString() : null
  const prevCursor = (posts.length > 0) ? posts[0]._id.toString() : null

  // Determine hasPrev and hasMore for frontend navigation
  const hasPrev = Boolean((cursor === null || cursor === undefined) && direction === 'next')
  const hasMoreFinal = direction === 'next' ? hasMore : Boolean(cursor)

  return {
    posts,
    hasMore: hasMoreFinal,
    hasPrev,
    nextCursor,
    prevCursor
  }
}
