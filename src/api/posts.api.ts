import { apiClient } from '../services/api';
import type { FeedResponse, Post, CreatePostDto } from '../types';

export const postsApi = {
  /**
   * Lấy danh sách Newsfeed cuộn vô tận (Cursor Pagination)
   */
  getFeed: async (cursor?: number | null, take: number = 10, search?: string): Promise<FeedResponse> => {
    const params = new URLSearchParams();
    if (cursor !== undefined && cursor !== null) params.append('cursor', cursor.toString());
    params.append('take', take.toString());
    if (search && search.trim()) params.append('search', search.trim());

    return apiClient.get(`/posts/feed?${params.toString()}`) as unknown as Promise<FeedResponse>;
  },

  /**
   * Lấy chi tiết một bài viết kèm thông tin tác giả và bình luận
   */
  getPostById: async (id: number): Promise<Post> => {
    return apiClient.get(`/posts/${id}`) as unknown as Promise<Post>;
  },

  /**
   * Upload tối đa 5 file ảnh đính kèm bài viết (multipart/form-data)
   */
  uploadImages: async (files: File[]): Promise<{ items: Array<{ url: string; filename?: string }> }> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    return apiClient.post('/posts/upload-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }) as unknown as Promise<{ items: Array<{ url: string; filename?: string }> }>;
  },

  /**
   * Tạo bài viết mới (Backend DTO: { title, content, published })
   */
  createPost: async (data: CreatePostDto): Promise<Post> => {
    return apiClient.post('/posts', {
      title: data.title,
      content: data.content,
      published: data.published ?? true,
    }) as unknown as Promise<Post>;
  },

  /**
   * Xóa bài viết (Chỉ tác giả hoặc ADMIN)
   */
  deletePost: async (id: number): Promise<void> => {
    return apiClient.delete(`/posts/${id}`) as unknown as Promise<void>;
  },
};

export default postsApi;
