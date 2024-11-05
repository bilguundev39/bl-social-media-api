import { ServiceException } from '../../exceptions/service-exception'
import { queryPaginatedPost } from '../../queries/paginated-posts'
import { afterEach } from 'node:test'
import { vi, describe, it, expect } from 'vitest'
import { Post } from '../../models/post'
import { mockPostsForPagination } from '../helper'

vi.mock('./models/Post')

describe('getPaginatedPosts', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should throw ServiceException if direction is invalid', async () => {
    await expect(queryPaginatedPost({
      type: 'sometype',
      payload: {
        limit: 10,
        direction: 'different' as unknown as 'next' | 'prev',
        cursor: undefined
      }
    }))
      .rejects
      .toThrowError(new ServiceException('Wrong direction!', 400))
  })

  it('should throw ServiceException if direction is prev but no cursor provided', async () => {
    await expect(queryPaginatedPost({
      type: 'sometype',
      payload: {
        limit: 10,
        direction: 'prev',
        cursor: undefined
      }
    }))
      .rejects
      .toThrowError(new ServiceException('Cursor must provided', 400))
  })

  it('should throw ServiceException complain about cursor is not ObjectId', async () => {
    await expect(queryPaginatedPost({
      type: 'sometype',
      payload: {
        limit: 10,
        direction: 'prev',
        cursor: 'some_cursor'
      }
    }))
      .rejects
      .toThrowError(new ServiceException('Cast to ObjectId failed for value "some_cursor" (type string) at path "_id" for model "posts"', 400))
  })

  it('should throw ServiceException complain about cursor is not ObjectId', async () => {
    Post.findOne = vi.fn().mockResolvedValue(null)

    await expect(queryPaginatedPost({
      type: 'sometype',
      payload: {
        limit: 10,
        direction: 'prev',
        cursor: '6728caf34240846fa56853f1'
      }
    }))
      .rejects
      .toThrowError(new ServiceException('Invalid cursor', 400))
  })

  it('should return first 3 posts with most comment, matches the result as expected', async () => {
    Post.find = vi.fn().mockReturnValue({
      limit: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([mockPostsForPagination[0], mockPostsForPagination[1], mockPostsForPagination[2], mockPostsForPagination[3]])
    })

    const result = await queryPaginatedPost({
      type: 'sometype',
      payload: {
        limit: 3,
        direction: 'next',
        cursor: undefined
      }
    })

    expect(result.hasMore).toBe(true)
    expect(result.hasPrev).toBe(true)
    expect(result.nextCursor).toBe('6726f3fb6a71f284ec3f6cf4')
    expect(result.prevCursor).toBe('6726f3fe6a71f284ec3f6cfa')
  })

  it('should reverse when cursor direction is prev', async () => {
    Post.find = vi.fn().mockReturnValue({
      limit: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      exec: vi.fn().mockResolvedValue([mockPostsForPagination[3], mockPostsForPagination[2], mockPostsForPagination[1], mockPostsForPagination[0]])
    })

    Post.findOne = vi.fn().mockResolvedValue(mockPostsForPagination[0])

    const result = await queryPaginatedPost({
      type: 'sometype',
      payload: {
        limit: 3,
        direction: 'prev',
        cursor: '6726f3fe6a71f284ec3f6cfa'
      }
    })

    expect(result.posts).toStrictEqual([mockPostsForPagination[0], mockPostsForPagination[1], mockPostsForPagination[2]])
  })
})
