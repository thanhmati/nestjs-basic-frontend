import { apiClient } from '../services/api';
import type { User, UpdateProfileDto } from '../types';

export const usersApi = {
  /**
   * Lấy danh sách thành viên trong hệ thống (User Directory)
   */
  getUsers: async (search?: string, limit: number = 50): Promise<User[]> => {
    const params = new URLSearchParams();
    if (search && search.trim()) params.append('search', search.trim());
    params.append('limit', limit.toString());

    return apiClient.get(`/users?${params.toString()}`) as unknown as Promise<User[]>;
  },

  /**
   * Xem hồ sơ công khai của thành viên khác
   */
  getUserById: async (id: number): Promise<User> => {
    return apiClient.get(`/users/${id}`) as unknown as Promise<User>;
  },

  /**
   * Xem thông tin hồ sơ của chính mình
   */
  getProfile: async (): Promise<User> => {
    return apiClient.get('/users/profile') as unknown as Promise<User>;
  },

  /**
   * Cập nhật hồ sơ cá nhân
   */
  updateProfile: async (data: UpdateProfileDto): Promise<User> => {
    return apiClient.patch('/users/profile', data) as unknown as Promise<User>;
  },

  /**
   * Upload ảnh đại diện mới
   */
  uploadAvatar: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);

    return apiClient.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }) as unknown as Promise<{ url: string }>;
  },
};

export default usersApi;
