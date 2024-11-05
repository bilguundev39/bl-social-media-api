import { IPost } from '../models/post'

export interface PaginatedPosts {
  posts: IPost[]
  hasMore: boolean
  hasPrev: boolean
  nextCursor: string | null
  prevCursor: string | null
}

export interface PresignedUrl {
  url: string
}

export const QUERY_PAGINATED_POST = 'QUERY_PAGINATED_POST'
export const QUERY_PRESIGNED_URL = 'QUERY_PRESIGNED_URL'
