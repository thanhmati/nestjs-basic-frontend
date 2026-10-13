import { apiClient } from '../services/api';
import type { Comment } from '../types';

export interface CommentListResponse {
  items: Comment[];
  nextCursor?: number | null;
  hasMore?: boolean;
}

export const commentsApi = {
  /**
   * Lấy danh sách bình luận dưới bài viết (Cursor Pagination)
   */
  getComments: async (
    postId: number,
    cursor?: number | null,
    limit: number = 10,
  ): Promise<CommentListResponse | Comment[]> => {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor.toString());
    params.append('limit', limit.toString());

    return apiClient.get(`/posts/${postId}/comments?${params.toString()}`) as unknown as Promise<
      CommentListResponse | Comment[]
    >;
  },

  /**
   * Thêm bình luận mới dưới bài viết
   */
  createComment: async (postId: number, content: string): Promise<Comment> => {
    return apiClient.post(`/posts/${postId}/comments`, { content }) as unknown as Promise<Comment>;
  },

  /**
   * Xóa bình luận theo ID (Chỉ tác giả, chủ bài viết hoặc ADMIN)
   */
  deleteComment: async (id: number): Promise<void> => {
    return apiClient.delete(`/comments/${id}`) as unknown as Promise<void>;
  },
};

export default commentsApi;
